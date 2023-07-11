const BASE_URL = "https://ecommercebackend.fundamentos-29.repl.co/";

async function getProductsApi() {
  try {
    const data = await fetch(BASE_URL);
    const res = await data.json();
    window.localStorage.setItem("products", JSON.stringify(res));
    return res;
  } catch (error) {
    console.log("Error while fetching products:", error);
  }
}

function printProducts(dataBase) {
  const productsContainer = document.querySelector(".products");
  let html = "";

  dataBase.products.forEach(function (product) {
    const { image, name, quantity, price, id, category } = product;
    const buttonAdd = quantity
      ? `<i class='bx bx-plus' id='${id}'></i>`
      : `<span class='sold__out'>Sold Out</span>`;
    const buttonMinus = `<i class='bx bx-minus' id='${id}'></i>`;
    const buttonTrash = `<i class='bx bxs-trash' id='${id}'></i>`;

    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.classList.add(category);

    const productImg = document.createElement("div");
    productImg.classList.add("product__img");
    const img = document.createElement("img");
    img.src = image;
    img.alt = name;
    productImg.appendChild(img);
    productElement.appendChild(productImg);

    const productInfo = document.createElement("div");
    productInfo.classList.add("product__info");
    const productName = document.createElement("h4");
    productName.innerHTML = `${name} |<span><b>Stock</b>: ${quantity}</span>`;
    const productPrice = document.createElement("h5");
    productPrice.innerHTML = `${buttonMinus}$${price}.0${buttonAdd}${buttonTrash}<span class='amount' id='${id}'></span>`;
    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);
    productElement.appendChild(productInfo);

    html += productElement.outerHTML;
  });

  productsContainer.innerHTML = html;
}

function toggleDarkMode() {
  const darkModeIcon = document.querySelector(".bxs-moon");
  const container = document.querySelector(".main__container");

  darkModeIcon.addEventListener("click", function () {
    container.classList.toggle("dark__mode");

    // Guardar el estado del modo oscuro en el almacenamiento local
    const isDarkModeEnabled = container.classList.contains("dark__mode");
    window.localStorage.setItem("darkMode", isDarkModeEnabled);
  });
}

function checkDarkMode() {
  const container = document.querySelector(".main__container");
  const isDarkModeEnabled = JSON.parse(window.localStorage.getItem("darkMode"));

  if (isDarkModeEnabled) {
    container.classList.add("dark__mode");
  }
}

function showHideCart() {
  const carIconHTML = document.querySelector(".bx-cart-alt");
  const cartHTML = document.querySelector(".cart");

  const toggleCart = () => {
    cartHTML.classList.toggle("cart__show");
  };

  carIconHTML.addEventListener("click", toggleCart);
}

/* function darkMode() {
  const moonIconHTML = document.querySelector(".bxs-moon");
  const dark__showHTML = document.querySelector(".main__container");

  moonIconHTML.addEventListener("click", function (e) {
    console.log();

    dark__showHTML.classlist.toggle("dark__mode");
  });
} */

function addToCartFromProducts(dataBase) {
  const productsHTML = document.querySelector(".products");

  const handleAddToCart = (event) => {
    if (event.target.classList.contains("bx-plus")) {
      const id = Number(event.target.id);

      const findProduct = dataBase.products.find(
        (product) => product.id === id
      );

      if (dataBase.cart[findProduct.id]) {
        if (findProduct.quantity === dataBase.cart[findProduct.id].amount) {
          return alert("Not enough quantity in stock");
        }
        dataBase.cart[findProduct.id].amount++;
      } else {
        dataBase.cart[findProduct.id] = { ...findProduct, amount: 1 };
      }

      window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));

      printProductsToCart(dataBase);
      printInfoTotal(dataBase);
      printAmountProducts(dataBase);
    }
  };

  productsHTML.addEventListener("click", handleAddToCart);
}

function minusToCartFromProducts(dataBase) {
  const productsHTML = document.querySelector(".products");

  const handleMinusFromCart = (event) => {
    if (event.target.classList.contains("bx-minus")) {
      const id = Number(event.target.id);

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
  };

  productsHTML.addEventListener("click", handleMinusFromCart);
}

function printProductsToCart(dataBase) {
  const cartProductsHTML = document.querySelector(".cart__products");
  let html = "";

  for (const product in dataBase.cart) {
    const { amount, quantity, price, name, image, id } = dataBase.cart[product];

    html += `
           <div class="cart__product">
             <div class="cart__product__img">
               <img src='${image}' alt='${name}' />
             </div>
             <div class='cart__product__body'>
               <h4> ${name} | $${price}.0 </h4>
               <p>Stock: ${quantity}</p>
               <div class='cart__product__opt' id='${id}'>
                 <i class='bx bx-minus'></i>
                 <span>${amount}</span>
                 <i class='bx bx-plus'></i>
                 <i class='bx bxs-trash'></i>
               </div>
             </div>
           </div>
         `;
  }

  cartProductsHTML.innerHTML = html;
}

function handlePodructsFromCart(dataBase) {
  const cartProductsHTML = document.querySelector(".cart__products");

  const handleCartProductClick = (event) => {
    const targetClassList = event.target.classList;

    if (targetClassList.contains("bx-plus")) {
      const id = Number(event.target.parentElement.id);
      const findProduct = dataBase.products.find(
        (product) => product.id === id
      );

      if (findProduct.quantity === dataBase.cart[findProduct.id].amount) {
        return alert("Not enough quantity in stock");
      }

      dataBase.cart[id].amount++;
    }

    if (targetClassList.contains("bx-minus")) {
      const id = Number(event.target.parentElement.id);

      if (dataBase.cart[id].amount === 1) {
        const res = confirm("Are you sure you want to delete this product?");
        if (!res) return;
        delete dataBase.cart[id];
      } else {
        dataBase.cart[id].amount--;
      }
    }

    if (targetClassList.contains("bxs-trash")) {
      const id = Number(event.target.parentElement.id);
      const res = confirm("Are you sure you want to delete this product?");
      if (!res) return;
      delete dataBase.cart[id];
    }

    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printProductsToCart(dataBase);
    printInfoTotal(dataBase);
    printAmountProducts(dataBase);
  };

  cartProductsHTML.addEventListener("click", handleCartProductClick);
}

function printButtonBuy(dataBase) {
  const html = `
         <div class="cart__total__info">
           <span class='info__amount'></span>
           <span class='info__total'></span>
         </div>
         <button type="button" class="btn__buy">Buy</button>
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

  infoTotalHTML.textContent = `$${totalPrice.toFixed(2)}`;
  infoAmountHTML.textContent = `${amountProducts} Units`;
}

function handletoBuy(dataBase) {
  const btnBuyHTML = document.querySelector(".btn__buy");

  btnBuyHTML.addEventListener("click", function (element) {
    if (Object.values(dataBase.cart).length === 0)
      return alert("Please add at least one item to the cart.");

    const res = confirm("Are you sure you want to buy these items?");
    if (!res) return;

    const currentProducts = dataBase.products.map((product) => {
      const productCart = dataBase.cart[product.id];
      if (productCart) {
        return {
          ...product,
          quantity: product.quantity - productCart.amount,
        };
      } else {
        return product;
      }
    });

    dataBase.products = currentProducts;
    dataBase.cart = {};

    window.localStorage.setItem("products", JSON.stringify(dataBase.products));
    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printInfoTotal(dataBase);
    printProductsToCart(dataBase);
    printAmountProducts(dataBase);
    printProducts(dataBase);
    location.reload();
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
      const res = confirm("Are you sure you want to delete this product?");
      if (!res) return;
      delete dataBase.cart[id];
    }

    window.localStorage.setItem("cart", JSON.stringify(dataBase.cart));
    printProductsToCart(dataBase);
    printInfoTotal(dataBase);
    printAmountProducts(dataBase);
  });
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
  toggleDarkMode();
  checkDarkMode();
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
