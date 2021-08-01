const cloudinary = require('cloudinary').v2;

export default class saveImage {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async save(audio: boolean = false) {

        // if (audio) {
            // let img = await cloudinary.uploader.upload_stream(this.path);
            // return img;
        // } else {
            let img = await cloudinary.uploader.upload(this.path, { resource_type: "auto" });
            return img;
        // }
    }

}