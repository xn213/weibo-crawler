// cherrio 是 nodejs 的抓取页面模块，为服务器特别定制的，快速、灵活、实施的 jQuery 核心实现。适合各种 Web 爬虫程序。node.js 版的 jQuery。
const cheerio = require('cheerio')
// superagent 是一个轻量级、渐进式的请求库，内部依赖 nodejs 原生的请求 api,适用于 nodejs 环境.
const superagent = require('superagent')
const fs = require('fs')

const nodeSchedule = require('node-schedule')

// 微博热搜的 url
const WEBO_URL = 'https://s.weibo.com'
const hotSearchURL = WEBO_URL + '/top/summary?cate=realtimehot'

function getWeiboHotSearchList() {
  return new Promise((resolve, reject) => {
    // 使用 superagent 发送 get 请求
    superagent.get(hotSearchURL, (err, res) => {
      if (err) reject('request error')
      const $ = cheerio.load(res.text)
      let hotList = []
      $('#pl_top_realtimehot table tbody tr').each(function (index) {
        if (index != 0) {
          const $td = $(this).children().eq(1)
          const link = WEBO_URL + $td.find('a').attr('href')
          const text = $td.find('a').text()
          const hotValue = $td.find('span').text()
          const icon = $td.find('img').attr('src') ? 'https:' + $td.find('img').attr('src') : ''
          hotList.push({
            index,
            link,
            text,
            hotValue,
            icon,
          })
        }
      })
      hotList.length ? resolve(hotList) : reject('error')
    })
  })
}

const TIME = '30 * * * * *'
let count = 0
nodeSchedule.scheduleJob(TIME, async function () {
  try {
    const hotList = await getWeiboHotSearchList()
    await fs.writeFileSync(
      `${__dirname}/hotSearch.json`,
      JSON.stringify(hotList, null, 2),
      'utf-8'
    )
    count++
    console.log(new Date(), `完成第${count}次微博热搜爬取...`)

  } catch (err) {
    console.log('error: ', err)
  }
})
