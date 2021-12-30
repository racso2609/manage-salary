import { Document, Schema, model } from 'mongoose';

interface categoryInterface extends Document {
    name: string;
}

const CategoryModel = new Schema<categoryInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Category = model('Category', CategoryModel);
export { Category, categoryInterface };
