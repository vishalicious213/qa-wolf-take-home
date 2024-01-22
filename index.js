// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright")
const fs = require("fs")

async function saveHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    // go to Hacker News
    await page.goto("https://news.ycombinator.com")

    // get titles and urls
    const articles = await page.evaluate(() => {
      const articleData = document.querySelectorAll(".titleline a")
      const articlesArray = []

      // trim out the links that aren't articles
      for (const article of articleData) {
          const title = article.innerText
          const url = article.href
          const unneeded = article.childNodes[0].firstChild

          if (!unneeded) {
              articlesArray.push([title, url])
          }
      }

      // return the top 10 articles
      return articlesArray.slice(0, 10)
  })

  await page.close()
  return articles
}

function createCSV(data) {
  // convert data to csv string
  function convertToCSV(data) {
      const csvArray = [["Title", "URL"],]

      data.forEach(row => {
          csvArray.push(row.join(','))
      })

      return csvArray.join('\n')
  }

  const csvString = convertToCSV(data)

  // filename for csv (will save in root of project folder)
  const csvFile = "top-ten.csv"

  // write to file
  fs.writeFileSync(csvFile, csvString, "utf-8")

  console.log("CSV file created at: ", csvFile )
}

(async () => {
    const articles = await saveHackerNewsArticles()
    createCSV(articles)
})();
