import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Server from './classes/server';

const server = new Server();

const uri: string = 'mongodb://localhost:27017/citycare';


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// Rutas de mi app
server.app.use('/user', userRoutes );


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