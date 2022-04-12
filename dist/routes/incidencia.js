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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const incidencias_model_1 = require("../models/incidencias.model");
const incidenciaRoutes = (0, express_1.Router)();
// Para obtener las incidencias paginadas
incidenciaRoutes.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const incidencias = yield incidencias_model_1.Incidencia.find()
        //.sort({_id: -1})
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
//Con esto creamos las incidencias
incidenciaRoutes.post('/', [authentication_1.verifyToken], (request, response) => {
    const body = request.body;
    body.usuario = request.usuario._id;
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
incidenciaRoutes.post('/upload', [authentication_1.verifyToken], (request, response) => {
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
    response.json({
        ok: true,
        file: file.mimetype
    });
});
//Servicio para subir archivos
// incidenciaRoutes.post( '/upload', [ verifyToken ], async (req: any, res: Response) => {
//     if ( !req.files ) {
//         return res.status(400).json({
//             ok: false,
//             mensaje: 'No se subió ningun archivo'
//         });
//     }
//     //const file = req.file.image;
//     res.json({
//         ok: true,
//         //file
//     });
// });
exports.default = incidenciaRoutes;
