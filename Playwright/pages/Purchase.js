exports.Purchase = class Purchase {
  constructor(page) {
    this.page = page;
    this.cartBtn = 'Cart';
    this.placeOrderBtn = '//button[normalize-space()="Place Order"]';
    this.name = '#name';
    this.country = '#country';
    this.city = '#city';
    this.creditCard = '#card';
    this.month = '#month';
    this.year = '#year';
    this.purchase = '//button[normalize-space()="Purchase"]';
    this.validation = '//h2[text()="Thank you for your purchase!"]';
    this.confirm = '//button[normalize-space()="OK"]';
    this.close = '//button[normalize-space()="Close"]';
  }

  async gotoCart() {
    await this.page.getByText(this.cartBtn).click();
  }
  async placeOrder(orderDetails) {
    await this.page.click(this.placeOrderBtn);

    for (const [field, value] of Object.entries(orderDetails)) {
      await this.page.fill(this[field], value);
    }

    await this.page.click(this.purchase);
  }
  async confirmed() {
    await this.page.locator(this.confirm).click();
  }
  async getOrderValidation() {
    await this.page.waitForSelector(this.validation);
    const orderValidation = await this.page.isVisible(this.validation);
    return orderValidation;
  }
};
