import puppeteer from "puppeteer";
import lighthouse from "lighthouse";

const config = {
    desktop: {
        extends: "lighthouse:default",
        settings: {
          formFactor: "desktop",
          screenEmulation: {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            },
          emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        },
      },
    mobile: undefined
}

export default async (url, type) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_BIN,
    ignoreDefaultArgs: ["--enable-automation"],
  });
  const page = await browser.newPage();
  const results = await lighthouse(
    url,
    undefined,
    config[type],
    page
  );
  await browser.close();
  return results.lhr;
};
