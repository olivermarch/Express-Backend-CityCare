import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'The user name is required' ]
    },
    apellidos: {
        type: String,
        required: [ true, 'The user surname is required' ]
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'The email is required' ]
    },
    password: {
        type: String,
        required: [ true, 'The password is required']
    },
    municipio: {
        type: String,
        required: [ true, 'The municipio is required']
    }

});


usuarioSchema.method('toCheckPassword', function( password: string=''): boolean {

    if(bcrypt.compareSync(password, this.password)) {
        return true;
    }else{
        return false;
    }
});


interface IUsuario extends Document {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    municipio: string;


    toCheckPassword(password: string): boolean;
}



export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
