import { Router, Response, request } from 'express';
import { verifyToken } from '../middlewares/authentication';
import bodyParser from 'body-parser';
import { Incidencia } from '../models/incidencias.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/fileSystem';
import userRoutes from './usuario';
import { Usuario } from '../models/usuario.model';





const incidenciaRoutes = Router();
const fileSystem = new FileSystem();

// Para obtener las incidencias paginadas
incidenciaRoutes.get('/', async (request: any, response: Response) => {

    let page = Number(request.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10; 


    const incidencias = await Incidencia.find()
                                        .sort({_id: -1})
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

// Para obtener las incidencias por usuario
incidenciaRoutes.get('/usuario', async (request: any, response: Response) => {

    const { user } = request.query;

    var mongoose = require('mongoose');
    var userId = mongoose.Types.ObjectId(user);

    const incidencias = await Incidencia.find({usuario: userId})
                                        .sort({_id: -1})
                                        .populate('usuario', '-password')
                                        .exec();

    response.json({
        //usuario,
        ok: true,
        incidencias
    })


});



//Con esto creamos las incidencias
incidenciaRoutes.post('/', [verifyToken], (request: any, response: Response) => {

    const body = request.body;
    body.usuario = request.usuario._id;
    const images = fileSystem.moveImagesFromTempToIncidencias(request.usuario._id);
    body.images = images; //the name is the same as in the model
    

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

incidenciaRoutes.post('/upload', [ verifyToken],async (request: any, response: Response) =>{

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
     await fileSystem.saveTempImg(file, request.usuario._id);

    response.json({
        ok: true,
        file: file.mimetype
    });

});

incidenciaRoutes.get('/image/:userid/:image', (request:any, response: Response) => {

    const userID = request.params.userid;
    const image = request.params.image;

    const pathPhoto = fileSystem.getPhotoUrl( userID, image)


    response.sendFile(pathPhoto);

});


userRoutes.get('/', [verifyToken], (request: any, response: Response) => {
    const usuario = request.usuario;

    response.json({
        ok: true,
        usuario
    })
})


export  default incidenciaRoutes;