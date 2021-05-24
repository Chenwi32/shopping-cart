function cartApp() {
  const openCart = document.querySelector('.cart__icon');
  const closeCart = document.querySelector('.close__cart');
  const productDOM = document.querySelector('.product__center');
  const cartDOM = document.querySelector('.cart__centent');
  const item_Total = document.querySelector('.item__total');
  const cart_Total = document.querySelector('.cart__total');

  let cart = [];
  let buttonDOM = [];

  // UI
  class UI {

    // This will display the products we recieve in the UI(the User Interface)
    displayProducts(obj) {
      let product = '';
      obj.forEach(({ id, title, price, image }) => {
        product += `<!-- Single Product -->
             <div class="product">
              <div class="image__container">
                <img src=${image} alt="" />
              </div>
              <div class="product__footer">
                <h1>${title}</h1>
                <div class="rating">
                  <span>
                    <svg>
                      <use xlink:href="./images/sprite.svg#icon-star-full"></use>
                    </svg>
                  </span>
                  <span>
                    <svg>
                      <use xlink:href="./images/sprite.svg#icon-star-full"></use>
                    </svg>
                  </span>
                  <span>
                    <svg>
                      <use xlink:href="./images/sprite.svg#icon-star-full"></use>
                    </svg>
                  </span>
                  <span>
                    <svg>
                      <use xlink:href="./images/sprite.svg#icon-star-full"></use>
                    </svg>
                  </span>
                  <span>
                    <svg>
                      <use xlink:href="./images/sprite.svg#icon-star-empty"></use>
                    </svg>
                  </span>
                </div>
                <div class="bottom">
                  <div class="btn__group">
                    <a href="#" class="btn addToCart" data-id=${id}>Add to Cart</a>
                    <a href="#" class="btn view">View</a>
                  </div>
                  <div class="price">$${price}</div>
                </div>
              </div>
            </div> 
            <!-- End of Single Product-->`;

      });
      productDOM.innerHTML = product;
    }

    getButtons() {

      // This will get the Add to cart buttons but as a node list  
      /*  const addBtns = document.querySelectorAll('.addToCart') */

      // So we have to spread it using the array spread method like this;
      const addBtns = [...document.querySelectorAll('.addToCart')];

      // This will now assign the addBtns to the empty buttonDOM array we created above 
      buttonDOM = addBtns;

      buttonDOM.forEach(btn => {
        const id = btn.dataset.id;
        // Notice that to access the data-id of the buttons, we call it as dataset.id, not data-id again

        // This will check if the item's id is in cart
        const inCart = cart.find(item => item.id === id);

        // If it is there, then this below will be executed
        if(inCart){
          btn.innerHTML = 'In Cart';
          btn.disable = true;
        }

        btn.addEventListener('click', element => {

          // This will prevent the browser from making the page to jump to top when an empty link is clicked
          element.preventDefault();

          element.target.innerText = 'In Cart';
          element.target.disable = true;

          // This gets a product from the products gotten from the json file
          const cartItem = {
            /* we spread the value of the Storage.getProduct() into the cartItem and add a new property*/
             ...Storage.getProducts(id), amount: 1 
            };
          console.log(cartItem);

          // This adds the product to the cart(which is the empty cart array created above)
          cart = [ /* This is esentially saying, if there is anything is the cart, spread it here*/
                    ...cart,
                   /* Then add the cart items inside too*/
                   cartItem
                  ]

          // This stores the product to the local storage
          Storage.saveCart(cart)

          // This calls the setItemValues() method 
          this.setItemValue(cart)

          // This displays the items in the cart
           this.addToCart(cartItem)

        });
      });
    }

    // This sets the Item value 
    setItemValue(cart){
      let tempTotal = 0;
      let itemTotal = 0;

      // This calculates the amount of products and hence the the total
      cart.map(item => {
        tempTotal += item.price * item.amount;
        itemTotal += item.amount;
      });

      item_Total.innerText = itemTotal;
      cart_Total.innerText = parseInt(tempTotal.toFixed(2))
    };

    // This add the items to the cart section
    addToCart({title, price, image, id}){
      let div = document.createElement('div');
      div.classList.add('cart__item')
      div.innerHTML = `<img src=${image} alt="">
      <div>
        <h3>${title}</h3>
        <h3 class="price">$${price}</h3>
      </div>
      <div>
        <span data-id=${id}>
          <svg>
            <use xlink:href="./images/sprite.svg#icon-angle-up"></use>
          </svg>
        </span>
        <p>3</p>
        <span data-id=${id}>
          <svg>
            <use xlink:href="./images/sprite.svg#icon-angle-down"></use>
          </svg>
        </span>
      </div>

      <div>
        <span class="remove__item">
          <svg>
            <use xlink:href="./images/sprite.svg#icon-trash"></use>
          </svg>
        </span>
      </div>`;

      cartDOM.appendChild(div);
    }


  };
  const cartPop = document.querySelector('.cart');

  openCart.addEventListener('click', ()=> {
    cartPop.classList.add('show')
  })

  closeCart.addEventListener('click', ()=>{
    cartPop.classList.remove('show')
  })

  // Storage
  class Storage {
    // This will store the product in our local storage when we load the page so that thing we add to the
    // shooping card do be emptied when the page reloads
    // This will take the object as a parameter so that the arguement that will be paresed to it where it
    // will be called would be the object recieved
    static saveProducts(obj) {

      // Here, the first parameter is the product recieved
      localStorage.setItem("products", JSON.stringify(obj));
    }

    static saveCart(cart){
      localStorage.setItem("carts", JSON.stringify(cart));
    }

    static getProducts(id){
      // This gets the Products to the local storage
      const products = JSON.parse(localStorage.getItem("products"));

      // After getting the Product into the local Storage, we return the id to be used in the cart icon
      return  products.find(item => item.id === parseInt(id));
    };
  }

  // Products
  class Products {
    // This will get the products from the JSON by fetching them 
    // Because we will be fetching data from an external source, it might be delaying or might encounter
    // errors so we will be using asyncronous and try catch.

    async getProducts() {
      try {

        // This will go and fetch the data, assign the data to the recievedData variable
        const results =  await  fetch('products.json');
        const recievedData =  await  results.json();

        // This will extract the items object which is in the fetched data
        const products = recievedData.items;

        // This will return the products to be used outside this function
        return products;

      } catch (error) {
        console.log(error);
      }
    };

  };


  // This will update the DOM after loading
  document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UI();
    const products = new Products();

    // This will collect the products we recieve from the getProduct() of the Products class at
    // runtime
    const productobj = await products.getProducts();

    // This will display the products in the UI at runtime using the display function of the UI class
    // by recieving the products through the productobj as its parameter

    ui.displayProducts(productobj);

    Storage.saveProducts(productobj);

    ui.getButtons();
  })

}




cartApp();