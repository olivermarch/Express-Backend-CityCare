import { Router, Response } from 'express';
import { verifyToken } from '../middlewares/authentication';
import bodyParser from 'body-parser';
import { Incidencia } from '../models/incidencias.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/fileSystem';





const incidenciaRoutes = Router();
const fileSystem = new FileSystem();

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

incidenciaRoutes.post('/upload', [ verifyToken], (request: any, response: Response) =>{

    if (!request.files) {
            return response.status(400).json({
                ok:false,
                mensaje: 'No file was uploaded'
            });
    }

    //const file: FileUpload = request.file.image;
    const file: FileUpload  = (request.files.image) as FileUpload;

    if (!file) {
        return response.status(400).json({
            ok:false,
            mensaje: 'Not image was uploaded'
        });
    }

    if ( !file.mimetype.includes('image')) {
        return response.status(400).json({
            ok:false,
            mensaje: 'This is not an image'
        });
    }

    //llamando al mmetodo para crear el directorio con el usuario y la imagen
    fileSystem.saveImgTemp(file, request.usuario._id);

    response.json({
        ok: true,
        file: file.mimetype
    });

});


export  default incidenciaRoutes;