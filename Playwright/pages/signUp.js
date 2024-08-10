exports.SignAndLogin = class SignAndLogin {
  constructor(page) {
    this.page = page;
    this.signUp = '#signin2';
    this.username = '#sign-username';
    this.password = '#sign-password';
    this.sign_up = '//button[normalize-space()="Sign up"]';
  }

  async SignUp(username, password) {
    await this.page.locator(this.signUp).click();
    await this.page.locator(this.username).fill(username);
    await this.page.locator(this.password).fill(password);
    await this.page.locator(this.sign_up).click();
  }
};
