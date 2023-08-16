const puppeteer = require("puppeteer")
const { configuracion } = require("./errors");
const { delay } = require("./helper/helper");

async function loginTwitter(user_name, password) {
  await this.page.goto("https://twitter.com/i/flow/login", { waitUntil: "networkidle2" });
  await this.page.waitForTimeout(3000 + Math.floor(Math.random() * 500));

  await this.page.type('input', "matiasDemichelis10@gmail.com", { delay: 50 });
  await this.page.keyboard.press("Tab")
  await this.page.waitForTimeout(1000);
  await this.page.keyboard.press("Enter")
  await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  const span = await this.page.$$eval('span', (divs) =>
    divs.map((div) => {       
      return {
        text: div.textContent
      };
    })
  );
  // console.log(span)
  if (span[1].text === "Introduce tu número de teléfono o nombre de usuario") {
    await this.page.type('input[autocapitalize="none"]', "Matias824095", { delay: 50 });
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  }
  await this.page.type('input[autocapitalize="sentences"][name="password"]', "it4Consulting", { delay: 50 });
  await this.page.keyboard.press('Enter')
  await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  await delay(4000)
}
module.exports = {
  loginTwitter
}