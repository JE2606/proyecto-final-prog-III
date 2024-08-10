exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.noOfProducts = '//tbody[@id="tbodyid"]/tr/td[2]';
  }

  async checkProductInCart(productName) {
    try {
      const productsInCart = await this.page.$$(this.noOfProducts);
      const productFound = await productsInCart.find(async (product) => {
        const text = await product.textContent();
        console.log(text);
        return productName === text;
      });
      return !!productFound;
    } catch (error) {
      console.error('Error checking product in cart:', error);
      return false;
    }
  }
};

// exports.CartPage = class CartPage {
//   constructor(page) {
//     this.page = page;
//     this.noOfProducts = '//tbody[@id="tbodyid"]/tr/td[2]';
//   }

//   async checkProductInCart(productName) {
//     const productsInCart = await this.page.$$(this.noOfProducts);
//     for (const product of productsInCart) {
//       console.log(await product.textContent());
//       if (productName === (await product.textContent())) {
//         return true;
//         break;
//       }
//     }
//   }
// };
