const puppeteer = require("puppeteer")
const { configuracion } = require("../errors")
// const { parse } = require("node-html-parser");
// const { scrollingPosts, filterPosts, checkKeywords, test, urlScreenshot, listo } = require("./scrollPost");
const { loginTwitter } = require("../login");
const { Project } = require("../models/projects");
const { listMajors, api } = require("./googleSheets");

async function marketPlaceScrap(collection,tweeterExist) {
    try {
        await this.page.goto(`https://alto.build/collections/${collection.replace(" ", "-")}`, { waitUntil: "domcontentloaded" });
        await this.page.waitForTimeout(6000)
        let notFound = await this.page.$$eval('div [style]', (divs) =>
        divs.map((div) => {
            return div.innerText
        })
    );
    let pageNotFound = notFound.some((text)=>text === "This page could not be found.")
    // console.log("nf",pageNotFound)
        if (pageNotFound){
            return {
                volumeToday:"",
                supply:"",
                totalVolume:"",
                floorPrice:"",
                pageFound: false
            }
        }
        let supply = await this.page.$$eval('div .sc-8f4fdc93-0.jLYTmg', (divs) =>
            divs.map((div) => {
                return div.textContent
            })
        );
        supply = supply.find((el) => el.includes("Supply:"))
        supply = supply.replace("Supply: ", "")

        let mintBasicInfo = await this.page.$$eval('div .sc-9e7d782b-0.uoYjw', (divs) =>
            divs.map((div) => {
                return div.textContent
            })
        );
        // console.log(mintBasicInfo,"basic")
        
        let usdDivide = mintBasicInfo[0].split("$USD")
        usdDivide=usdDivide.map(text=>text.split("").reverse().join(""))
        usdDivide = usdDivide.map((text)=>{
            let divid = text.split("OTNAC",1)
            return divid[0].split("").reverse().join("")
        })

        // console.log("advance info",usdDivide)
        let volumeToday;
        usdDivide.length-4 == 0 ? volumeToday = usdDivide[0] : volumeToday = "-" 
        let totalVolume = usdDivide[usdDivide.length - 3]
        let floorPrice = usdDivide[usdDivide.length - 2]

        let marketInfo = {
            volumeToday,
            supply,
            totalVolume,
            floorPrice,
            pageFound: true
        }
        if(tweeterExist){
            let photo = await this.page.$$eval('img[size="200"]', (divs) =>
            divs.map((div) => {
                return div.getAttribute("src")
            })
            );
            // console.log(photo)
            marketInfo.photo = photo[0]
        }
        console.log(marketInfo)
        return marketInfo
    } catch (e) {
        // console.log(e)
    }
}
// test()
module.exports = {
    marketPlaceScrap
}