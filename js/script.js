'use strict';

// =================================================  //
// Variables
const productTitleInput = document.getElementById('title');
const productPriceInput = document.getElementById('price');
const productTaxesInput = document.getElementById('taxes');
const productAdsInput = document.getElementById('ads');
const productDiscountInput = document.getElementById('discount');
const productCountInput = document.getElementById('count');
const productCategoryInput = document.getElementById('category');

const productTotalPrice = document.getElementById('total-price');
const submitBtn = document.getElementById('submit');
const tableBody = document.querySelector('tbody');
const deleteAllBtn = document.querySelector('.delete-all-btn');

const searchInput = document.getElementById('search-input');
const searchBtnsContainer = document.querySelector('.search-btns');
// const searchBtn = document.getElementById('search-btn');


const products = JSON.parse(localStorage.getItem('products')) || [];
let submitBtnMood = 'create';
let searchMood = 'title';
let updateProductId;

// =================================================  //
// Functions

const updateProductsIndexes = function () {
  products.forEach((product, index) => (product.index = index));
};

// Update submit UI
const updateSubmitUi = function () {
  submitBtn.textContent = submitBtnMood;

  if (submitBtnMood === 'create') productCountInput.style.display = 'block';
  else productCountInput.style.display = 'none';
};

// Calc total price
const calcTotalPrice = function () {
  return (
    Number(productPriceInput.value) +
    Number(productTaxesInput.value) +
    Number(productAdsInput.value) -
    Number(productDiscountInput.value)
  );
};

// Get total price
const getTotalPrice = function () {
  if (productPriceInput.value === '') {
    productTotalPrice.classList.remove('active');
    productTotalPrice.textContent = '';
  } else {
    productTotalPrice.textContent = calcTotalPrice();

    productTotalPrice.classList.add('active');
  }
};

// Create product
const createProduct = function () {
  const product = {
    title: productTitleInput.value,
    price: +productPriceInput.value,
    taxes: +productTaxesInput.value,
    ads: +productAdsInput.value,
    discount: +productDiscountInput.value,
    totalPrice: calcTotalPrice(),
    count: +productCountInput.value,
    category: productCategoryInput.value,
  };

  if (product.count > 1) {
    for (let i = 0; i < product.count; i++) products.push(product);
  } else {
    products.push(product);
  }

  updateProductsIndexes();
  updateLocalStorage();
  // setTimeout(clearInputs, 300);
  clearInputs();
  readProducts();
  displayDeleteAllBtn();
};

// Update localstorage
const updateLocalStorage = function () {
  localStorage.setItem('products', JSON.stringify(products));
};

// Clear inputs
const clearInputs = function () {
  productTitleInput.value =
    productPriceInput.value =
    productTaxesInput.value =
    productAdsInput.value =
    productDiscountInput.value =
    productTotalPrice.innerText =
    productCountInput.value =
    productCategoryInput.value =
      '';

  productTotalPrice.classList.remove('active');
};

// Display product
const displayProduct = function (product) {
  const html = `
            <tr data-id="${product.index}">
              <!--<td>${product.index}</td>-->
              <td class="capitalize">${product.title}</td>
              <td>${product.price}</td>
              <td>${product.taxes}</td>
              <td>${product.ads}</td>
              <td>${product.discount}</td>
              <td>${product.totalPrice}</td>
              <td class="capitalize">${product.category}</td>
              <td><button type="button" class="update-btn">Update</button></td>
              <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
  `;
  tableBody.insertAdjacentHTML('beforeend', html);
};

// Read products
const readProducts = function () {
  updateProductsIndexes();
  tableBody.innerHTML = '';
  products.forEach((product) => displayProduct(product));
  displayDeleteAllBtn();
};

// Delete product
const deleteProduct = function (product) {
  const id = product.closest('tr').dataset.id;
  products.splice(id, 1);
  updateProductsIndexes();
  updateLocalStorage();
  readProducts();
  displayDeleteAllBtn();
};

// Update product
const updateProduct = function () {
  products[updateProductId].title = productTitleInput.value;
  products[updateProductId].price = +productPriceInput.value;
  products[updateProductId].taxes = +productTaxesInput.value;
  products[updateProductId].ads = +productAdsInput.value;
  products[updateProductId].discount = +productDiscountInput.value;
  products[updateProductId].category = productCategoryInput.value;

  updateLocalStorage();
  setTimeout(clearInputs, 300);
  readProducts();
  displayDeleteAllBtn();

  submitBtnMood = 'create';
  updateSubmitUi();
};

// Display update product
const displayUpdateProduct = function (product) {
  const id = product.closest('tr').dataset.id;

  productTitleInput.value = products[id].title;
  productPriceInput.value = products[id].price;
  productTaxesInput.value = products[id].taxes;
  productAdsInput.value = products[id].ads;
  productDiscountInput.value = products[id].discount;
  productCategoryInput.value = products[id].category;

  getTotalPrice();
  submitBtnMood = 'update';
  updateSubmitUi();
  updateProductId = id;
  scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Search product
const searchProducts = function () {
  const searchValue = searchInput.value.toLowerCase();
  let filteredProducts;
  if (searchMood === 'title') {
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
  } else if (searchMood === 'category') {
    filteredProducts = products.filter((product) =>
      product.category.toLowerCase().includes(searchValue)
    );
  }

  if (filteredProducts.length > 0) {
    tableBody.innerHTML = '';
    filteredProducts.forEach((product) => displayProduct(product));
  } else if (filteredProducts.length === 0 && searchInput.value !== '') {
    tableBody.innerHTML = '<tr><td>There is no product matched</td></tr>';
  } else readProducts();
};

// Display delete all button
const displayDeleteAllBtn = function () {
  if (products.length > 0) {
    deleteAllBtn.classList.add('active');
    deleteAllBtn.querySelector(
      '.products-count'
    ).innerHTML = `(${products.length})`;
  } else deleteAllBtn.classList.remove('active');
};

// Init the application
const init = function () {
  readProducts();
  displayDeleteAllBtn();
};

init();

// =================================================  //
// Events
productPriceInput.addEventListener('keyup', getTotalPrice);

productTaxesInput.addEventListener('keyup', getTotalPrice);

productAdsInput.addEventListener('keyup', getTotalPrice);

productDiscountInput.addEventListener('keyup', getTotalPrice);

submitBtn.addEventListener('click', () =>
  submitBtnMood === 'create' ? createProduct() : updateProduct()
);

tableBody.addEventListener('click', function (e) {
  const target = e.target;

  if (!target.closest('button')) return;

  if (target.classList.contains('delete-btn')) deleteProduct(target);
  else if (target.classList.contains('update-btn'))
    displayUpdateProduct(target);
});

deleteAllBtn.addEventListener('click', function () {
  products.splice(0);
  updateLocalStorage();
  readProducts();
});

searchBtnsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('title')) searchMood = 'title';
  else if (e.target.classList.contains('category')) searchMood = 'category';

  searchInput.placeholder = `Search by ${searchMood}`;
  searchInput.focus();
  searchInput.value = '';
});

searchInput.addEventListener('keyup', searchProducts);
