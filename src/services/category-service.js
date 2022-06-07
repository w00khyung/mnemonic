import { categoryModel } from '../db';

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // category 추가
  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { name, code, codeRef } = categoryInfo;

    // 카테고리 중복 확인
    const categoryName = await this.categoryModel.findByCategory(name);
    if (categoryName) {
      throw new Error(
        '이 제품의 이름은 현재 카테고리 리스트에 있습니다. 새로 업데이트 해주세요.'
      );
    }
    const categoryCode = await this.categoryModel.findByCodeName(name);
    if (categoryCode) {
      throw new Error(
        '이 제품의 코드는 현재 카테고리 리스트에 있습니다. 새로 업데이트 해주세요.'
      );
    }

    // 제품 중복은 이제 아니므로, 제품을 추가함

    const newCategoryInfo = {
      name,
      code,
      codeRef,
    };

    // db에 저장
    const createdCategory = await this.categoryModel.create(newCategoryInfo);

    return createdCategory;
  }

  // 카테고리 목록을 받음.
  async getCategoryAll() {
    const category = await this.categoryModel.findAll();
    return category;
  }

  // 해당 카테고리 id 값으로 가져오기
  async getCategoryId(categoryId) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    const category = await this.categoryModel.findById(categoryId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error('제품이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return category;
  }

  // 해당 카테고리 id 값으로 가져오기
  async getCategoryCodeName(categoryCode) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    const category = await this.categoryModel.findByCodeName(categoryCode);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error('카테고리가 없습니다. 다시 한 번 확인해 주세요.');
    }
    return category;
  }

  // 해당 카테고리 id 값으로 가져오기
  async getCategoryCodeRef(categoryCodeRef) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    const category = await this.categoryModel.findById(categoryCodeRef);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error('카테고리가 없습니다. 다시 한 번 확인해 주세요.');
    }
    return category;
  }

  // 카테고리 삭제
  async deleteCategory(categoryId) {
    await this.categoryModel.deleteCategory(categoryId);
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
