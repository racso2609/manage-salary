import { Document, Schema, model } from 'mongoose';

type Category = Document & {
    name: string;
    color: string;
};

const CategoryModel = new Schema<Category>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        default: 'transaparent',
    },
});

const Category = model('Category', CategoryModel);
export default Category;
