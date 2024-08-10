exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.noOfProducts = '//tbody[@id="tbodyid"]/tr/td[2]';
    this.getTotal = '//a[@id="totalp"]';
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
  async getTotalPrice() {
    try {
      const total = await this.page.$(this.getTotal);
      const text = await total.textContent();
      console.log('Total price:', text);
      return text;
    } catch (error) {
      console.error('Error getting total price:', error);
      return null;
    }
  }

  async removeProductFromCart(productName) {
    try {
      const productRows = await this.page.$$('//tbody[@id="tbodyid"]/tr');
      for (const row of productRows) {
        const productText = await row.$eval(
          'td:nth-child(2)',
          (el) => el.textContent
        );
        if (productText.trim() === productName) {
          const deleteLink = await row.$('a[onclick^="deleteItem"]');
          await deleteLink.click();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error removing product from cart:', error);
      return false;
    }
  }
  async getProductsInCart() {
    try {
      const products = [];
      const productRows = await this.page.$$(this.productRows);
      for (const row of productRows) {
        const productName = await row.$eval(this.productNameSelector, (el) =>
          el.textContent.trim()
        );
        const productPrice = await row.$eval(this.productPriceSelector, (el) =>
          el.textContent.trim()
        );
        products.push({ name: productName, price: productPrice });
      }
      return products;
    } catch (error) {
      console.error('Error getting products from cart:', error);
      return [];
    }
  }
};
