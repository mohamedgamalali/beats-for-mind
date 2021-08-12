const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
import nodeMailer from 'nodemailer';

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
        const oauth2Client = new OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        this.oauth2Client = oauth2Client.setCredentials({
            refresh_token: REFRESH_TOKEN
        });
    }

    private async generateAccessToken() {
        try {
            const token = await this.oauth2Client.getAccessToken();

            return token;

        } catch (err) {
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
                }
            });

            return transporter;

        } catch (err) {
            throw err;
        }
    }

    async send() {
        try {
            const transporter = await this.createTransport();

            await transporter.sendMail({
                subject: "Test",
                text: "I am sending an email from nodemailer!",
                to: "mohamedgamalali726@gmail.com",
                from: `${this.EMAIL} beats for mind`
            });


        } catch (err) {
            throw err;
        }
    }
}