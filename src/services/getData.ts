
import { Types, Document } from 'mongoose'
import Beet, { beet } from '../models/beet'
import Fev, { fev } from '../models/fev'
import Download, { download } from '../models/downloads'

export type getBeet = {
    total: number,
    beet: (beet & Document<any, any, any>)[],
    sortField: string
};

export default class getDate {
    readonly itemPerPage: number = 10;
    page: number;

    constructor(page: number) {
        this.page = page;
    }

    async Beets(tap: string, quiry: number,searchQ:any, userId: Types.ObjectId, catigory: boolean | Types.ObjectId = false) {
        let find: object = { hide: false };
        let total: number = 0;
        let beets: any = {};
        let finalPeet: any = [];
        enum sortFields {
            createdAt = 1, //date
            downloads,     //most downloads
            plays,         //most plays
            fev,           //most fev
        };


        if (catigory) {
            find = {
                ...find,
                catigory: catigory
            }
        }

        if(searchQ){
            find = {
                ...find,
                name: new RegExp(searchQ.trim(), 'i')
            }
        }


        if (tap == 'home') {
            beets = await Beet.find(find)
                .select('name image coverImage beet hide createdAt')
                .sort([[sortFields[quiry], -1]])
                .skip((this.page - 1) * this.itemPerPage)
                .limit(this.itemPerPage);



            total = await Beet.find(find).countDocuments();

            const favorites: any = await Fev.find({ user: userId });
            finalPeet = []

            beets.forEach((item: any) => {
                let f: boolean = false;
                const incloude = favorites.filter((i: any) => i.user == userId && i.beet == item._id.toString());

                if (incloude.length > 0) {
                    f = true;
                }
                finalPeet.push({
                    beet: item,
                    fev: f
                });
            })
        } else if (tap == 'downloads') {

            beets = await Download.find({ user: userId })
                .select('beet')
                .sort([[sortFields[quiry], -1]])
                .skip((this.page - 1) * this.itemPerPage)
                .limit(this.itemPerPage)
                .populate({
                    path: 'beet',
                    select: 'name image coverImage beet hide createdAt'
                })
            total = await Download.find({ user: userId }).countDocuments();

            const favorites: any = await Fev.find({ user: userId });
            finalPeet = []

            beets.forEach((item: any) => {
                let f: boolean = false;
                const incloude = favorites.filter((i: any) => i.user == userId && i.beet == item._id.toString());

                if (incloude.length > 0) {
                    f = true;
                }
                finalPeet.push({
                    beet: item.beet,
                    fev: f
                });
            })
        } else if (tap == 'fev') {
            beets = await Fev.find({ user: userId })
                .select('beet')
                .sort([[sortFields[quiry], -1]])
                .skip((this.page - 1) * this.itemPerPage)
                .limit(this.itemPerPage)
                .populate({
                    path: 'beet',
                    select: 'name image coverImage beet hide createdAt'
                })
            total = await Fev.find({ user: userId }).countDocuments();

            finalPeet = []
            beets.forEach((item: any) => {
                finalPeet.push({
                    beet: item.beet,
                    fev: true
                });
            })
        }



        const result: getBeet = {
            total: total,
            beet: finalPeet,
            sortField: sortFields[quiry]
        }

        return result;


    }


}