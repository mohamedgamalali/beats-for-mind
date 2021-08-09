import User, { user } from '../models/user';
import Downloads from '../models/downloads';
import { Types } from 'mongoose';
import httpError from '../helpers/httpError'

export default class downloadHandler {
    private user: user;

    constructor(user: user) {
        this.user = user;
    }

    async countDownloads() {
        try {
            const today = new Date();
            const dayDownloads = await Downloads.find({
                user: this.user._id,
                createdAt: {
                    $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                    $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                }
            }).countDocuments()

            const perDay = this.user.downloadsPerDay;
            const freeDownloads = this.user.freeDownloads;

            return {
                perDay: perDay - dayDownloads,
                freeDownloads: freeDownloads
            }
        } catch (err) {
            throw err;
        }


    }

    async onDownload(beatId: Types.ObjectId) {
        try {
            const count = await this.countDownloads();

            if (count.perDay > 0) {

                const newDown = new Downloads({
                    user: this.user._id,
                    beet: beatId
                })
                await newDown.save();

            } else if (count.freeDownloads > 0) {

                const newDown = new Downloads({
                    user: this.user._id,
                    beet: beatId
                })
                await newDown.save();

                const user = await User.findById(this.user._id).select('freeDownloads');
                if (user) {
                    user.freeDownloads = user.freeDownloads - 1;
                    await user.save();
                }


            } else {
                const err = new httpError(403, 1212, `can't download, no more downloads today or free beats`);
                throw err;
            }

        } catch (err) {
            throw err;
        }
    }
}