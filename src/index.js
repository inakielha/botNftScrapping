const puppeteer = require("puppeteer")
const { configuracion } = require("./errors")
// const { parse } = require("node-html-parser");
// const { scrollingPosts, filterPosts, checkKeywords, test, urlScreenshot, listo } = require("./scrollPost");
const { loginTwitter } = require("./login");

async function initPuppeter() {
  let allNetworks = ["https://twitter.com/SUI_NFT",
    "https://twitter.com/SuiSoccer",
    "https://twitter.com/SuiCatClub",
    "https://twitter.com/SuiptosNFT",
    "https://twitter.com/SuiMo_NFT",
    "https://twitter.com/sui_insider_TIG",
    "https://twitter.com/SuiWatcher",
    "https://twitter.com/NFT_Kinoko",
    "https://twitter.com/thelightonsui",
    "https://twitter.com/Sui_BoltApeYC",
    "https://twitter.com/SuiGoziKong",
    "https://twitter.com/FoxesSui",
    "https://twitter.com/nft_mammoth",
    "https://twitter.com/Sui_MDC",
    "https://twitter.com/NerrrrrdClub",
    "https://twitter.com/OlympGodsNFT",
    "https://twitter.com/SuiMonkeys",
    "https://twitter.com/SuiClowns",
    "https://twitter.com/Suiark_nft",
    "https://twitter.com/OKGuardians_NFT",
    "https://twitter.com/SupLizardNFT",
    "https://twitter.com/galactic_apes",
    "https://twitter.com/Cheappskates",
    "https://twitter.com/sui_g00dies",
    "https://twitter.com/peepsdotblock",
    "https://twitter.com/Suiheroes_io",
    "https://twitter.com/eggworld_sui",
    "https://twitter.com/suiMonstrX",
    "https://twitter.com/SuiarNFT",
    "https://twitter.com/DepthosNFT",
    "https://twitter.com/Sui_MB",
    "https://twitter.com/OtterLabsNFT",
    "https://twitter.com/SUIGorillas",
    "https://twitter.com/SuiMaxNFT",
    "https://twitter.com/SuiGnome",
    "https://twitter.com/ThumbWarsNFT",
    "https://twitter.com/SuiWorldHQ",
    "https://twitter.com/DinoSuiNFT",
    "https://twitter.com/SUIDemiGods",
    "https://twitter.com/SuiGatorz",
    "https://twitter.com/SuiGatorz",
    "https://twitter.com/suivivors",
    "https://twitter.com/SuiCitizen",
    "https://twitter.com/DuckiesNFTsui",
    "https://twitter.com/Sui_insiders",
    "https://twitter.com/SuiOkayBears",
    "https://twitter.com/funnyybuns?t=iQV1culGPPZ9bsnALXw9rA&s=08",
    "https://twitter.com/meadowlaunch",
    "https://twitter.com/SuiGoats",
    "https://twitter.com/SUIDinosNFT",
    "https://twitter.com/Babyapessociety",
    "https://twitter.com/WizardLandSui",
    "https://twitter.com/Puke2Earn",
    "https://twitter.com/SugarKingdomNFT",
    "https://twitter.com/SuiRetroDragon"]
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
  // this.page.setViewport({ width: 848, height: 1037 });
  await page.setDefaultNavigationTimeout(0);
  await loginTwitter("botrpa@gmail.com", "it4Consulting10")
  //   await this.page.setCacheEnabled(false);
  for (let j = 0; j < allNetworks.length; j++) {
    await this.page.goto(allNetworks[j], { waitUntil: "networkidle2" });
    await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
    const span = await this.page.$$eval('a[role="link"]', (divs) =>
      divs.map((div) => {
        if (div.textContent.includes("Followers")) {
          return div.textContent
        }
      })
    );
    let followers = span.filter((div) => div !== null)
    // console.log(followers)

    let name = await this.page.$$eval('span .css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', (divs) =>
      divs.map((div) => {
        return div.textContent
      })
    );
    name = name[0]
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

    // console.log(image)
    response.push({
      photo: image[0],
      name,
      followers: followers[0]
    })

    //   await scrollingPosts(40)
    //   let filtered_list = await filterPosts(allNetworks[j])
    //   let root_html = ""
    //   for (let i = 0; i < filtered_list.length; i++) {
    //     try {
    //       root_html = parse(filtered_list[i].html);
    //       let haveKeywords = await checkKeywords(filtered_list[i].text)
    //       console.log("havekeywords", haveKeywords)
    //       if (haveKeywords) {
    //         await urlScreenshot(root_html, allNetworks[j],i)
    //       }
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   }
    // }
    // await this.browser.close();
    // console.log("listodeuna")
  }
  // console.log(response)

  //  response.sort((a, b) => {
  //   let aNumber;
  //   // let aNumber = a.followers.indexOf("K")
  //   let bNumber;
  //   // let bNumber = b.followers.indexOf("K")

  //   a.followers?.includes("K") ? aNumber = a.followers?.indexOf("K") : aNumber = a.followers?.indexOf("Followers") 
  //   b.followers?.includes("K") ? bNumber = b.followers?.indexOf("K") : bNumber = b.followers?.indexOf("Followers") 
  //   let aFollowers;
  //   let bFollowers;

  //   a.followers?.includes("K") ? aFollowers= a.followers?.slice(0,aNumber)*1000 :aFollowers = a.followers?.slice(0,bNumber).replace(",","")
  //   b.followers?.includes("K") ? bFollowers= b.followers?.slice(0,aNumber)*1000 :bFollowers = b.followers?.slice(0,bNumber).replace(",","")
  //   // if(aFollowers?.includes(".")) aFollowers = (aFollowers*1000).replace(",",".")
  //   console.log(aFollowers)
  //   // if(bFollowers?.includes(".")) bFollowers = (bFollowers*1000).replace(",",".")
  //   console.log(bFollowers)
  //   console.log(aFollowers - bFollowers)
  //   console.log("--------------------")

  //   if(!aFollowers) return 1
  //   else if(!bFollowers) return -1
  //   else if(aFollowers > bFollowers) return -1
  //   else if(aFollowers < bFollowers) return 1
  //   else if (aFollowers === bFollowers)return 0
  // })
  let kFollowers = response.filter(user => user.followers?.includes("K"));
  kFollowers.sort((a, b) => {
    let aNumber = a.followers.split("K", 1)
    let bNumber = b.followers.split("K", 1)
    let aFollowers = aNumber[0] * 1000
    let bFollowers = bNumber[0] * 1000

    if (!aFollowers) return 1
    else if (!bFollowers) return -1
    else if (aFollowers > bFollowers) return -1
    else if (aFollowers < bFollowers) return 1
    else if (aFollowers === bFollowers) return 0
  })
  kFollowers = kFollowers.slice(0,10)
  console.log(kFollowers)
  console.log(kFollowers.length)
}

initPuppeter()