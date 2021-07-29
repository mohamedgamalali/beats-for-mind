import path from 'path';
import httpError from '../helpers/httpError';
import deleteFile from './file' ;

export type filesContainer = {
    image: string,
    imageCover: string,
    audio: string
} | any;

export default class beetData {
    static async files(files: any[]) {
        try {
            const imageExts: string[] = ['png', 'jpg', 'jpeg']
            const audioPath: string[] = ['wav', 'mp3'];

            let result: filesContainer ;

            if (files.length == 0) {
                const err = new httpError(404, 7, 'no files provided!!')
                throw err;
            }

            if (files.length > 3) {
                const err = new httpError(404, 7, 'more than 3 files')
                throw err;
            }



            files.forEach((file: any, index: number) => {
                const ext: string = path.extname(file.path);

                //if image
                if (imageExts.includes(ext)) {
                    if (index === 0) {
                        result.image == file.path;
                    } else if (index === 1) {
                        result.imageCover == file.path;
                    } else {
                        const err = new httpError(404, 7, 'image not in the right position')
                        throw err;
                    }
                } else { //audio
                    if(index === 3){
                        result.audio = file.path ;
                    }else{
                        const err = new httpError(404, 7, 'audio not in the right position')
                        throw err;
                    }
                }
            });

            return result ;


        } catch (err) {
            let paths:string[] = [] ;
            files.forEach(file=>{
                paths.push(file.path);
            });
            const dd = new deleteFile(paths);
            
            await dd.deleteFile()
            if (!err.status) {
                err.status = 500;
                err.state = 0;
            }
            throw err;
        }
    }


    
}