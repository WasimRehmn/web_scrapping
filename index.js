const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const start = async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        // args: ["--proxy-server=139.59.122.241:1080"],
    });
    const page = await browser.newPage();
    await page.goto("https://food.grab.com/sg/en/", {
        waitUntil: "load",
        timeout: 0,
    });
    await page.waitForSelector("#location-input");
    await page.type(
        "#location-input",
        "Chinatown Complex - 335 Smith St, Singapore, 050335"
    );
    const option = await page.waitForSelector(
        "body > div:nth-child(24) > div > div > div > ul > li:nth-child(3)"
    );
    await option.evaluate((el) => el.click());
    await page.click(".submitBtn___2roqB");
    await page.waitForNavigation();
    await page.waitForSelector(".textPrefix___8VBSV");
    let loadBtn = (await page.$(".ant-btn")) || "";

    while (loadBtn != "") {
        await loadBtn.click();
        page.on("response", async (response) => {
            if (response._request._resourceType === "xhr") {
                let data = await response.json();
                let json = JSON.stringify(data);
                for (let i = 0; i < json.length; i++) {
                    if (
                        json[i] === "l" &&
                        json[i + 3] === "i" &&
                        json[i + 7] === "e"
                    ) {
                        let j = i;
                        while (json[j] !== "}") {
                            j++;
                        }

                        fs.writeFile("info.txt", json.substring(i, j) + "\n", {
                            flag: "a",
                        });
                    }
                }
            }
        });
        await page.waitForTimeout(1000);
        loadBtn = (await page.$(".ant-btn")) || "";
    }

    await browser.close();
};

start();
