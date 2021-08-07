import { Types } from 'mongoose';
import Twilio, { Twilio as client } from 'twilio';

export default class twilio {

    private client: client;
    constructor(accountSid: string, authToken: string) {
        this.client = Twilio(accountSid, authToken);
    }

    async send(body: string, to: string) {
        try {
            try {
                const message = await this.client.messages.create({
                    body: body,
                    from: '(251) 308-6749',
                    to: to
                });
                return message;

            }catch(e){
                throw e;
            }
            
        } catch (err) {
            throw err;
        }
    }


}