import mongoose, { Schema, Document } from 'mongoose'


const catigorySchema: Schema = new Schema({
    name:{
        type:String,
        require:true
    }
});

export type catigory = {
    name:string
}


export default mongoose.model<catigory & Document>('catigory', catigorySchema);