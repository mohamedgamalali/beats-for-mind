"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
const meddlewere_1 = __importDefault(require("./meddlewere"));
dotenv_1.config();
let app = express_1.default();
const port = process.env.PORT || 8080;
app = meddlewere_1.default(app);
mongoose_1.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
})
    .then((result) => {
    const server = app.listen(port);
    console.log(`server running in port ${port}..`);
}).catch(err => {
    console.log(err);
});
