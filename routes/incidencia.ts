import { Router, Response } from 'express';
import { verifyToken } from '../middlewares/authentication';
import bodyParser from 'body-parser';
import { Incidencia } from '../models/incidencias.model';




const incidenciaRoutes = Router();

// Para obtener las incidencias paginadas
incidenciaRoutes.get('/', async (request: any, response: Response) => {

    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10; 


    const incidencias = await Incidencia.find()
                                        //.sort({_id: -1})
                                        .limit(10)
                                        .skip(skip)
                                        .populate('usuario', '-password')
                                        .exec();

    response.json({
        ok: true,
        incidencias,
        page
    })
});


//Con esto creamos las incidencias
incidenciaRoutes.post('/', [verifyToken], (request: any, response: Response) => {

    const body = request.body;
    body.usuario = request.usuario._id;

    

    Incidencia.create(body).then( async incidenciaDB => {

        await incidenciaDB.populate('usuario','-password');

        response.json({
            ok:true,
            incidencia: incidenciaDB
        })
        
    }).catch( err => {
        response.json(err)
    });

});


export  default incidenciaRoutes;