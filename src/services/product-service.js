import { productModel } from '../db';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 회원가입
  async addProduct(productInfo) {
    // 객체 destructuring
    const { name, price, brand, content, imagePath, sellerId, category } =
      productInfo;

    // 제품 중복 확인
    const product = await this.productModel.findByProduct(name);
    if (product) {
      throw new Error(
        '이 제품은 현재 상품 리스트에 있습니다. 새로 업데이트 해주세요.'
      );
    }

    // 제품 중복은 이제 아니므로, 제품을 추가함

    const newProductInfo = {
      name,
      price,
      brand,
      content,
      imagePath,
      sellerId,
      category,
    };

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }

  // 상품 목록을 받음.
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  // 상품 목록을 받음.
  async getKeywordProducts(keyword) {
    const products = await this.productModel.findKeyword(keyword);
    return products;
  }

  // 제품정보 수정
  async setProduct(productInfoRequierd, toUpdate, curretUserId) {
    const productId = productInfoRequierd;

    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);
    if (product.sellerId._id !== curretUserId) {
      throw new Error(
        '판매자와 사용자의 ID가 틀립니다. 다시 한번 확인해주세요'
      );
    }
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }

    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }

  // 사용자 제품정보 수정
  async setUserProduct(productInfoRequierd, toUpdate) {
    const productId = productInfoRequierd;

    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }

    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }

  // 해당 아이디 제품 가져오기
  async getProduct(productId) {
    // 우선 해당 id의 제품이 db에 있는지 확인
    const product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return product;
  }

  // 제품 삭제
  async deleteProduct(productId) {
    await this.productModel.deleteproduct(productId);
  }

  // 카테고리별 제품들 가져오기 크키만큼!
  async getCategoryProducts(categoryId, start, end) {
    const products = await this.productModel.findByProductsOfCategory(
      categoryId,
      start,
      end - start
    );
    if (!products) {
      const stuckProduct = 0;
      return stuckProduct;
    }
    return products;
  }

  // 판매자 별 제품들 모두 가져오기
  async getSellerProducts(sellerId) {
    const products = await this.productModel.findByProductsOfSeller(sellerId);
    if (!products) {
      const stuckProduct = 0;
      return stuckProduct;
    }
    return products;
  }
}

const productService = new ProductService(productModel);

export { productService };
