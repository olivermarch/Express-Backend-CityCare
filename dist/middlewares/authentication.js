"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const token_1 = __importDefault(require("../classes/token"));
const verifyToken = (request, response, next) => {
    const userToken = request.get('x-token') || ''; //si no recibe token al verificar dara error, asi que le asignamos un string vacio
    token_1.default.checkToken(userToken).then((decoded) => {
        request.usuario = decoded.usuario;
        next();
    })
        .catch(err => {
        response.json({
            ok: false,
            mensaje: 'The token is not valid'
        });
    });
};
exports.verifyToken = verifyToken;
