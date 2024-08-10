import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignAndLogin } from '../pages/signUp';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { Purchase } from '../pages/Purchase';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// Ensure directories exist
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

test('Login to the page, select a product and purchase the order', async ({
  browser,
}) => {
  // Create directories if they don't exist
  ensureDirectoryExistence('videos/');
  ensureDirectoryExistence('screenshots/');

  // Create a new browser context with video recording enabled
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/', // Directory to save videos
    },
  });

  const page = await context.newPage();
  const sign = new SignAndLogin(page);
  const login = new LoginPage(page);
  const username = faker.internet.userName();
  const password = 'Test123@';

  try {
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

    // Capture screenshot at the end of the test
    await page.screenshot({ path: `screenshots/test-${Date.now()}.png` });
  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    // Close the page and context to save the video
    await page.close();
    await context.close();
  }
});
