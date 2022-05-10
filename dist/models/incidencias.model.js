"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incidencia = void 0;
const mongoose_1 = require("mongoose");
const incidenciaSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    images: [{
            type: String
        }],
    coordinates: {
        type: String
    },
    state: {
        type: String,
        default: 'En revisión'
    },
    municipio: {
        type: String,
    },
    support: {
        type: Number,
        default: 0
    },
    title: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario tiene que existir']
    }
});
incidenciaSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Incidencia = (0, mongoose_1.model)('Incidencia', incidenciaSchema);
