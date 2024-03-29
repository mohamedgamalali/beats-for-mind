const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
import nodeMailer from 'nodemailer';
import ejs from 'ejs'
import path from 'path'
export default class Email {
    private oauth2Client: any;
    readonly CLIENT_ID: string;
    readonly CLIENT_SECRET: string;
    readonly REFRESH_TOKEN: string;
    readonly EMAIL: string;
    constructor(CLIENT_ID: string, CLIENT_SECRET: string, REFRESH_TOKEN: string, EMAIL: string) {
        this.CLIENT_ID = CLIENT_ID;
        this.CLIENT_SECRET = CLIENT_SECRET;
        this.REFRESH_TOKEN = REFRESH_TOKEN;
        this.CLIENT_ID = CLIENT_ID;
        this.EMAIL = EMAIL;
        this.oauth2Client = new OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        // google.options({ auth: this.oauth2Client });

        // this.oauth2Client.setCredentials({
        //     refresh_token: REFRESH_TOKEN
        // });
    }

    private async generateAccessToken() {
        try {
            
            await this.oauth2Client.setCredentials({
                refresh_token: this.REFRESH_TOKEN
            });


            const token = await this.oauth2Client.getAccessToken();



            return token;

        } catch (err) {
            console.log(err);

            throw err;
        }
    }

    private async createTransport() {
        try {
            const accessToken = await this.generateAccessToken()
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: this.EMAIL,
                    accessToken,
                    clientId: this.CLIENT_ID,
                    clientSecret: this.CLIENT_SECRET,
                    refreshToken: this.REFRESH_TOKEN
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            return transporter;

        } catch (err) {
            throw err;
        }
    }

    async send(code:string, to:string) {
        try {
            const transporter = await this.createTransport();
            
           

            let finalCode ='' ;
            for(let i = 0 ; i<code.length ;i++){
                if(i%2==0){
                    finalCode = finalCode + ' ' + code[i]
                }else{
                    finalCode = finalCode + code[i]
                }
            }
            
            const ejsFile = await ejs.renderFile(path.join(__dirname,'../templates/email-form.ejs'),{
                code:finalCode,
            });
            await transporter.sendMail({
                subject: "beats for mind support",
                html: ejsFile,
                to: to,
                from: `${this.EMAIL} beats for mind`
            });


        } catch (err) {

            throw err;
        }
    }
}