import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async findByProduct(name) {
    const product = await Product.findOne({ name })
      .populate({ path: 'sellerId', select: { password: 0, address: 0 } })
      .populate('category');
    return product;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId })
      .populate({ path: 'sellerId', select: { password: 0, address: 0 } })
      .populate('category');
    return product;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll() {
    const products = await Product.find({})
      .populate({ path: 'sellerId', select: { password: 0, address: 0 } })
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

  // category별 상품을 특정 개수만큼 가져오기
  async findByProductsOfCategory(categoryId, start, end) {
    try {
      const productsOfCategory = await Product.find({ category: categoryId })
        .populate({ path: 'sellerId', select: { password: 0, address: 0 } })
        .populate({ path: 'category' })
        .sort({ _id: -1 })
        .skip(start)
        .limit(end);
      return productsOfCategory;
    } catch {
      // 값이 없을 경우 undefined를 통해 프론트엔드 단에 0을 출력하게 된다.
      return undefined;
    }
  }

  async findByProductsOfSeller(sellerId) {
    try {
      const productsOfSeller = await Product.find({ sellerId })
        .populate({ path: 'sellerId', select: { password: 0, address: 0 } })
        .populate({ path: 'category' })
        .sort({ _id: -1 });

      return productsOfSeller;
    } catch {
      // 값이 없을 경우 undefined를 통해 프론트엔드 단에 0을 출력하게 된다.
      return undefined;
    }
  }
}

const productModel = new ProductModel();

export { productModel };
