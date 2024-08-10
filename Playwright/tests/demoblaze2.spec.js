import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { SignAndLogin } from '../pages/signUp';
import { Purchase } from '../pages/Purchase';
import { faker } from '@faker-js/faker';

test.describe('E-commerce Site Scenarios', () => {
  test('Successful Registration and Login', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    const validateUser = await login.checkLogIn(username);
    expect(validateUser).toBe(true);
    await page.screenshot({
      path: 'Successful Registration and Login-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Login with Incorrect Password', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';
    const incorrectPassword = 'WrongPass@123';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, incorrectPassword);

    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('Wrong password.');
      await dialog.dismiss();
    });
    await page.screenshot({
      path: 'Login with Incorrect Password-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Login with Non-Existent User', async ({ page }) => {
    const login = new LoginPage(page);
    const nonExistentUsername = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await login.loginPage(nonExistentUsername, password);
    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('User does not exist.');
      await dialog.dismiss();
    });

    await page.screenshot({
      path: 'Login with Non-Existent User-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Add Product to Cart', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    await cart.checkProductInCart('Nexus 6');

    await page.screenshot({ path: 'Add Product to Cart-screenshot.png' });
  });

  test('Remove Product from Cart', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    await cart.removeProductFromCart('Nexus 6');

    await page.screenshot({ path: 'Remove Product from Cart-screenshot.png' });

    await setTimeout(() => {}, 2000);
  });

  test('Place Order with Valid Details', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const purchase = new Purchase(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    const orderDetails = {
      name: 'Juan Elias',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: '1234567890123456',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    const confirmedPurchase = await page.locator(
      '//h2[text()="Thank you for your purchase!"]'
    );
    expect(confirmedPurchase).toBeTruthy();

    await page.screenshot({
      path: 'Place Order with Valid Details-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Place Order with Invalid Credit Card', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const purchase = new Purchase(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    const orderDetails = {
      name: 'Juan Elias',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: 'invalid-card',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('Please fill out Name and Creditcard.');
      await dialog.dismiss();
      page.screenshot({
        path: 'Place Order with Invalid Credit Card-screenshot.png',
      });
    });

    await setTimeout(() => {}, 2000);
  });

  test('Place Order with Missing Details', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const purchase = new Purchase(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    const orderDetails = {
      name: '',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: '',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('Please fill out Name and Creditcard.');
      await dialog.dismiss();
    });

    await page.screenshot({
      path: 'Place Order with Missing Details-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Verify Product Details in Cart', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    await cart.getProductsInCart();
    await page.screenshot({
      path: 'Verify Product Details in Cart-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Verify Cart Total Price', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    await page.waitForTimeout(3000);

    const totalPrice = await cart.getTotalPrice();
    expect(totalPrice).toBe('650'); // Example price

    await page.screenshot({ path: 'Logout User-screenshot.png' });

    await setTimeout(() => {}, 2000);
  });

  test('Logout User', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await login.logOutPage();

    await page.screenshot({ path: 'Logout User-screenshot.png' });
  });

  test('Login with Special Characters in Username', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName() + '!@#';
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    const validateUser = await login.checkLogIn(username);
    expect(validateUser).toBe(true);

    await page.screenshot({
      path: 'Login with Special Characters in Username-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Login with Long Username', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName() + 'verylongusername'.repeat(5);
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    const validateUser = await login.checkLogIn(username);
    expect(validateUser).toBe(true);

    await page.screenshot({ path: 'Login with Long Username-screenshot.png' });

    await setTimeout(() => {}, 2000);
  });

  test('Add Multiple Products to Cart', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.addProductToCart('Samsung Galaxy S6');
    await home.gotoCart();

    await cart.checkProductInCart('Nexus 6');
    await cart.checkProductInCart('Samsung Galaxy S6');

    await page.screenshot({
      path: 'Add Multiple Products to Cart-screenshot.png',
    });

    await setTimeout(() => {}, 2000);
  });

  test('Verify Order Details', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const purchase = new Purchase(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    const orderDetails = {
      name: 'Juan Elias',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: '1234567890123456',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    const confirmedPurchase = await page.locator(
      '//h2[text()="Thank you for your purchase!"]'
    );
    expect(confirmedPurchase).toBeTruthy();
    await purchase.confirmed();

    await page.screenshot({ path: 'Verify Order Details-screenshot.png' });
    await setTimeout(() => {}, 2000);
    await page.close();
  });
  test('Login to the page, select a product and purchase the order', async ({
    browser,
  }) => {
    const page = await browser.newPage();
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    // Registrarse
    await login.goToPage(page);
    await sign.SignUp(username, password);

    // Loggear
    await login.loginPage(username, password);
    const validateUser = await login.checkLogIn(username);
    expect(validateUser).toBe(true);

    // Home Page
    const home = new HomePage(page);
    await home.addProductToCart('Nexus 6');
    await home.gotoCart(page);

    // Carrito
    const cart = new CartPage(page);
    await cart.checkProductInCart('Nexus 6');

    // Ordenar
    const purchase = new Purchase(page);
    const orderDetails = {
      name: 'Juan Elias',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: '1234567890123456',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    const confirmedPurchase = await page.locator(
      '//h2[text()="Thank you for your purchase!"]'
    );
    expect(confirmedPurchase).toBeTruthy();
    await purchase.confirmed();
    await page.screenshot({
      path: 'Login to the page, select a product and purchase the order-screenshot.png',
    });
    await setTimeout(() => {}, 2000);
    await page.close();
  });

  test('Verify Order Confirmation Message', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const purchase = new Purchase(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await home.addProductToCart('Nexus 6');
    await home.gotoCart();

    const orderDetails = {
      name: 'Juan Elias',
      country: 'Rep Dom',
      city: 'Pantoja',
      creditCard: '1234567890123456',
      month: '02',
      year: '2024',
    };

    await purchase.placeOrder(orderDetails);
    const confirmationMessage = await page
      .locator('//h2[text()="Thank you for your purchase!"]')
      .textContent();
    expect(confirmationMessage).toBe('Thank you for your purchase!');
    await page.screenshot({
      path: 'Verify Order Confirmation Message-screenshot.png',
    });
  });

  test('Verify User Cannot Register with Existing Username', async ({
    page,
  }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await sign.SignUp(username, password);

    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('This user already exist.');
      await dialog.dismiss(); // Dismiss the dialog
    });

    await page.screenshot({
      path: 'Verify User Cannot Register with Existing Username-screenshot.png',
    });
    await setTimeout(() => {}, 2000);
  });
  test('Go to contact', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await page.click('//a[normalize-space()="Contact"]');
  });
  test('Go to contact and send a message', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await page.click('//a[normalize-space()="Contact"]');
    await page.fill('#recipient-email', 'juanelias@gmail.com');
    await page.fill('#recipient-name', 'Juan Elias');
    await page.fill('#message-text', 'Hello, this is a test message.');
    await page.click('//button[normalize-space()="Send message"]');
    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('Thanks for the message!!');
      await dialog.dismiss();
    });

    await page.screenshot({
      path: 'Go to contact and send a message-screenshot.png',
    });
    await setTimeout(() => {}, 2000);
  });

  test('Go to contact and send an empty message', async ({ page }) => {
    const sign = new SignAndLogin(page);
    const login = new LoginPage(page);
    const username = faker.internet.userName();
    const password = 'Test123@';

    await login.goToPage();
    await sign.SignUp(username, password);
    await login.loginPage(username, password);

    await page.click('//a[normalize-space()="Contact"]');
    await page.fill('#recipient-email', '');
    await page.fill('#recipient-name', '');
    await page.fill('#message-text', '');
    await page.click('//button[normalize-space()="Send message"]');
    page.on('dialog', async (dialog) => {
      const alertMessage = dialog.message();
      expect(alertMessage).toContain('Thanks for the message!!');
      await dialog.dismiss();

      await page.screenshot({
        path: 'Go to contact and send an empty message-screenshot.png',
      });

      await setTimeout(() => {}, 2000);
    });
  });
});
