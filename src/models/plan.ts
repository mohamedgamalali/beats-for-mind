import mongoose, { Schema, Document, Types } from 'mongoose'


const planSchema: Schema = new Schema({
    stripe_plan_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    interval:{
        type:String,
        required:true,
        enum:['day', 'month', 'year']
    },
    interval_count:{
        type:Number,
        required:true
    },
    oneTime:{
        type:Boolean,
        required:true
    }
},{timestamps:true});

export type plan = {
    stripe_plan_id:string,
    name:string,
    amount:number,
    interval:string,
    interval_count:number,
    oneTime:boolean
}


export default mongoose.model<plan & Document>('plan', planSchema);