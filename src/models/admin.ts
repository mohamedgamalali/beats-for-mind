import mongoose, { Schema, Document } from 'mongoose'


const adminSchemaa: Schema = new Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    }
});

export type admin = {
    email:string,
    password:string,
    name:string
}


export default mongoose.model<admin & Document>('admin', adminSchemaa);