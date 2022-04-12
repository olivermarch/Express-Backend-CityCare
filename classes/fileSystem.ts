import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor(){};

    saveImgTemp(file: FileUpload, userID: string){

        const path = this.createUserFolder(userID);

        const nameFile = this.generateUniqueName(file.name);
        console.log(file.name); 
        console.log(nameFile); 
    }

    private generateUniqueName( originalNameFile: string){

        const nameArray = originalNameFile.split('.');
        const extension = nameArray[ nameArray.length - 1];
        console.log(extension);

        const idUnique = uniqid();
        
        return `${idUnique}.${extension}`;
    }

    private createUserFolder( userID: string){

        const pathUser = path.resolve( __dirname, '../uploads', userID);
        //dirname nos da el lugar de nuestro sistema donde esta actualmente, es un paquete de node 'path'
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);

        const thisExist = fs.existsSync(pathUser);

        if(!thisExist){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }
}