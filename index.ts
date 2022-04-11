import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Server from './classes/server';

import incidenciaRoutes from './routes/incidencia';
import userRoutes from './routes/usuario';

const server = new Server();

const uri: string = 'mongodb://localhost:27017/citycare';


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

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
    console.log(`Servidor corriendo en puertos ${ server.port }`);
});