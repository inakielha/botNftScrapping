const puppeteer = require("puppeteer")
const { configuracion } = require("../errors")
// const { parse } = require("node-html-parser");
// const { scrollingPosts, filterPosts, checkKeywords, test, urlScreenshot, listo } = require("./scrollPost");
const { loginTwitter } = require("../login");
const { Project } = require("../models/projects");
const { listMajors, api } = require("./googleSheets");

async function marketPlaceScrap(collection) {
    try {
                await this.page.goto(`https://alto.build/collections/${collection.replace(" ", "-")}`, { waitUntil: "networkidle2" });

                let supply = await this.page.$$eval('div .sc-8f4fdc93-0.jLYTmg', (divs) =>
                    divs.map((div) => {
                        return div.textContent
                    })
                );
                supply = supply.find((el)=>el.includes("Supply:"))
                supply = supply.replace("Supply: ","")
                let mintInfo = await this.page.$$eval('div .sc-b323c245-0.sc-b323c245-1.sc-cfc10521-0.gegBc.eLBQeu > div .sc-8f4fdc93-0.jLYTmg ', (divs) =>
                    divs.map((div) => {
                        return div.textContent
                    })
                );
                // console.log("MINT", mintInfo)
                let volumeToday = mintInfo[0]
                let totalVolume = mintInfo[6]
                let floorPrice = mintInfo[8]
                // console.log("MINT", volumeToday,totalVolume,floorPrice)
                let marketInfo = {
                    volumeToday,
                    supply,
                    totalVolume,
                    floorPrice
                }
                return marketInfo
        }catch (e) {
            console.log(e)
        }
    }
    // test()
    module.exports = {
        marketPlaceScrap
    }