"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() {
    }
    //EL payload contiene la informacion que debe estar dentro del token
    //La funcion retorna un string, el token
    static getJwToken(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.expirationTime });
    }
    static checkToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
//Semilla para generar los tokens de nuestra app
Token.seed = 'semilla_creadora?_de_firmas_secretas_con_express';
Token.expirationTime = '90d';
