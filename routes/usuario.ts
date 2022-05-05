import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/authentication';

const userRoutes = Router();

// To Login
userRoutes.post('/login', (request: Request, response: Response) => {

    const body = request.body;

    Usuario.findOne({ email: body.email }, ( err, userDB ) => {

        if (err) throw err;  //si encuentra un error de bases de datos, lanza el error

        if (!userDB) {      // SI encuentra un error en el usuario logeado
            return response.json({
                ok: false,
                mensaje: 'Wrong username or password'
            })
        }

        if (userDB.toCheckPassword(body.password)) {
            // si entra aqui, la contraseña es válida

            const token = Token.getJwToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                apellidos: userDB.apellidos,
                email: userDB.email,
                municipio: userDB.municipio
            })

            response.json({
                ok: true,
                token: token
            });
        } else{
            return response.json({
                ok: false,
                mensaje: 'Wrong username or password ***'
            })

        }
        
     })

});



// Crear un usuario
userRoutes.post('/create', ( request: Request, response: Response ) => {

    const user = {
        nombre   : request.body.nombre,
        apellidos: request.body.apellidos,
        email    : request.body.email,
        password : bcrypt.hashSync(request.body.password, 10),
        municipio: request.body.municipio
    };

    // Aqui mandamos el usuario creado a la bbdd, el metodo create manda el objeto usuario
    //Este metodo devuele una promesa
    Usuario.create( user ).then( userDB => {


        const token = Token.getJwToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            email: userDB.email,
            municipio: userDB.municipio
        })

        response.json({
            ok: true,
            token: token
        });

    }).catch( err => {
        response.json({
            ok: false,
            err
        });
    });
});

//Update user
userRoutes.post('/update', verifyToken, (request: any, response: Response) => {

    const user = {
        nombre: request.body.nombre || request.usuario.nombre,
        apellidos: request.body.apellidos || request.usuario.apellidos,
        email: request.body.email || request.usuario.email,
        municipio: request.body.municipio || request.usuario.municipio
    }

    Usuario.findByIdAndUpdate(request.usuario._id, user, { new: true}, (err, userDB) => {

        if (err) throw err;

        if (!userDB){

            return response.json({
                ok:false,
                mensaje: "There is no user with the given ID"
            })
        }

        const token = Token.getJwToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            apellidos: userDB.apellidos,
            email: userDB.email,
            municipio: userDB.municipio
        })

        response.json({
            ok: true,
            token: token
        });

    });

});



export default userRoutes;