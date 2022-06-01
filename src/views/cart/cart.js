const cartProductsContainer = document.querySelector('#cartProductsContainer');
const checkboxAll = document.querySelector('.checkboxAll');
const allDeleteBtn = document.querySelector('.allDeleteBtn');
const selectDeleteBtn = document.querySelector('.selectDeleteBtn');
// 저장된 json 데이터 localstorage에 저장
async function loadItems() {
  const res = await fetch('./cart.json');
  const jsonData = await res.json();
  const result = jsonData.cart;

  for (let i = 0; i < result.length; i += 1) {
    const { name, price, brand, content, imagePath, quantity } = result[i];
    const productData = {
      name: name,
      price: price,
      brand: brand,
      content: content,
      imagePath: imagePath,
      quantity: quantity,
    };
    const storageData = JSON.stringify(productData);
    localStorage.setItem(i + 1, storageData);
  }
}

function checkboxAllSelect() {
  const checkboxs = document.querySelectorAll('input[type="checkbox"]');

  for (let i = 0; i < checkboxs.length; i++) {
    if (checkboxAll.checked === true) {
      checkboxs[i].checked = true;
    } else {
      checkboxs[i].checked = false;
    }
  }
}

function cartDataDisplay() {
  // let data = {
  // 	name: '아이보리 니트',
  // 	price: '19,000원',
  // 	brand: '스플래시',
  // 	content: '따뜻한 느낌을 줍니다. 지금깥은 날씨에 제격입니다!',
  // 	imagePath: `<img src="../knit.jpg">`,
  // };

  // localStorage에 저장된 값 가져와서 장바구니에 출력
  if (localStorage.length !== 0) {
    const emptyCart = document.querySelector('.empty_cart');
    emptyCart.style.display = 'none';
  }
  for (let i = 0; i < localStorage.length; i += 1) {
    const data = localStorage.getItem(i + 1);
    const objectData = JSON.parse(data);
    cartProductsContainer.insertAdjacentHTML(
      'beforeend',
      `
    <div class="cart-product-item">
      <div>
        <input type="checkbox">
      </div>
      <div>
        ${objectData.imagePath}
      </div>
      <div>
        ${objectData.name}
      </div>
      <div>
        ${objectData.price}
      </div>
      <div>
        ${objectData.quantity}
      </div> 
    </div>
    `
    );
  }
}

function selectItemDelete() {}
loadItems();
cartDataDisplay();

allDeleteBtn?.addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});
checkboxAll?.addEventListener('click', checkboxAllSelect);
selectDeleteBtn?.addEventListener('click', selectItemDelete);
