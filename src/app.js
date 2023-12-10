const puppeteer = require('puppeteer')

const getLyrics = async (groupName) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const pageAddress = `https://www.letras.com/${groupName}`
    console.log('Waiting for ' + pageAddress + '...')

    await page.goto(pageAddress, { waitUntil: 'domcontentloaded' })

    // Get most popular songs data
    const data = await page.evaluate(() => Array.from(document.querySelectorAll('.songList-table-row'), element => {
        return  {
            id: element.getAttribute('data-id'),
            title: element.getAttribute('data-name'),
            artist: element.getAttribute('data-artist')
        }
    }))
    
    // Get lyric by id
    let lyrics = []

    if (data) {
        for await (const element of data) {
            const lyricPageAddress = `${pageAddress}/${element.id}`
            console.log(`Getting lyric of ${element.title}`)

            await page.goto(lyricPageAddress, {
                waitUntil: 'domcontentloaded',
            })

            const lyric = await page.evaluate(() => {
                const element = document.querySelector('.lyric-original')
                return element.textContent
            })

            element['lyric'] = lyric
            lyrics.push(element)
        }
    }

    await browser.close()
    return lyrics.length > 0 ? lyrics : undefined
}

// const groupName = process.argv[2]

// if (!groupName) {
//     console.error('Group name is required as input! Type --help to more info')
//     return
// }

getLyrics('soft-kill')