"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const incidencias_model_1 = require("../models/incidencias.model");
const fileSystem_1 = __importDefault(require("../classes/fileSystem"));
const usuario_1 = __importDefault(require("./usuario"));
const incidenciaRoutes = (0, express_1.Router)();
const fileSystem = new fileSystem_1.default();
// Para obtener las incidencias paginadas
incidenciaRoutes.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const incidencias = yield incidencias_model_1.Incidencia.find()
        .sort({ _id: -1 })
        .limit(10)
        .skip(skip)
        .populate('usuario', '-password')
        .exec();
    response.json({
        ok: true,
        incidencias,
        page
    });
}));
// Para obtener las incidencias por usuario
incidenciaRoutes.get('/usuario', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = request.query;
    var mongoose = require('mongoose');
    var userId = mongoose.Types.ObjectId(user);
    const incidencias = yield incidencias_model_1.Incidencia.find({ usuario: userId })
        .sort({ _id: -1 })
        .populate('usuario', '-password')
        .exec();
    response.json({
        //usuario,
        ok: true,
        incidencias
    });
}));
//Con esto creamos las incidencias
incidenciaRoutes.post('/', [authentication_1.verifyToken], (request, response) => {
    const body = request.body;
    body.usuario = request.usuario._id;
    const images = fileSystem.moveImagesFromTempToIncidencias(request.usuario._id);
    body.images = images; //the name is the same as in the model
    incidencias_model_1.Incidencia.create(body).then((incidenciaDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield incidenciaDB.populate('usuario', '-password');
        response.json({
            ok: true,
            incidencia: incidenciaDB
        });
    })).catch(err => {
        response.json(err);
    });
});
incidenciaRoutes.post('/upload', [authentication_1.verifyToken], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No file was uploaded'
        });
    }
    //const file: FileUpload = request.file.image;
    const file = (request.files.image);
    if (!file) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Not image was uploaded'
        });
    }
    if (!file.mimetype.includes('image')) {
        return response.status(400).json({
            ok: false,
            mensaje: 'This is not an image'
        });
    }
    //llamando al mmetodo para crear el directorio con el usuario y la imagen
    yield fileSystem.saveTempImg(file, request.usuario._id);
    response.json({
        ok: true,
        file: file.mimetype
    });
}));
incidenciaRoutes.get('/image/:userid/:image', (request, response) => {
    const userID = request.params.userid;
    const image = request.params.image;
    const pathPhoto = fileSystem.getPhotoUrl(userID, image);
    response.sendFile(pathPhoto);
});
usuario_1.default.get('/', [authentication_1.verifyToken], (request, response) => {
    const usuario = request.usuario;
    response.json({
        ok: true,
        usuario
    });
});
exports.default = incidenciaRoutes;
