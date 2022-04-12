"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server_1 = __importDefault(require("./classes/server"));
const incidencia_1 = __importDefault(require("./routes/incidencia"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const server = new server_1.default();
const uri = 'mongodb://localhost:27017/citycare';
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Subidas de archivos
server.app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
// Rutas
server.app.use('/user', usuario_1.default);
server.app.use('/incidencia', incidencia_1.default);
// Conectar DB
mongoose_1.default.connect(uri, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puertos ${server.port}`);
});
