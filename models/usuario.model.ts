import e from 'express';
import { Schema, model} from 'mongoose';

const usuarioSchema = new Schema({

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
        required: [ true, 'El correo electrónico es obligatorio']
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria']
    }
});

interface Iusuario extends Document {
    nombre: string;
    avatar: string,
    email: string;
    password: string;
}

export const Usuario = model<Iusuario>('Usuario', usuarioSchema);