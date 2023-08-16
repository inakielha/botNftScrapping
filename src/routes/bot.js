const puppeteer = require("puppeteer")
const { configuracion } = require("../errors")
const util = require('node:util');
// const { parse } = require("node-html-parser");
// const { scrollingPosts, filterPosts, checkKeywords, test, urlScreenshot, listo } = require("./scrollPost");
const { loginTwitter } = require("../login");
const { Project } = require("../models/projects");
const { listMajors, api } = require("./googleSheets");
const { marketPlaceScrap } = require("./marketplace");
const { posts } = require("./posts");
const fs = require('fs');
const mongoose = require ("mongoose");
const {delay, obtenerFechaHaceUnaSemana} = require ("../helper/helper.js")


async function initPuppeter() {
  try {
    // fs.appendFile('message.txt', 'entro', function (err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // });
    // return
    let allNetworks = await api()
    // let allNetworks = [["https://twitter.com/Venom_Jellyfish"]]
    // let allNetworks = [["https://twitter.com/Venom_Jellyfish"],["https://twitter.com/Venom_Cupid"],["https://twitter.com/VenomMonkeys"],["https://twitter.com/ravegamenft"],["https://twitter.com/VenomElephants"],["https://twitter.com/VenomBears"]]
    // https://twitter.com/search?q=(from%3AVenomElephants)%20since%3A2023-06-01%20-filter%3Areplies&src=typed_query
    // https://twitter.com/search?q=(from%3ABlankslate_NFT)%20since%3A2023-06-01%20-filter%3Areplies&src=typed_query
  
    // console.log(allNetworks, "ALL NETWORK")

    let response = []

    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
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
    await delay(2000)

    await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
    let fecha = obtenerFechaHaceUnaSemana()
    for (let j = 0; j < allNetworks.length; j++) {
      // for (let j = 0; j < 15; j++) {
        let nombre = allNetworks[j][0].split("/")
        nombre = nombre[nombre.length - 1]
        console.log("nombre: ", nombre)

      if (allNetworks[j][0].includes("twitter")) {
        await this.page.goto(allNetworks[j][0], { waitUntil: "networkidle2" });
    await delay(1000)
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
        // console.log(name)
        // name[0] === 'Iniciar sesión' ? name = name[2] : name = name[0]
        if (name[0] === 'Iniciar sesión' && name[2] === 'Activar notificaciones') name = name[4]
        else if (name[0] === 'Iniciar sesión') name = name[2]
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
        let interactions = await posts(nombre, fecha)
        if (image[0]) {

          // if (allNetworks[j].length > 1 && !allNetworks.length) {
          //   // let { volumeToday, supply, totalVolume, floorPrice, pageFound } = await marketPlaceScrap(allNetworks[j][1], false)
          //   // console.log(volumeToday, supply, totalVolume, floorPrice)
          //   console.log(allNetworks[j][1])
          //   if (pageFound) {
          //     response.push({
          //       altoUrl: allNetworks[j][1],
          //       url: allNetworks[j][0],
          //       photo: image[0],
          //       name,
          //       followers: followers[0],
          //       _id: j,
          //       hype: interactions
          //     })
          //   }
          // }else {
            response.push({
              url: allNetworks[j][0],
              photo: image[0],
              name,
              followers: followers[0],
              _id: j,
              hype: interactions
            })
          // }
        }
      // } else {
      //   let { volumeToday, supply, totalVolume, floorPrice, photo, pageFound } = await marketPlaceScrap(allNetworks[j][1], true)
      //   let name = allNetworks[j][0]
      //   if (pageFound) {
      //     response.push({
      //       altoUrl:allNetworks[j][1],
      //       photo,
      //       name,
      //       _id: j,
      //       minted: true,
      //       volumeToday,
      //       supply,
      //       totalVolume,
      //       floorPrice,
      //     })
      //   }
      }
    }

    let kFollowers = response

    for (let k = 0; k < kFollowers.length; k++) {
      if (kFollowers[k].photo && kFollowers[k].followers) {

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
      } else if (!kFollowers[k].photo) {
        kFollowers[k].photo = "nothing"
      }
    }
    // await Project.deleteMany()

    for (let h = 0; h < kFollowers.length; h++) {
      let projectsDb = await Project.find({_id:kFollowers[h]._id });
      if(projectsDb.length){
        await Project.updateOne({_id: kFollowers[h]._id },{
          img: kFollowers[h].photo,
          name: kFollowers[h].name,
          twitterFollowers: kFollowers[h].followers,
          minted: false,
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
      // }
    }
    // console.log(kFollowers)
    this.browser.close()
    console.log("listo")
    return
  } catch (e) {
    console.log(e)
    return
    // fs.appendFile('message.txt', 'fallo', function (err) {
    //   if (err) throw err;
    //   console.log('Saved error');
    // });
  }
}

module.exports = {
  initPuppeter
}