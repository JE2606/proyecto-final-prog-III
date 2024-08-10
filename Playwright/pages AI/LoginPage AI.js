exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginLink = '#login2';
    this.usernameInput = '#loginusername';
    this.passwordInput = '#loginpassword';
    this.loginButton = 'button*=Log in'; // Using CSS selector for consistency
  }

  async gotoLoginPage() {
    try {
      await this.page.goto('https://www.demoblaze.com/index.html', {
        waitUntil: 'domcontentloaded',
      });
    } catch (error) {
      console.error('Error navigating to login page:', error);
    }
  }

  async login(username, password) {
    try {
      await this.page.click(this.loginLink);
      await this.page.fill(this.usernameInput, username);
      await this.page.fill(this.passwordInput, password);
      await this.page.click(this.loginButton);
      await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
};

// exports.LoginPage = class LoginPage {
//   constructor(page) {
//     this.page = page;
//     this.loginLink = '#login2';
//     this.usernameInput = '#loginusername';
//     this.passwordInput = '#loginpassword';
//     this.loginButton = '//button[normalize-space()="Log in"]';
//   }
//   async gotoLoginPage() {
//     try {
//       await this.page.goto('https://www.demoblaze.com/index.html', {
//         waitUntil: 'domcontentloaded',
//       });
//     } catch (error) {
//       console.error('Error navigating to login page:', error);
//     }
//   }
//   async login(username, password) {
//     await this.page.locator(this.loginLink).click();
//     await this.page.locator(this.usernameInput).fill(username);
//     await this.page.locator(this.passwordInput).fill(password);
//     await this.page.locator(this.loginButton).click();
//   }
// };
