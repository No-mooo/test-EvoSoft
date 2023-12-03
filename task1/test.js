"use strict";

const { By, Key, Builder, Actions } = require("selenium-webdriver");
// require("chromedriver");
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();

options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
options.addArguments("--disable-blink-features=AutomationControlled");
options.excludeSwitches('enable-automation');
options.excludeSwitches('enable-logging'); // no close broywher

const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
const fs = require('fs');
const action = driver.actions();

async function main() {
    await driver.get("https://www.nseindia.com/");
    await driver.sleep(2000);

    closeModal();

    // hover to section "MARKET DATA"
    const marketData = await driver.findElement(By.xpath('//*[@id="main_navbar"]/ul/li[3]'));
    await action.move({origin: marketData}).perform();

    await driver.sleep(1340);

    // click on the "Pre-Open Market"
    const preOpenMarket = await marketData.findElement(By.xpath('//*[@id="main_navbar"]/ul/li[3]/div/div[1]/div/div[1]/ul/li[1]/a'));
    await preOpenMarket.click();

    await driver.sleep(2000);

    // parse table "Pre-Open Market"
    const marketTable = await driver.findElements(By.xpath('//*[@id="livePreTable"]/tbody/tr'));
    const resulCsv = [];

    for (let item of marketTable) {
        try {
            const name = await item.findElement(By.xpath('.//td[2]/a')).getText();
            const finalPrice = await item.findElement(By.xpath('.//td[7]')).getText();
            resulCsv.push([name, finalPrice]);

        } catch (error) {
            console.log("Not found item");
        }
    }

    // create and write to a "output.csv"
    fs.writeFileSync('output.csv', resulCsv.map(row => row.join(',')).join('\n'), 'utf8');

    // choice section "Trade"
    const trade = await driver.findElement(By.xpath('//*[@id="main_navbar"]/ul/li[6]'));
    await trade.click();

    await driver.sleep(1340);

    // find section "Format"
    await trade.findElement(By.xpath('.//div/div[1]/div/div[2]/ul/li[4]')).then(resolve => resolve.click());
    
    await driver.sleep(1200);
    
    // click on the section "Members Homepage"
    const membersHomePage = await driver.findElement(By.xpath('//*[@id="static-left-navigation"]/ul/li[1]'));
    await membersHomePage.click();
    
    // find "Overview"
    await membersHomePage.findElement(By.xpath('.//ul/li[1]')).then(resolve => resolve.click());

    await driver.sleep(1104);

    // scroll to table "Alpha"
    const tableAlpha = await driver.findElement(By.xpath('/html/body/div[9]/div/section/div/div/div/div/div/div/div[1]/div[3]/div[5]'));
    await driver.executeScript("arguments[0].scrollIntoView(false);", tableAlpha);

    await driver.sleep(2000);

    await driver.quit();
}

function closeModal() {
    const modal = driver.switchTo().activeElement();

    if (modal) {
        modal.sendKeys(Key.ESCAPE);
    }
}

main();

