const puppeteer = require("puppeteer")
const { configuracion } = require("./errors")

async function loginTwitter(user_name, password) {
  await this.page.goto("https://twitter.com/i/flow/login", { waitUntil: "networkidle2" });
  await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));

  await this.page.type('input[autocapitalize="sentences"]', "ravevis950@ekcsoft.com", { delay: 50 });
  await this.page.click('div[role="button"]:nth-child(n+4)');
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
    await this.page.type('input[autocapitalize="none"]', "martinnft666", { delay: 50 });
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  }
  await this.page.type('input[autocapitalize="sentences"][name="password"]', "it4Consulting", { delay: 50 });
  await this.page.keyboard.press('Enter')
  await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
  //   const divs = await this.page.$$eval('div[data-testid="LoginForm_Login_Button"]', (divs) =>
  //   divs.map((div) => {
  //     return {
  //       text: div.textContent
  //     };
  //   })
  // );
  //     console.log(divs)
  //     await this.page.click(configuracion.login_button);
  //     await this.page.waitForNavigation({ waitUntil: "networkidle2" });
  //     await this.page.waitForTimeout(500 + Math.floor(Math.random() * 500));
  //     return loginResponse;
}
module.exports = {
  loginTwitter
}