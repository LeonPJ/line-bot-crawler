require('dotenv').config();
const fb_username = process.env.FB_USERNAME;
const fb_password = process.env.FB_PASSWORD;
const ig_username = process.env.IG_USERNAME;
const ig_password = process.env.IG_PASSWORD;

const webdriver = require('selenium-webdriver'), // 加入虛擬網頁套件
    By = webdriver.By,//你想要透過什麼方式來抓取元件，通常使用xpath、css
    until = webdriver.until;//直到抓到元件才進入下一步(可設定等待時間)
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
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

const chrome = require('selenium-webdriver/chrome');
const { Builder, By, Key, until } = require('selenium-webdriver');
const screen = {
    width: 640,
    height: 480
};
let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();

async function loginInstagram() {
    const options = new chrome.Options();
    options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//close FaceBook notifications
    let driver = await new webdriver.Builder().forBrowser('chrome').withCapabilities(options,
        { acceptSslCerts: true, acceptInsecureCerts: true }).build();//這是為了解決跨網域問題
    await driver.manage().window().setRect({ width: 1200, height: 800, x: 0, y: 0 });//設定螢幕大小
    const webInstagram = 'https://www.instagram.com/';
    await driver.get(webInstagram);
    const ig_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[1]/div/label/input`)));//username
    ig_email_ele.sendKeys(ig_username);
    const ig_password_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[2]/div/label/input`)));//password
    ig_password_ele.sendKeys(ig_password);
    const ig_login_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginForm"]/div/div[3]`)));//login
    ig_login_ele.click();

    await driver.wait(until.elementLocated(By.xpath(`//*[@id="react-root"]/section/nav/div[2]/div/div/div[3]/div`)));// 確認是否登入成功

    const followerPage = 'https://www.instagram.com/cindiatsai/';
    await driver.get(followerPage);
    await driver.sleep(3000);
    //const pageSource = await driver.wait(until.elementLocated(By.class('_9AhH0')));
    //console.log(pageSource);
    /*const pageSource = await driver.wait(until.elementLocated(By.css('body')), 5000).getAttribute('innerHTML');
    console.log('pageSource: ', pageSource);*/
    const pageSource = await driver.wait(until.elementLocated(By.css('img')), 5000).getAttribute('innerHTML');
    console.log(pageSource);

    fs.writeFile('SourceCode.txt', pageSource, function (err) {
        if (err)
            console.log(err);
        else
            console.log('Write operation complete.');
    });

    /*url = 'https://www.instagram.com/p/CE_bR-osw4M/'
    browser.get(url)
    soup = Soup(browser.page_source,"lxml")
    soup.find_all(class_="KL4Bh")[0].img.get('src')
    # 獲取影片連結
    url = 'https://www.instagram.com/p/CFHwyL6s9Gn/'
    browser.get(url)
    soup = Soup(browser.page_source,"lxml")
    soup.find_all(class_="_5wCQW")[0].video.get('src')*/


    //console.log("hi");
}

async function openCrawlerWeb() {
    if (!checkDriver())
        return
    //loginFaceBook();
    loginInstagram();
}

openCrawlerWeb();
