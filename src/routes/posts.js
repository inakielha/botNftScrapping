const { LoginTicket } = require("google-auth-library");

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


async function posts() {
    // 15 34 107
    let weekAgo;
    let allContent = []
    let lastContent;
    let lastTime;
    while (!weekAgo) {
        await scroll()
        let postTime = await this.page.$$eval('time[datetime]', (divs) =>
            divs.map((div) => {
                let time = div.getAttribute("datetime")
                return time
            })
        );
        let postContent = await this.page.$$eval('div[aria-label][role="group"][id]', (divs) =>
            divs.map((div) => {
                let content = div.getAttribute("aria-label")
                return content
            })
        );
        console.log("fechaPost", postTime)
        console.log("contenido", postContent)
        allContent = [...allContent, ...postContent]
        weekAgo = isOneWeekAgo(postTime[postTime.length - 1])
        if(postTime[0] === lastTime && postContent[0] === lastContent) weekAgo = true
        lastTime = postTime[0]
        lastContent = postContent[0]
        
    }
    // console.log(allContent)
    let interactionsPoints = 0
    allContent.forEach((post) => {
        let english = false
        post.includes("like") || post?.includes("replie") || post?.includes("Retweet") ? english = true : english = false

        let interactions = post?.split(",")
        interactions.forEach((reaccion) => {
            if (reaccion.includes("respuesta") || reaccion.includes("replie")) {
                let replies;
                english ? replies = reaccion.split("replie", 1) : replies = reaccion.split("respuesta", 1)
                interactionsPoints = interactionsPoints + (replies[0]?.trim() * 3)


            } else if (reaccion.includes("Retweet")) {
                let retweets = reaccion.split("Retweet", 1)
                interactionsPoints = interactionsPoints + (retweets[0]?.trim() * 4)

            } else if (reaccion.includes("Me gusta") || reaccion.includes("like")) {
                let likes;
                english ? likes = reaccion.split("like", 1) : likes = reaccion.split("Me gusta", 1)
                interactionsPoints = interactionsPoints + (likes[0]?.trim() * 2)
            }

        })

    })
    console.log(interactionsPoints)
    if(isNaN(interactionsPoints)) return 0 
    else return interactionsPoints
}

module.exports = {
    posts
}