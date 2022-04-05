"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const server = new server_1.default();
const uri = 'mongodb://localhost:27017/fotosdb';
server.app.use('/user', usuario_1.default);
//Conectar DB Mongo
mongoose_1.default.connect(uri, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
//Levantar el server express
server.start(() => {
    console.log(`Corriendo en el puertos ${server.port}`);
});
