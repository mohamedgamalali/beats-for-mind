import Category from '../models/catigory';

export default async()=>{
    try{
        const cat = await Category.findOne({name:'general'});
        if(!cat){
            const newCat = new Category({
                name:'general'
            });
            await newCat.save();
        }

        
    }catch(err){
        throw err
    }

}