import mongoose, { Schema, Document, Types } from 'mongoose'


const fevSchema: Schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        refPath: 'user',
        required:true
    },
    beet:{
        type: Schema.Types.ObjectId,
        refPath: 'beet',
        required:true
    },

},{timestamps:true});

export type fev = {
    user:Types.ObjectId,
    beet:Types.ObjectId
}


export default mongoose.model<fev & Document>('favorites', fevSchema);