const { LoginTicket } = require("google-auth-library");
const { delay, scrollUpWithRandomValue } = require("../helper/helper");

function isOneWeekAgo(dateString) {
  const oneWeekInMs = 604800000; // Number of milliseconds in one week
  const now = Date.now(); // Get the current date and time in milliseconds
  const date = new Date(dateString).getTime(); // Convert the ISO 8601 date string to a date object and get its time in milliseconds
  const diffInMs = now - date; // Calculate the time difference between the current date and the input date in milliseconds
  const diffInWeeks = diffInMs / oneWeekInMs; // Convert the time difference to weeks

  if (diffInWeeks < 1) {
    return false; // The date is not exactly one week ago
  } else {
    return true; // The date is exactly one week ago
  }
}

async function scroll() {
  await this.page.evaluate(() => {
    window.scrollBy(0, 500);
  });
  await this.page.waitForTimeout(1000 + Math.floor(Math.random() * 500));
}

async function posts(cuenta, fecha) {
  // 15 34 107
  let weekAgo;
  let allContent = [];
  let lastContent;
  let lastTime;
  let xpathpadrePosts = `/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/section/div/div`
  let xpathpadrePosts2 = `/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/section/div/div`
  let xpath = `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div[2]/div[1]/span`;
  let xpath2 = `/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div[2]/div[1]/span`
//   `https://twitter.com/search?q=(from%3A${cuenta})%20since%3A2023-06-01%20-filter%3Areplies&src=typed_query`
  await this.page.goto(
      `https://twitter.com/search?q=(from%3AVenomAlligators)%20since%3A2023-07-12%20-filter%3Areplies&src=typed_query`,
    { waitUntil: "networkidle2" }
  );
  await delay(4000);

  // https://twitter.com/search?q=(from%3A${cuenta})%20since%3A${fecha}%20-filter%3Areplies&src=typed_query
  
  let encuentraTweets = await this.page.$x(xpath);
  let encuentraTweets2 = await this.page.$x(xpath2);
  // console.log({ encuentraTweets, encuentraTweets2 });
  if (encuentraTweets.length || encuentraTweets2.length) {
      console.log("no hay resultados");
      return 0
    } 
    let elementoAnterior = ""
  for (let scroll = 0; scroll < 10; scroll ++) {
    let postGrupal = await this.page.$x(xpathpadrePosts2);
    const elemento = postGrupal[0];
    const elementosHijos = await elemento.$x('./*');
    console.log({actual: elementosHijos,anterior: elementoAnterior})
    elementoAnterior = elementosHijos

    for(let posteoIndividual of elementosHijos){
        let postContent = await posteoIndividual.$$eval(
          'div[aria-label][role="group"][id]',
          (divs) =>
            divs.map((div) => {
              let content = div.getAttribute("aria-label");
              return content;
            })
        );
    
        let postId = await posteoIndividual.$$eval(
            'a[aria-label][role="link"][dir="ltr"]',
            (divs) =>
              divs.map((div) => {
                let content = div.getAttribute("href");
                return content;
              })
          );
          if (postId.length){
              postId = postId[0].split("/")
              postId = postId[postId.length - 1]
          }else{
            // console.log(postId)  
            postId = ""
          } 
          let info = {postContent, postId}
        //   console.log(info)
    
        allContent = [...allContent, info];
        
    }
    await delay(1500)
    await page.keyboard.press('PageDown');
    // await scrollUpWithRandomValue(page)

  }
//   console.log({ allContent });
  let arrFilter = []
  let uniqueArray = []
  allContent.forEach((contenido)=>{
    if(!arrFilter.includes(contenido.postId) && contenido.postId){
        arrFilter.push(contenido.postId)
        uniqueArray.push(...contenido.postContent)
    }
  })
  let interactionsPoints = 0;
  console.log({ uniqueArray });
  uniqueArray.forEach((post) => {
    let english = false;
    post.includes("like") || post?.includes("replie")
      ? (english = true)
      : (english = false);

    let interactions = post?.split(",");
    interactions.forEach((reaccion) => {
      // console.log(english)
      if (reaccion.includes("respuesta") || reaccion.includes("replie")) {
        let replies;
        english
          ? (replies = reaccion.split("replie", 1))
          : (replies = reaccion.split("respuesta", 1));
        interactionsPoints = interactionsPoints + replies[0]?.trim() * 3;
      } else if (reaccion.includes("Retweet")) {
        let retweets = reaccion.split("Retweet", 1);
        interactionsPoints = interactionsPoints + retweets[0]?.trim() * 4;
      } else if (reaccion.includes("Me gusta") || reaccion.includes("like")) {
        let likes;
        english
          ? (likes = reaccion.split("like", 1))
          : (likes = reaccion.split("Me gusta", 1));
        interactionsPoints = interactionsPoints + likes[0]?.trim() * 2;
      }
    });
  });
  console.log({ interactionsPoints });
  if (isNaN(interactionsPoints)) return 0;
  else {
    await delay(2000);
    return interactionsPoints;
  }
}

// async function posts() {
//     // 15 34 107
//     let weekAgo;
//     let allContent = []
//     let lastContent;
//     let lastTime;

//     let xpath = `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/div[2]/div[1]/span`
//     while (!weekAgo) {
//         await scroll()
//         let postTime = await this.page.$$eval('time[datetime]', (divs) =>
//             divs.map((div) => {
//                 let time = div.getAttribute("datetime")
//                 return time
//             })
//         );
//         let postContent = await this.page.$$eval('div[aria-label][role="group"][id]', (divs) =>
//             divs.map((div) => {
//                 let content = div.getAttribute("aria-label")
//                 return content
//             })
//         );
//         // console.log("fechaPost", postTime)
//         // console.log("contenido", postContent)
//         allContent = [...allContent, ...postContent]
//         weekAgo = isOneWeekAgo(postTime[postTime.length - 1])
//         if(postTime[0] === lastTime && postContent[0] === lastContent) weekAgo = true
//         lastTime = postTime[0]
//         lastContent = postContent[0]

//     }
//     console.log({allContent})
//     let interactionsPoints = 0
//     allContent.forEach((post) => {
//         let english = false
//         post.includes("like") || post?.includes("replie") ? english = true : english = false

//         let interactions = post?.split(",")
//         interactions.forEach((reaccion) => {
//             // console.log(english)
//             if (reaccion.includes("respuesta") || reaccion.includes("replie")) {
//                 let replies;
//                 english ? replies = reaccion.split("replie", 1) : replies = reaccion.split("respuesta", 1)
//                 interactionsPoints = interactionsPoints + (replies[0]?.trim() * 3)

//             } else if (reaccion.includes("Retweet")) {
//                 let retweets = reaccion.split("Retweet", 1)
//                 interactionsPoints = interactionsPoints + (retweets[0]?.trim() * 4)

//             } else if (reaccion.includes("Me gusta") || reaccion.includes("like")) {
//                 let likes;
//                 english ? likes = reaccion.split("like", 1) : likes = reaccion.split("Me gusta", 1)
//                 interactionsPoints = interactionsPoints + (likes[0]?.trim() * 2)
//             }

//         })

//     })
//     console.log({interactionsPoints})
//     if(isNaN(interactionsPoints)) return 0
//     else return interactionsPoints
// }

module.exports = {
  posts,
};
