exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.login = '#login2';
    this.logOut = '#logout2';
    this.username = '#loginusername';
    this.password = '#loginpassword';
    this.log_in = '//button[normalize-space()="Log in"]';
    this.check = '#nameofuser';
  }
  async goToPage() {
    try {
      await this.page.goto('https://www.demoblaze.com/index.html', {
        waitUntil: 'domcontentloaded',
      });
    } catch (error) {
      console.error('Error navigating to login page:', error);
    }
  }

  async loginPage(username, password) {
    await this.page.locator(this.login).click();
    await this.page.locator(this.username).fill(username);
    await this.page.locator(this.password).fill(password);
    await this.page.locator(this.log_in).click();
  }

  async checkLogIn() {
    await this.page.waitForSelector(this.check);
    const isLoggedIn = await this.page.isVisible(this.check);
    return isLoggedIn;
  }

  async logOutPage() {
    await this.page.locator(this.logOut).click();
  }
};
