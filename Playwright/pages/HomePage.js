exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.productList = '//*[@id="tbodyid"]/div/div/div/h4/a';
    this.addToCartbtn = '//a[normalize-space()="Add to cart"]';
    this.cart = '#cartur';
  }

  async addProductToCart(productName) {
    try {
      const productList = await this.page.$$(this.productList);
      const product = await this.findProductByName(productList, productName);
      if (product) {
        await product.click();
        await this.handleCartDialog();
      } else {
        console.error(`Product "${productName}" not found.`);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  async findProductByName(productList, productName) {
    for (const product of productList) {
      const name = await product.textContent();
      if (productName === name) {
        return product;
      }
    }
    return null;
  }

  async handleCartDialog() {
    await this.page.on('dialog', async (dialog) => {
      if (dialog.message().includes('added')) {
        await dialog.accept();
      }
    });
    await this.page.locator(this.addToCartbtn).click();
  }

  async gotoCart() {
    try {
      await this.page.locator(this.cart).click();
    } catch (error) {
      console.error('Error navigating to cart:', error);
    }
  }
};
