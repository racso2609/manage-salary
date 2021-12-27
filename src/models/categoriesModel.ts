import mongoose = require('mongoose');
const Schema = mongoose.Schema;

interface categoryInterface {
  name: string;
  _id: mongoose.Schema.Types.ObjectId;
}

const CategoryModel = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

const Category = mongoose.model('Category', CategoryModel);
export {Category, categoryInterface}
