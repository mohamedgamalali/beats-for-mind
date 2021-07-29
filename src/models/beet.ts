import mongoose, { Schema, Document, Types } from 'mongoose'


const beetSchema: Schema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    beet: {
        type: String,
        required: true
    },
    duration: String,
    hide: {
        type: Boolean,
        deafult: false
    },
    catigory: {
        type: Schema.Types.ObjectId,
        refPath: 'catigory',
        required:true
    }

}, { timestamps: true });

export type beet = {
    name: string,
    image: string,
    coverImage: string,
    beet: string,
    duration: string,
    hide: boolean,
    catigory:Types.ObjectId
}


export default mongoose.model<beet & Document>('beet', beetSchema);