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

const products = JSON.parse(localStorage.getItem('products')) || [];

// =================================================  //
// Functions

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
    count: +productCountInput,
    category: productCategoryInput.value,
  };

  products.push(product);
  updateLocalStorage();
  setTimeout(clearInputs, 300);
  displayProduct(product, products.length - 1);
};

// Delete product

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
const displayProduct = function (product, index) {
  const html = `
            <tr data-id="${index}">
              <!--<td>${index}</td>-->
              <td>${product.title}</td>
              <td>${product.price}</td>
              <td>${product.taxes}</td>
              <td>${product.ads}</td>
              <td>${product.discount}</td>
              <td>${product.totalPrice}</td>
              <td>${product.category}</td>
              <td><button type="button" class="update-btn">Update</button></td>
              <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
  `;
  tableBody.insertAdjacentHTML('beforeend', html);
};

// Read products
const readProducts = function () {
  tableBody.innerHTML = '';
  products.forEach((product, index) => displayProduct(product, index));
};

// Delete product
const deleteProdect = function (product) {
  const id = product.closest('tr').dataset.id;
  products.splice(id, 1);
  updateLocalStorage();
  readProducts();
};
// Update product

// Search product

// Init the application
const init = function () {
  readProducts();
};

init();

// =================================================  //
// Events
productPriceInput.addEventListener('keyup', getTotalPrice);
productTaxesInput.addEventListener('keyup', getTotalPrice);
productAdsInput.addEventListener('keyup', getTotalPrice);
productDiscountInput.addEventListener('keyup', getTotalPrice);
submitBtn.addEventListener('click', createProduct);
tableBody.addEventListener('click', function (e) {
  const target = e.target;

  if (!target.closest('button')) return;

  if (target.classList.contains('delete-btn')) deleteProdect(target);
});
