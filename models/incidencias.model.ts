import { Schema, Document, model } from 'mongoose';

const incidenciaSchema = new Schema({

    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    images:[{
        type: String
    }],
    coordinates : {
        type: String
    },
    state : {
        type: String,
        default: 'En revisión'
    },
    municipio : {
        type: String,
    },
    support : {
        type: Number,
        default: 0
    },
    title : {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario tiene que existir']
    }
    // usuario: {
    //     type: String,
    //     required: [true, 'El usuario tiene que existir']
    // }
});

incidenciaSchema.pre<IIncidencia>('save', function( next ){
    this.created = new Date();
    next();
});

interface IIncidencia extends Document {

    created: Date;
    mensaje: string;
    img: string [];
    coordenadas: string;
    usuario: string;
    munucipio: string;
    support: number;

}

export const Incidencia = model<IIncidencia> ('Incidencia', incidenciaSchema)