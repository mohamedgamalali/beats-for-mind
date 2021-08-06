import Category from '../models/catigory';
import Admin from '../models/admin';
import bcrypt from 'bcryptjs'
export default async () => {
    try {
        await createCat();
        await createAdmin();


    } catch (err) {
        throw err
    }

}

const createCat = async () => {
    try {
        const cat = await Category.findOne({ name: 'general' });
        if (!cat) {
            const newCat = new Category({
                name: 'general'
            });
            await newCat.save();
        }


    } catch (err) {
        throw err
    }

}

const createAdmin = async () => {
    try {
        const admin = await Admin.findOne({ email: 'admin@admin.com' });
        if (!admin) {
            const password = await bcrypt.hash('500500', 12)
            const newAdmin = new Admin({
                email: 'admin@admin.com',
                password: password,
                name: 'admin'
            });

            await newAdmin.save();

            console.log('admin created..');

        }


    } catch (err) {
        throw err
    }

}