import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'The user name is required' ]
    },
    avatar: {
        type: String,
        default: 'avatar-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'The email is required' ]
    },
    password: {
        type: String,
        required: [ true, 'The password is required']
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
    email: string;
    password: string;
    avatar: string;

    toCheckPassword(password: string): boolean;
}



export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
