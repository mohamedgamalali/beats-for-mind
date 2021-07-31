import { Types, Document } from 'mongoose'
import Beet, { beet } from '../models/beet'

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

    async Beets(quiry: number, catigory: boolean | Types.ObjectId = false) {
        let find: object = { hide: false };
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

        const beets = await Beet.find()
            .select('name image coverImage beet hide')
            .sort([[sortFields[quiry], -1]])
            .skip((this.page - 1) * this.itemPerPage)
            .limit(this.itemPerPage)

        const total: number = await Beet.find(find).countDocuments();

        const result: getBeet = {
            total: total,
            beet: beets,
            sortField: sortFields[quiry]
        }

        return result;


    }


}