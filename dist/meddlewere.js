"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
// import authAdmin from './routes/admin/auth'
// import adminUser from './routes/admin/user'
// import shopAdmin from './routes/admin/shop'
// import shopUser from './routes/user/shop'
const auth_1 = __importDefault(require("./routes/user/auth"));
// import userShopAuth from './routes/user/auth_required_shop'
// import userPay from './routes/user/pay'
const error_1 = __importDefault(require("./helpers/error"));
const path_1 = __importDefault(require("path"));
// import passAuth from './services/passport';
//multer
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false, new Error('only images are allowed'));
    }
};
exports.default = (app) => {
    //bodyParser
    app.use(body_parser_1.default.json());
    //passport
    // app.use(passAuth.initialize());
    //multer
    app.use(multer_1.default({ storage: fileStorage, fileFilter: fileFilter }).array('image'));
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../', 'uploads')));
    //headers meddlewere
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        next();
    });
    //admin
    // app.use('/admin', authAdmin);
    // app.use('/admin/shop', shopAdmin);
    // app.use('/admin/user', adminUser);
    // //user
    // //authrization not required
    // app.use('/user', shopUser);
    // //user auth
    app.use('/user/auth', auth_1.default);
    // //user shop 
    // //authrization required
    // app.use('/user/auth/shop', userShopAuth);
    // app.use('/user/pay', userPay);
    //error handler
    app.use(error_1.default);
    return app;
};
