import mongoose, { Schema, Document, Types } from 'mongoose'


const transSchema: Schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    plan:{
        type: Schema.Types.ObjectId,
        ref: 'plan',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    stripe_subscription_id:{
        type:String,
        required:true
    }

},{timestamps:true});

export type transaction = {
    user:Types.ObjectId,
    plan:Types.ObjectId,
    amount:number,
    stripe_subscription_id:string
}


export default mongoose.model<transaction & Document>('transaction', transSchema);