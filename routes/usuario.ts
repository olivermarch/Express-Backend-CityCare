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
                email: userDB.email,
                avatar: userDB.avatar
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
        email    : request.body.email,
        password : bcrypt.hashSync(request.body.password, 10),
        avatar   : request.body.avatar
    };

    // Aqui mandamos el usuario creado a la bbdd, el metodo create manda el objeto usuario
    //Este metodo devuele una promesa
    Usuario.create( user ).then( userDB => {


        const token = Token.getJwToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
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

    response.json({
        ok: true,
        usuario: request.usuario
    });

});



export default userRoutes;