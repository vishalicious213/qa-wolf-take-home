// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright")
const fs = require("fs")
const csvFilePath = './top-ten.csv'

async function saveHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    console.log("\x1b[33m"+"\n-+- GETTING TOP 10 ARTICLES FROM HACKER NEWS -+-\n"+"\x1b[0m")

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

function readCSV(filename) {
  // Read the CSV file
  fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading CSV file:', err)
          return
      }

      // Parse CSV data
      const rows = data.split('\n')
      const headers = rows[0].split(',')

      const results = rows.slice(1).map(row => {
          const values = row.split(',')
          return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index].trim()
              return obj
          }, {})
      })

      // Display the contents of the CSV file
      console.log("\x1b[33m"+"\n-+- TOP TEN ARTICLES FROM HACKER NEWS -+- \n"+"\x1b[0m")

      results.forEach(result => {
          console.log("Title: ", result.Title)
          console.log("URL:   ", result.URL, "\n")
      })

      console.log("\x1b[31m"+"\nCancel this process and return to the terminal by pressing CONTROL-C"+"\x1b[0m")
  })
}

(async () => {
    const articles = await saveHackerNewsArticles()
    createCSV(articles)
    readCSV(csvFilePath)
})()