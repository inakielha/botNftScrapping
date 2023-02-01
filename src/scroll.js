const fs = require('fs');
const { configuracion } = require("./errors")
const { parse } = require("node-html-parser");
const puppeteer = require("puppeteer")
const { promisify } = require('util');
const readFile = promisify(fs.readFile);


async function scrollingPosts(post_count) {
  let i = 0;
  while (i < post_count) {
    await this.page.evaluate(async () => {
      await window.scrollBy(0, document.body.scrollHeight);
    });

    await this.page.waitForTimeout(3000 + Math.floor(Math.random() * 500));
    i++;
  }
}

async function filterPosts(acountName) {
  let nameLength;
  if (acountName === "cronicadiario") nameLength = 17
  else if (acountName === "cronicatelevision") nameLength = 13
  else if (acountName === "baenegocios") nameLength = 15
  else if (acountName === "opinionaustral") nameLength = 21

  const divs = await this.page.$$eval('article[role="article"]', (divs) =>
    divs.map((div) => {
      return {
        text: div.textContent,
        html: div.innerHTML,
        ariaLabel: div.ariaLabel
      };
    })
  );
  let filtered_list = [];
  for (let i = 0; i < divs.length; i++) {
    console.log(acountName, divs[i].text.substring(nameLength, nameLength + 7))
    if (divs[i].ariaLabel == null) {
      let postDateMinutes = divs[i].text.substring(nameLength, nameLength + 7).includes("mi")
      let postDateHours = divs[i].text.substring(nameLength, nameLength + 7).includes("h")
      if (postDateMinutes || postDateHours) {
        console.log("entree", divs[i].text.substring(nameLength, nameLength + 7))
        filtered_list.push(divs[i]);
      }
    }
  }
  return filtered_list;
}


async function urlScreenshot(root_html, networkName, i) {
  let urlFb = root_html.querySelectorAll('a[aria-label][tabindex][role="link"]')
  let urltest = urlFb[1]?.getAttribute("href")
  let accountName;
  if (networkName === "cronicatelevision") accountName = "CronicaTV"
  if (networkName === "cronicadiario") accountName = "cronica"
  if (networkName === "baenegocios") accountName = "BAENegocios"
  if (networkName === "opinionaustral") accountName = "opinionaustral"

  fs.appendFile(`./images/${networkName}/${networkName}Url.txt`, `${accountName}, C:/rpa/Bot WhatsApp/Redes/facebook/webscrapping/src/images/image${i}.jpg, ${urltest}\r\n`, null, function (err) {
    if (err) throw err;
  });
  fs.appendFile(`./images/allPosts.txt`, `${accountName},Redes/facebook/webscrapping/src/images/todasImagenes/${networkName}image${i}.jpg, ${urltest}\r\n`, null, function (err) {
    if (err) throw err;
  });
  await this.page.goto(urltest, { waitUntil: "networkidle2" });
  await this.page.waitForTimeout(3000 + Math.floor(Math.random() * 500));
  await page.screenshot({ path: `images/todasImagenes/${networkName}image${i}.jpg` })
}

async function checkKeywords(text) {
  try {
    let characterNumber = text.indexOf("Me gusta")
    text = text.slice(0, characterNumber)
    console.log(text)
    let filtro = false
    let data = await readFile('./Filtro Redes.txt', 'utf8')
    let keyWords = data.split("\r\n")
    keyWords.forEach(keyWord => {
      if (text.toLowerCase().includes(keyWord.toLowerCase()) && keyWord !== "") {
        filtro = true
        console.log("palabra clave:", keyWord)
      }
    }
    );
    return filtro
  } catch (e) {

    console.log(e);
    return false;
  }
}

async function listo(){
  console.log("listo")
}

module.exports = {
  scrollingPosts,
  filterPosts,
  urlScreenshot,
  checkKeywords,
  listo
}