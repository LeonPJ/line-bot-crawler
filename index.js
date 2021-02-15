require('dotenv').config();
const fb_username = process.env.FB_USERNAME;
const fb_password = process.env.FB_PASSWORD;

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

function checkDriver() {
    try {
        chrome.getDefaultService();
    } catch (error) {
        console.warn("Can't find default driver");
        const file_path = '../chromedriver.exe';
        console.log(path.join(__dirname, file_path));
        if (fs.existsSync(path.join(__dirname, file_path))) {
            const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build();
            chrome.setDefaultService(service);
            console.log("Set driver path");
        } else {
            console.error("False to set driver path");
            return false
        }
    }
    return true
}

async function loginFaceBook() {
    const options = new chrome.Options();
    options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//close FaceBook notifications
    let driver = await new webdriver.Builder().forBrowser('chrome').withCapabilities(options).build();
    const webFaceBook = 'https://www.facebook.com/login';
    await driver.get(webFaceBook);
    const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="email"]`)));//username
    fb_email_ele.sendKeys(fb_username);
    const fb_password_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="pass"]`)));//password
    fb_password_ele.sendKeys(fb_password);
    const fb_login_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginbutton"]`)));//login
    fb_login_ele.click();

    await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"fzdkajry")]`)));

    const fanPage = 'https://www.facebook.com/erikathebug';
    await driver.get(fanPage);
    await driver.sleep(3000);
    let fb_trace = 0;
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"d2edcug0 hpfvmrgz qv66sw1b c1et5uql rrkovp55 jq4qci2q a3bd9o3v knj5qynh oo9gr5id")]`)));
    for (const fb_trace_ele of fb_trace_eles) {
        const fb_text = await fb_trace_ele.getText();
        if (fb_text.includes('人')) {
            fb_trace = fb_text.replace('人', '');
            break;
        }
    }
    console.log(`Erika 按讚人數: ${fb_trace} 人`);//按讚人數
    driver.quit();
}

async function loginInstagram() {
    const options = new chrome.Options();
    options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//close FaceBook notifications
    let driver = await new webdriver.Builder().forBrowser('chrome').withCapabilities(options).build();
    const webInstagram = 'https://www.instagram.com/accounts/login/';
    await driver.get(webInstagram);
    const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[1]/div/label/input`)));//username
    fb_email_ele.sendKeys(fb_username);
    const fb_password_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[2]/div/label/input`)));//password
    fb_password_ele.sendKeys(fb_password);
    const fb_login_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[3]`)));//login
    fb_login_ele.click();
}

async function openCrawlerWeb() {
    if (!checkDriver())
        return
    loginFaceBook();
}

openCrawlerWeb();
