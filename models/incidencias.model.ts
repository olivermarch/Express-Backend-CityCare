import { Schema, Document, model } from 'mongoose';

const incidenciaSchema = new Schema({

    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    img:[{
        type: String
    }],
    coordenadas : {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario tiene que existir']
    }
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

}

export const Incidencia = model<IIncidencia> ('Incidencia', incidenciaSchema)