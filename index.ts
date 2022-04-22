import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import fileUpload from 'express-fileupload';
import cors from 'cors';
import Server from './classes/server';

import incidenciaRoutes from './routes/incidencia';
import userRoutes from './routes/usuario';

const server = new Server();

const uri: string = 'mongodb://localhost:27017/citycare';


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// Subidas de archivos
server.app.use(fileUpload({useTempFiles: true}) );

// Rutas
server.app.use('/user', userRoutes );
server.app.use('/incidencia', incidenciaRoutes);


// Conectar DB
mongoose.connect(uri, 
                 ( err ) => {
 
   if ( err ) throw err;
 
   console.log('Base de datos ONLINE');
})

// Levantar express
server.start( () => {
    console.log(`Servidor levantado en puerto ${ server.port }`);
});

//CORS

server.app.use(cors({ 
    origin: true, 
    credentials: true
}));

