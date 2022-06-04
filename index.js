const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const start = async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        // args: ["--proxy-server=128.199.214.87:3128"],
    });
    const page = await browser.newPage();

    await page.goto("https://food.grab.com/sg/en/", {
        waitUntil: "load",
        timeout: 0,
    });

    await page.type(
        "#location-input",
        "Chinatown Complex - 335 Smith St, Singapore, 050335"
    );
    // await page.waitFor(5000);
    await page.click(".submitBtn___2roqB");
    await page.waitForNavigation();

    const info = await page.$eval("#__NEXT_DATA__", (el) => el.innerText);

    const output = await info.split("\n").join("");
    await fs.writeFile("info.txt", output);

    await browser.close();
};

start();
