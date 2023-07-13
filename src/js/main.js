const BASE_URL = "https://services-academlo-shopping.onrender.com/";

async function getProductsApi() {
  try {
    const data = await fetch(BASE_URL);
    const res = await data.json();
    window.localStorage.setItem("products", JSON.stringify(res));
    return res;
  } catch (error) {
    console.log("Error while fetching products:");
  }
}

function printProducts(dataBase) {
  let html = "";

  dataBase.products.forEach(function (product) {
    const { image, name, quantity, price, id, category } = product;
    const buttonAdd = quantity
      ? `<i class='bx bx-plus' id='${id}'></i>`
      : `<span class='sold__out'>Sold Out</span>`;
    const buttonMinus = quantity
      ? `<i class='bx bx-minus' id='${id}'></i>`
      : ``;

    const buttonTrash = quantity
      ? `<i class='bx bxs-trash' id='${id}'></i>`
      : ``;

    html += `
                      <div class='product ${category}' data-id='${id}' >
                             <div class="product__img" data-id='${id}'>
                                    <img data-id='${id}' src="${image}" alt="${name}" />
                             </div>
 
                             <div class="product__info" data-id='${id}'>
                             <h4 data-id='${id}'>${name} |<span data-id='${id}'><b>Stock</b>: ${quantity}</span></h4>
                             <h5>${buttonMinus}
                                    $${price}.00
                                    ${buttonAdd}
                                    ${buttonTrash}
                                    <span class='amount' id='${id}'></span>
                             </h5>
                             </div>
                             
                      </div>
               `;
  });

  document.querySelector(".products").innerHTML = html;
  //printAmountOnProducts(dataBase);
}

function showHideCart() {
  const carIconHTML = document.querySelector(".bx-cart-alt");
  const cartHTML = document.querySelector(".cart");

  carIconHTML.addEventListener("click", function () {
    cartHTML.classList.toggle("cart__show");
  });
}

function toggleDarkMode() {
  const darkModeIcon = document.querySelector(".bxs-moon");
  const container = document.querySelector("body");

  darkModeIcon.addEventListener("click", function () {
    container.classList.toggle("dark__mode");

    // Guardar el estado del modo oscuro en el almacenamiento local
    const isDarkModeEnabled = container.classList.contains("dark__mode");
    window.localStorage.setItem("darkMode", isDarkModeEnabled);
  });
}

function checkDarkMode() {
  const container = document.querySelector("body");
  const isDarkModeEnabled = JSON.parse(window.localStorage.getItem("darkMode"));

  if (isDarkModeEnabled) {
    container.classList.add("dark__mode");
  }
}

function handleMenuButton() {
  const menuButton = document.querySelector(".bx-menu");
  const menuLinksContainer = document.querySelector(".menu");

  menuButton.addEventListener("click", function () {
    menuLinksContainer.classList.toggle("menu__hidden");
    console.log(menuButton);
  });
}

function addToCartFromProducts(dataBase) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function (element) {
    if (element.target.classList.contains("bx-plus")) {
      //console.log(element.target.id);
      const id = Number(element.target.id);

      const findProduct = dataBase.products.find(function (element) {
        return element.id === id;
      });

      if (dataBase.cart[findProduct.id]) {
        if (findProduct.quantity === dataBase.cart[findProduct.id].amount)
          return alert("Not enough in Stock quantity");
        dataBase.cart[findProduct.id].amount++;
      } else {
        dataBase.cart[findProduct.id] = { ...findProduct, amount: 1 };
      }

      window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));

      printProductsToCart(dataBase);
      printInfoTotal(dataBase);
      printAmountProducts(dataBase);
    }
  });
}

function minusToCartFromProducts(dataBase) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function (element) {
    if (element.target.classList.contains("bx-minus")) {
      const id = Number(element.target.id);

      if (!dataBase.cart[id] || dataBase.cart[id].amount === 0) {
        return;
      }
      if (dataBase.cart[id].amount === 1) {
        const res = confirm("Are you sure you want to delete this product?");
        if (!res) return;
        delete dataBase.cart[id];
      } else {
        dataBase.cart[id].amount--;
      }

      window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));

      printProductsToCart(dataBase);
      printInfoTotal(dataBase);
      printAmountProducts(dataBase);
    }
  });
}

function printProductsToCart(dataBase) {
  const cartProductsHTML = document.querySelector(".cart__products");
  let html = "";
  for (const product in dataBase.cart) {
    const { amount, quantity, price, name, image, id } = dataBase.cart[product];
    const totalPrice = price * amount;
    html += `<div class="cart__product">
               <div class="cart__product__img">
                    <img src='${image}' alt='${name}' />
               </div>
               <div class='cart__product__body'>
                    <h4> ${name} | $${price}.0 </h4>
                    
                    <p>Stock: ${quantity}</p>
                    <span class'info__total__product'>Total: $${totalPrice.toFixed(
                      2
                    )} USD</span>
                    <div class='cart__product__opt' id='${id}'>
                    <i class='bx bx-minus'></i>
                    <span>${amount}</span>
                    <i class='bx bx-plus' ></i>
                    <i class='bx bxs-trash' ></i>
                    </div>
               </div>
          </div>`;
  }
  cartProductsHTML.innerHTML = html;
}

function handlePodructsFromCart(dataBase) {
  const cart__productsHTML = document.querySelector(".cart__products");

  cart__productsHTML.addEventListener("click", function (element) {
    if (element.target.classList.contains("bx-plus")) {
      const id = Number(element.target.parentElement.id);

      //hacer en funcion
      const findProduct = dataBase.products.find(function (element) {
        return element.id === id;
      });
      if (findProduct.quantity === dataBase.cart[findProduct.id].amount)
        return alert("Not enough in Stock quantity");

      //termina aqui
      dataBase.cart[id].amount++;
    }

    if (element.target.classList.contains("bx-minus")) {
      const id = Number(element.target.parentElement.id);

      // hacer funcion
      if (dataBase.cart[id].amount === 1) {
        const res = confirm("Are you sure you want to delete this product?");
        if (!res) return;
        delete dataBase.cart[id];
      } else {
        dataBase.cart[id].amount--;
      }
      //termina la funcion
    }

    if (element.target.classList.contains("bxs-trash")) {
      const id = Number(element.target.parentElement.id);
      if (dataBase.cart[id].amount) {
        const res = confirm("Are you sure you want to delete this product?");
        if (!res) return;
        delete dataBase.cart[id];
      } else {
        dataBase.cart[id].amount--;
      }
    }

    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printProductsToCart(dataBase);
    printInfoTotal(dataBase);
    printAmountProducts(dataBase);
  });
}

function printButtonBuy(dataBase) {
  let html = "";
  html = `
          <div class="cart__total__info">
               <span class='info__amount'></span>
               <span class='info__total'></span>
          </div>

          <button type="button" class="btn__buy">Buy
          </button>

             `;
  document.querySelector(".cart__total").innerHTML = html;
  printInfoTotal(dataBase);
}

function printInfoTotal(dataBase) {
  const infoTotalHTML = document.querySelector(".info__total");
  const infoAmountHTML = document.querySelector(".info__amount");

  let totalPrice = 0;
  let amountProducts = 0;

  for (const product in dataBase.cart) {
    const { amount, price } = dataBase.cart[product];
    totalPrice += price * amount;
    amountProducts += amount;
  }

  infoTotalHTML.textContent = `$${totalPrice}.00`;
  infoAmountHTML.textContent = `${amountProducts} Units`;
}

function handletoBuy(dataBase) {
  const btnBuyHTML = document.querySelector(".btn__buy");

  btnBuyHTML.addEventListener("click", function (element) {
    if (!Object.values(dataBase.cart).length)
      return alert("Please add at least one");
    const res = confirm("Are you sure you want to buy this items?");
    if (!res) return;

    const currentProducts = [];

    for (const product of dataBase.products) {
      const productCart = dataBase.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }

    dataBase.products = currentProducts;
    dataBase.cart = {};

    window.localStorage.setItem("products", JSON.stringify(dataBase.products));
    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printInfoTotal(dataBase);
    printProductsToCart(dataBase);
    printAmountProducts(dataBase);
    printProducts(dataBase);
    location.href = location.href;
  });
}

function printAmountProducts(dataBase) {
  const amountProductsHTML = document.querySelector(".cart__amount__product");
  let amount = 0;
  for (const product in dataBase.cart) {
    amount += dataBase.cart[product].amount;
  }

  amountProductsHTML.textContent = amount;
}

function trashtoCartFromProduct(dataBase) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function (element) {
    if (element.target.classList.contains("bxs-trash")) {
      const id = Number(element.target.id);

      for (const product in dataBase.cart) {
        const { amount } = dataBase.cart[product];

        if (amount) {
          const res = confirm("Are you sure you want to delete this product?");
          if (!res) return;
          delete dataBase.cart[id];
          console.log(dataBase.cart[id]);
        }
      }
    }
    //termina la funcion

    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printProductsToCart(dataBase);
    printInfoTotal(dataBase);
    printAmountProducts(dataBase);
  });
}
function getEventListenerProducts(dataBase) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function (event) {
    console.log(event.target.parentElement.dataset);
    const productId = Number(event.target.parentElement.dataset.id);
    console.log(productId);
    if (productId) {
      console.log(productId);
      const product = dataBase.products.find(
        (product) => product.id === productId
      );
      console.log(product);
      if (product) {
        showModal(product, dataBase, productId);
      }
    }
  });
}

function showModal(product, dataBase, id) {
  const modal = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal__content");

  // Actualiza el contenido del modal con la información del producto
  const buttonAdd = product.quantity
    ? `<i class='bx bx-plus modal__agregar' id='${product.id}'></i>`
    : `<span class='sold__out'>Sold Out</span>`;
  const buttonMinus = product.quantity
    ? `<i class='bx bx-minus modal__restar' id='${product.id}'></i>`
    : ``;

  const buttonTrash = product.quantity
    ? `<i class='bx bxs-trash modal__eliminar' id='${product.id}'></i>`
    : ``;
  const html = `
              <div>
                     <button class="modal__close"  id='modal__icon__close'}>boton</button>
     
                     <div class="product ${product.category}" data-id="${product.id}">
                            <div class="product__img" data-id="${product.id}">
                                   <img
                                          src="${product.image}"
                                          alt="${product.name}"
                                          data-id="${product.id}"
                            </div> 
                     </div>

                     <div class="product__info" data-id="${product.id}">
                            <h4>
                            ${product.name} |<span><b>Stock</b>: ${product.quantity}</span>
                            </h4>
                            <h5>
                            ${buttonMinus} $${product.price}.00 ${buttonAdd} ${buttonTrash}
                            <span class="amount" id="${product.id}"></span>
                            </h5>
                     </div>
                     
              </div>
       `;
  modalContent.innerHTML = html;

  modal.style.display = "block";

  handleModalButtons(dataBase, id, modal);
}

function handleModalButtons(dataBase, productId, modal) {
  const modalAgregar = document.querySelector(".modal__agregar");
  const modalRestar = document.querySelector(".modal__restar");
  const modalEliminar = document.querySelector(".modal__eliminar");
  const modalAmount = document.querySelector(".modal__amount");
  const modalCerrar = document.querySelector("#modal__icon__close");

  if (modalAgregar && modalRestar && modalEliminar && modalCerrar) {
    modalAgregar.addEventListener("click", incrementAmount());
    modalRestar.addEventListener("click", decrementAmount());
    modalEliminar.addEventListener("click", decrementAmount());
  }

  function incrementAmount() {}

  function decrementAmount() {}

  modalAgregar.addEventListener("click", function () {
    dataBase.cart[productId].amount++;
    modalAmount.textContent = dataBase.cart[productId].amount.toString();
  });

  modalRestar.addEventListener("click", function () {
    if (!dataBase.cart[productId] || dataBase.cart[productId].amount === 0) {
      return;
    }
    if (dataBase.cart[productId].amount === 1) {
      const res = confirm("Are you sure you want to delete this product?");
      if (!res) return;
      delete dataBase.cart[productId].amount;
    } else {
      dataBase.cart[productId].amount--;
    }
  });

  modalEliminar.addEventListener("click", function () {
    if (dataBase.cart[productId].amount > 0) {
      dataBase.cart[productId].amount--;
      modalAmount.textContent = dataBase.cart[productId].amount.toString();
    }
  });

  modalCerrar.addEventListener("click", function () {
    console.log("click");
    console.log(modal);

    modal.style.display = "none";
  });
}

function handleFilters() {
  mixitup(".products", {
    selectors: {
      target: ".product",
    },
    animation: {
      duration: 500,
    },
  });
}

async function main() {
  const dataBase = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getProductsApi()),

    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  };

  //saveToLocalStorage("products", dataBase.products);
  //getfromLocalStorage("products", dataBase.products);
  toggleDarkMode();
  checkDarkMode();
  handleMenuButton();
  printProducts(dataBase);

  getEventListenerProducts(dataBase);
  showHideCart();

  addToCartFromProducts(dataBase);
  minusToCartFromProducts(dataBase);
  printProductsToCart(dataBase);
  handlePodructsFromCart(dataBase);
  printButtonBuy(dataBase);
  printInfoTotal(dataBase);

  handletoBuy(dataBase);
  printAmountProducts(dataBase);
  trashtoCartFromProduct(dataBase);

  handleFilters(dataBase);
}

main();
