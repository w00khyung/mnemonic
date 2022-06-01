const cartProductsContainer = document.querySelector('#cartProductsContainer');
const checkboxAll = document.querySelector('.checkboxAll');
const allDeleteBtn = document.querySelector('.allDeleteBtn');
const selectDeleteBtn = document.querySelector('.selectDeleteBtn');
const deliveryFeeInfo = document.querySelector('#deliveryFee');
const productsCountInfo = document.querySelector('#productsCount');
const productsTotalInfo = document.querySelector('#productsTotal');
const orderTotalInfo = document.querySelector('#orderTotal');
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
function cartPurchaseInfo() {
  let productsCount = 0;
  let productsTotal = 0;
  let deliveryFee = 3000;

  deliveryFeeInfo.innerHTML = `${deliveryFee.toLocaleString()}원`;
  for (let i = 1; i <= localStorage.length; i++) {
    const data = localStorage.getItem(i);
    const objectData = JSON.parse(data);
    productsCount += Number(objectData.quantity);
    productsTotal += Number(objectData.price);
  }

  productsCountInfo.innerText = `${productsCount.toLocaleString()}개`;
  productsTotalInfo.innerText = `${productsTotal.toLocaleString()}원`;
  orderTotalInfo.innerText = `${(
    productsTotal + deliveryFee
  ).toLocaleString()}`;
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
    const emptyCart = document.querySelector('.emptyCart');
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

function selectItemDelete() {
  const checkboxs = document.querySelectorAll('input[type="checkbox"]');
  console.log(checkboxs);
  let results;
  for (let i = 1; i < checkboxs.length; i++) {
    results = checkboxs[i].checked === true;
    const key = window.localStorage.key(results[i]);
    console.log(key);
  }

  //const result = checkboxs.map((e)=>e.checked===true)
}
loadItems();
cartDataDisplay();
cartPurchaseInfo();
allDeleteBtn?.addEventListener('click', () => {
  window.localStorage.clear();
  window.location.reload();
});
checkboxAll?.addEventListener('click', checkboxAllSelect);
selectDeleteBtn?.addEventListener('click', selectItemDelete);
