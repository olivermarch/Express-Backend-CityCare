"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'avatar-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});
exports.Usuario = (0, mongoose_1.model)('Usuario', usuarioSchema);
