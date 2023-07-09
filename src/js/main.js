const BASE_URL = "https://ecommercebackend.fundamentos-29.repl.co/";

async function getProductsApi() {
  try {
    const data = await fetch(BASE_URL);
    const res = await data.json();

    window.localStorage.setItem("products", JSON.stringify(res));

    return res;
  } catch (error) {}
}

function printProducts(dataBase) {
  let html = "";

  dataBase.products.forEach(function (product) {
    const { image, name, quantity, price, id, category } = product;
    const buttonAdd = quantity
      ? `<i class='bx bx-plus' id='${id}'></i>`
      : `<span class='sold__out'>Sold Out</span>`;
    const buttonMinus = `<i class='bx bx-minus' id='${id}'></i>`;

    const buttonTrash = `<i class='bx bxs-trash' id='${id}'></i>`;

    html += `
                      <div class="product ${category}" >
                             <div class="product__img">
                                    <img src="${image}" alt="${name}" />
                             </div>
 
                             <div class="product__info">
                             <h4>${name} |<span><b>Stock</b>: ${quantity}</span></h4>
                             <h5>${buttonMinus}
                                    $${price}.0
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

      // hacer funcion
      if (dataBase.cart[id].amount === 1) {
        const res = confirm("Are you sure you want to delete this product?");
        if (!res) return;
        delete dataBase.cart[id];
      } else {
        dataBase.cart[id].amount--;
      }
      //termina la funcion

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
    html += `<div class="cart__product">
               <div class="cart__product__img">
                    <img src='${image}' alt='${name}' />
               </div>
               <div class='cart__product__body'>
                    <h4> ${name} | $${price}.0 </h4>
                    
                    <p>Stock: ${quantity}</p>
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

//revisar
function printAmountOnProducts(dataBase) {
  const amountProductsHTML = document.querySelector(".product__info");
  const productsHTML = document.querySelector(".products");
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

  // hacer funcion

  //termina la funcion

  /*  window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
              printProducts(dataBase);
              printProductsToCart(dataBase);
              printAmountProducts(dataBase);
              printInfoTotal(dataBase);
              printAmountProducts(dataBase);
              addToCartFromProducts(dataBase);
            }); */
}

function handleFilters(dataBase) {
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

  printProducts(dataBase);

  showHideCart();
  addToCartFromProducts(dataBase);
  minusToCartFromProducts(dataBase);

  //printtitleShopCart(dataBase);
  // console.log(printtitleShopCart(dataBase));
  printProductsToCart(dataBase);
  handlePodructsFromCart(dataBase);
  printButtonBuy(dataBase);
  printInfoTotal(dataBase);
  handletoBuy(dataBase);
  printAmountProducts(dataBase);
  //revisar
  //printAmountOnProducts(dataBase);
  handleFilters(dataBase);
  trashtoCartFromProduct(dataBase);
}

main();
