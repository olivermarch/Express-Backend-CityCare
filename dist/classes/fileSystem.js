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
    saveTempImg(file, userID) {
        return new Promise((resolve, reject) => {
            // create folder
            const path = this.createUserFolder(userID);
            // naming the file
            const nameFile = this.generateUniqueName(file.name);
            console.log(file.name);
            console.log(nameFile);
            // movin the file from temp to the final folder
            file.mv(`${path}/${nameFile}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generateUniqueName(originalNameFile) {
        const nameArray = originalNameFile.split('.');
        const extension = nameArray[nameArray.length - 1];
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
    moveImagesFromTempToIncidencias(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        const pathIncidencias = path_1.default.resolve(__dirname, '../uploads', userID, 'incidencias');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathIncidencias)) {
            fs_1.default.mkdirSync(pathIncidencias);
        }
        const tempImgs = this.getTempImg(userID);
        tempImgs.forEach(image => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathIncidencias}/${image}`);
        });
        return tempImgs;
    }
    getTempImg(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
}
exports.default = FileSystem;
