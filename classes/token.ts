import jwt from 'jsonwebtoken';

export default class Token{


    //Semilla para generar los tokens de nuestra app
    private static seed: string = 'semilla_creadora?_de_firmas_secretas_con_express';
    private static expirationTime: string =  '90d';

    constructor(){
    }
    
    //EL payload contiene la informacion que debe estar dentro del token
    //La funcion retorna un string, el token
    static getJwToken( payload: any): string{
        return jwt.sign({
            usuario: payload
        },this.seed, {expiresIn: this.expirationTime});
    }

    static checkToken( userToken: string) {

        return new Promise( (resolve, reject) => {

            jwt.verify( userToken, this.seed, (err, decoded ) =>{

                if (err) {
                    reject();
                }else{
                    resolve( decoded);
                }
            }) 
        });
    }
}   