import mongoose, { Schema, Document } from 'mongoose'


const userSchema: Schema = new Schema({
    method: {
        type: String,
        required: true,
        enum: ['facebook', 'google', 'local']
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        },
        first_name: {
            type: String,

        },
        last_name: {
            type: String,

        },
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        name: {
            type: String
        },
        photo: {
            type: String,
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        name: {
            type: String
        },
        photo: {
            type: String,
        }
    },
    mobile: {
        type: String
    },
    blocked: {
        type: Boolean,
        default: false
    },
    verfied:{
        type:Boolean,
        default:false
    },
    stripeId:String
});

export type user = {
    method: string,
    local: {
        email: string
        password: string,
        first_name: string,
        last_name:string
    },
    google: {
        id: string,
        email: string,
        name: string,
        photo: string
    },
    facebook: {
        id: string,
        email: string,
        name: string,
        photo: string
    },
    mobile: string,
    blocked: boolean,
    verfied:boolean,
    stripeId:string
}


export default mongoose.model<user & Document>('user', userSchema);