"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    saveImgTemp(file, userID) {
        const path = this.createUserFolder(userID);
        const nameFile = this.generateUniqueName(file.name);
        console.log(file.name);
        console.log(nameFile);
    }
    generateUniqueName(originalNameFile) {
        const nameArray = originalNameFile.split('.');
        const extension = nameArray[nameArray.length - 1];
        console.log(extension);
        const idUnique = (0, uniqid_1.default)();
        return `${idUnique}.${extension}`;
    }
    createUserFolder(userID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userID);
        //dirname nos da el lugar de nuestro sistema donde esta actualmente, es un paquete de node 'path'
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);
        const thisExist = fs_1.default.existsSync(pathUser);
        if (!thisExist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
}
exports.default = FileSystem;
