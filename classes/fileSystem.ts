import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {


    getPhotoUrl(userID: string, image: string) {
        
        const pathPhoto = path.resolve(__dirname, '../uploads', userID, 'incidencias', image);

        // the case the image does not exist
        const exist = fs.existsSync(pathPhoto);
        if(!exist){
            return path.resolve(__dirname, '../assets/noexist.jpg');
        }

        return pathPhoto;
    }

    constructor(){};

    saveTempImg(file: FileUpload, userID: string){

        return new Promise<void>(( resolve, reject) =>{


            // create folder
            const path = this.createUserFolder(userID);
            // naming the file
            const nameFile = this.generateUniqueName(file.name);
            console.log(file.name); 
            console.log(nameFile); 
            // movin the file from temp to the final folder
            file.mv(`${path}/${nameFile}`, (err: any) => {
                if (err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    private generateUniqueName( originalNameFile: string){

        const nameArray = originalNameFile.split('.');
        const extension = nameArray[ nameArray.length - 1];

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

    moveImagesFromTempToIncidencias( userID: string){

        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp');
        const pathIncidencias = path.resolve( __dirname, '../uploads', userID, 'incidencias');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathIncidencias)) {
            fs.mkdirSync(pathIncidencias);
        }
        
        const tempImgs = this.getTempImg(userID);
        
        tempImgs.forEach(image => {
            fs.renameSync( `${ pathTemp }/${ image }`, `${ pathIncidencias }/${ image }` )
        });
        return tempImgs;
    }

    private getTempImg( userID: string){

        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp');

        return fs.readdirSync(pathTemp) || [];
    }
}