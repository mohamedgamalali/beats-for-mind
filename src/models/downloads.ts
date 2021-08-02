import mongoose, { Schema, Document, Types } from 'mongoose'


const downloadsSchame: Schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    beet:{
        type: Schema.Types.ObjectId,
        ref: 'beet',
        required:true
    },

},{timestamps:true});

export type download = {
    user:Types.ObjectId,
    beet:Types.ObjectId
}


export default mongoose.model<download & Document>('downloads', downloadsSchame);