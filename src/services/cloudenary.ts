const cloudinary = require('cloudinary').v2;

export default class saveImage{
    path:string;

    constructor(path:string){
        this.path = path ;
    }

    async save(){
        
        let img = await cloudinary.uploader.upload(this.path);
        return img ;

    }




}