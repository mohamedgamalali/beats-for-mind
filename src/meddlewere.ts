import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
// import authAdmin from './routes/admin/auth'
// import adminUser from './routes/admin/user'
import musicAdmin from './routes/admin/music'
import musicAuthRequired from './routes/user/music'
import userAuth from './routes/user/auth'
// import userShopAuth from './routes/user/auth_required_shop'
// import userPay from './routes/user/pay'
import errorHandler from './helpers/error'
import path from 'path'
import passAuth from './services/passport';


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
    console.log(mint);
    
    if (mint[1] === 'png' ||
        mint[1] === 'jpg' ||
        mint[1] === 'jpeg'||
        mint[1] === 'wav' ||
        mint[1] === 'mp3' ||
        mint[1] === 'mpeg' ) {
        cb(null, true);
    } else {
        cb(null, false, new Error('only images or audio are allowed'));
    }
}

// const fileStorageBeets = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/beets');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// });




// const fileFilterBeets: any = (req: any, file: any, cb: any) => {
//     if (file.mimetype === 'audio/wav' ||
//         file.mimetype === 'audio/mp3' ) {
//         cb(null, true);
//     } else {
//         cb(null, false, new Error('only audio are allowed'));
//     }
// }


export default (app: Application) => {

    //bodyParser
    app.use(bodyParser.json());
    //passport
    app.use(passAuth.initialize());
    //multer image
    app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).array('image'));
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

    //admin
    // app.use('/admin', authAdmin);
   
    app.use('/admin/music', musicAdmin);

    // app.use('/admin/user', adminUser);


    
    // //user
    // //authrization not required
    // app.use('/user', shopUser);
    
    // //user auth
    app.use('/user/auth', userAuth);

    // //user shop 
    // //authrization required
    app.use('/music', musicAuthRequired);

    // app.use('/user/pay', userPay);

    //error handler
    app.use(errorHandler);

    return app;
}