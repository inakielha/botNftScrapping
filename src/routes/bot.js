const puppeteer = require("puppeteer")
const { configuracion } = require("../errors")
// const { parse } = require("node-html-parser");
// const { scrollingPosts, filterPosts, checkKeywords, test, urlScreenshot, listo } = require("./scrollPost");
const { loginTwitter } = require("../login");
const { Project } = require("../models/projects");
const { listMajors, api } = require("./googleSheets");
const { marketPlaceScrap } = require("./marketplace");
const { posts } = require("./posts");

async function initPuppeter() {
  try {
    let allNetworks = await api()
    // let allNetworks = [["https://twitter.com/cantolongnecks"],
    // ["https://twitter.com/CantiesCanto"],["https://twitter.com/Shnoises"]]
    // console.log(allNetworks, "ALL NETWORK")
    let response = []

    this.browser = await puppeteer.launch({
      headless: configuracion.headless,
      args: ["--no-sandbox"],
      devtools: false,
    });
    const context = this.browser.defaultBrowserContext();
    context.overridePermissions(configuracion.base_url, [
      "geolocation",
      "notifications",
    ]);
    this.page = await this.browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await loginTwitter("botrpa@gmail.com", "it4Consulting10")


    for (let j = 0; j < allNetworks.length; j++) {
      // for (let j = 0; j < 15; j++) {
      await this.page.goto(allNetworks[j][0], { waitUntil: "networkidle2" });
      await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
      const span = await this.page.$$eval('a[role="link"]', (divs) =>
        divs.map((div) => {
          if (div.textContent.includes("Followers") || div.textContent.includes("Seguidores")) {
            return div.textContent
          }
        })
      );
      let followers = span.filter((div) => div !== null)
      // console.log(followers)
      followers[0] ? "" : followers[0] = "revisar"

      let name = await this.page.$$eval('span .css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', (divs) =>
        divs.map((div) => {
          return div.textContent
        })
      );
      console.log(name)
      // name[0] === 'Iniciar sesión' ? name = name[2] : name = name[0]
      if (name[0] === 'Iniciar sesión'&& name[2] === 'Activar notificaciones' ) name = name[4]
      else if(name[0] === 'Iniciar sesión') name = name[2]
      else name = name[0]
      // console.log(name)
      let image = await this.page.$$eval('a[role="link"]', (divs) =>
        divs.map((div) => {
          let link = div.getAttribute("href")
          if (link.endsWith("/photo")) {
            return link
          }
        })
      );
      image = image.filter((div) => div !== null)

      let interactions = await posts()
      if (image[0]) {

        if (allNetworks[j].length > 1) {
          let { volumeToday, supply, totalVolume, floorPrice } = await marketPlaceScrap(allNetworks[j][1])
          // console.log(volumeToday,supply,totalVolume,floorPrice)
          response.push({
            url: allNetworks[j][0],
            photo: image[0],
            name,
            followers: followers[0],
            _id: j,
            minted: true,
            volumeToday,
            supply,
            totalVolume,
            floorPrice,
            hype: interactions
          })
        }

        else {
          response.push({
            url: allNetworks[j][0],
            photo: image[0],
            name,
            followers: followers[0],
            _id: j,
            minted: false,
            hype: interactions
          })
        }
      }
    }

    // console.log(response, "kFollow")
    let kFollowers = response

    for (let k = 0; k < kFollowers.length; k++) {
      if (kFollowers[k].photo) {

        await this.page.goto("https://twitter.com" + kFollowers[k].photo, { waitUntil: "networkidle2" });
        // await this.page.goto("https://twitter.com/funnyybuns/photo", { waitUntil: "networkidle2" });
        let images = await this.page.$$eval('img[alt][draggable="true"]', (divs) =>
          divs.map((div) => {
            let link = div.getAttribute("src")
            return link
          })
        );
        // console.log(images)
        kFollowers[k].photo = images[0]
      } else {
        kFollowers[k].photo = "nothing"
      }
    }

    await Project.deleteMany()

    for (let h = 0; h < kFollowers.length; h++) {
      if (kFollowers[h].minted) {
        await Project.create({
          _id: kFollowers[h]._id,
          img: kFollowers[h].photo,
          name: kFollowers[h].name,
          twitterFollowers: kFollowers[h].followers,
          minted: true,
          volumeToday: kFollowers[h].volumeToday,
          supply: kFollowers[h].supply,
          totalVolume: kFollowers[h].totalVolume,
          floorPrice: kFollowers[h].floorPrice,
          hype: kFollowers[h].hype,
          url: kFollowers[h].url
        })
      } else {
        await Project.create({
          _id: kFollowers[h]._id,
          img: kFollowers[h].photo,
          name: kFollowers[h].name,
          twitterFollowers: kFollowers[h].followers,
          minted: false,
          hype: kFollowers[h].hype,
          url: kFollowers[h].url
        })
      }
    }
    console.log(kFollowers)
    this.browser.close()
    console.log("listo")
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  initPuppeter
}