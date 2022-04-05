import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';

const server = new Server();
const uri: string = 'mongodb://localhost:27017/fotosdb';

server.app.use('/user', userRoutes )

//Conectar DB Mongo


mongoose.connect(uri, 
                 ( err ) => {
 
   if ( err ) throw err;
 
   console.log('Base de datos ONLINE');
})

//Levantar el server express

server.start( () => {
    console.log(`Corriendo en el puertos ${ server.port}`);
} )