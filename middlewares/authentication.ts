import { Response, Request, NextFunction } from "express"
import Token from '../classes/token';
import { Usuario } from '../models/usuario.model';


export const verifyToken = (request: any, response: Response, next: NextFunction) => {


    const userToken = request.get('x-token') || ''; //si no recibe token al verificar dara error, asi que le asignamos un string vacio

    Token. checkToken ( userToken).then( (decoded: any) =>{

        request.usuario = decoded.usuario;
        next();
    })
    .catch(err => {

        response.json({
            ok: false,
            mensaje: 'The token is not valid'
        });
    });

}