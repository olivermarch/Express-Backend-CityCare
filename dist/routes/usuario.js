"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = (0, express_1.Router)();
// To Login
userRoutes.post('/login', (request, response) => {
    const body = request.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err; //si encuentra un error de bases de datos, lanza el error
        if (!userDB) { // SI encuentra un error en el usuario logeado
            return response.json({
                ok: false,
                mensaje: 'Wrong username or password'
            });
        }
        if (userDB.toCheckPassword(body.password)) {
            // si entra aqui, la contraseña es válida
            const token = token_1.default.getJwToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            response.json({
                ok: true,
                token: token
            });
        }
        else {
            return response.json({
                ok: false,
                mensaje: 'Wrong username or password ***'
            });
        }
    });
});
// Crear un usuario
userRoutes.post('/create', (request, response) => {
    const user = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: bcrypt_1.default.hashSync(request.body.password, 10),
        avatar: request.body.avatar
    };
    // Aqui mandamos el usuario creado a la bbdd, el metodo create manda el objeto usuario
    //Este metodo devuele una promesa
    usuario_model_1.Usuario.create(user).then(userDB => {
        const token = token_1.default.getJwToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        response.json({
            ok: true,
            token: token
        });
    }).catch(err => {
        response.json({
            ok: false,
            err
        });
    });
});
//Update user
userRoutes.post('/update', authentication_1.verifyToken, (request, response) => {
    const user = {
        nombre: request.body.nombre || request.usuario.nombre,
        email: request.body.email || request.usuario.email,
        avatar: request.body.avatar || request.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(request.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return response.json({
                ok: false,
                mensaje: "There is no user with the given ID"
            });
        }
        const token = token_1.default.getJwToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        response.json({
            ok: true,
            token: token
        });
    });
});
exports.default = userRoutes;
