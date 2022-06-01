import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async findByProduct(name) {
    const product = await Product.findOne({ name })
      .populate('sellerId')
      .populate('category');
    return product;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId })
      .populate('sellerId')
      .populate('category');
    return product;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll() {
    const products = await Product.find({})
      .populate('sellerId')
      .populate('category');
    return products;
  }

  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedproduct = await Product.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedproduct;
  }
  // delteproduct 추가
  async deleteproduct(productId) {
    await Product.deleteOne({ _id: productId });
  }
}

const productModel = new ProductModel();

export { productModel };
