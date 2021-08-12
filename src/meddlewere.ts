import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import authAdmin from './routes/admin/auth'
// import adminUser from './routes/admin/user'
import musicAdmin from './routes/admin/music'
import musicAuthRequired from './routes/user/music'
import streamController from './routes/stream/stream'
import userAuth from './routes/user/auth'
// import userShopAuth from './routes/user/auth_required_shop'
import userPay from './routes/user/pay'
import errorHandler from './helpers/error'
import path from 'path'
import passAuth from './services/passport';
import createElements from './helpers/createElements';
import response from './helpers/Response';

const cloudinary = require('cloudinary').v2;


//multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // if(file.mimetype == 'audio/wav' || file.mimetype == 'audio/mp3'){
        // cb(null, 'uploads/beets');
        // }else{
        cb(null, 'uploads');
        // }
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});




const fileFilter: any = (req: any, file: any, cb: any) => {
    const mint = file.mimetype.split('/')

    if (mint[1] === 'png' ||
        mint[1] === 'jpg' ||
        mint[1] === 'jpeg' ||
        mint[1] === 'wav' ||
        mint[1] === 'mp3' ||
        mint[1] === 'mpeg') {
        cb(null, true);
    } else {
        cb(null, false, new Error('only images or audio are allowed'));
    }
}




export default (app: Application) => {

    createElements();
    //bodyParser
    app.use(bodyParser.json());
    //passport
    app.use(passAuth.initialize());
    //multer image
    app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).array('image'));

    app.use(express.static(path.join(__dirname, 'templates')));

    //block audio from static files
    app.use('/uploads/:fileName',(req:Request, res:Response, next:NextFunction)=>{
        const exicName = path.extname(req.params.fileName);
        
        if(exicName !='.png' && exicName !='.jpg' && exicName !='.jpeg'){
            return response.unauthorized(res, "can't access audio files this way ya kosomak")
        }
        
        next();
    });

    app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));
    //multer beet
    // app.use(multer({ storage: fileStorageBeets, fileFilter: fileFilterBeets }).array('beet'));
    // app.use('/uploads/beets', express.static(path.join(__dirname, '../', 'uploads/beets')));

    //headers meddlewere
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        next();
    });

    cloudinary.config({
        cloud_name: process.env.cloudinary_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_HEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    //admin
    // app.use('/admin', authAdmin);

    app.use('/admin/music', musicAdmin);
    app.use('/admin', authAdmin);

    // app.use('/admin/user', adminUser);



    // //user
    // //authrization not required
    // app.use('/user', shopUser);

    // //user auth
    app.use('/user/auth', userAuth);

    //user pay
    app.use('/user/pay', userPay);

    // //user shop 
    // //authrization required
    app.use('/music', musicAuthRequired);
    app.use('/stream', streamController);


    // app.use('/user/pay', userPay);

    //error handler
    app.use(errorHandler);

    return app;
}