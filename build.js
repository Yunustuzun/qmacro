const Parser = require('rss-parser')
const parser = new Parser({
  headers: {
    'Accept': 'application/atom+xml'
  }
})

const request = require('then-request')

const Handlebars = require('handlebars')
const template = Handlebars.compile(require('./template'))

const maxItems = 3

const sources = {
  RSS: {
    qmacro:        'https://qmacro.org/feed.xml',
    autodidactics: 'https://qmacro.org/autodidactics/feed.xml',
    langram:       'https://langram.org/feed.xml',
    ytqmacro:      'https://www.youtube.com/feeds/videos.xml?channel_id=UCDUgrP3koL_o2iz6m55H1uA',
    ytsapdevs:     'https://www.youtube.com/feeds/videos.xml?playlist_id=PLfctWmgNyOIebP3qa7jXfn68QcwS5dttb',
    techaloud:     'https://anchor.fm/s/e5dc36c/podcast/rss',
    sap:           'https://content.services.sap.com/feed?type=blogpost&author=dj.adams.sap'
  }
}

// Return a given object, but with the date property formatted nicely
const niceDate = item => {
  item._date = new Date(item._date).toDateString()
  return item
}

const normalise = {
  RSS: item => {
    item._title = item.title
    item._link  = item.link
    item._date  = item.pubDate
    return item
  }
}

// Return the latest N items from an RSS feed
const latestRSS = async URL => {
  const feed = await parser.parseURL(URL)
  return feed
    .items
    .slice(0, maxItems)
    .map(normalise.RSS)
    .map(niceDate)
}

const main = async () => {
  try {
    const feeds = {}
    feeds.qmacro = await latestRSS(sources.RSS.qmacro)
    feeds.autodidactics = await latestRSS(sources.RSS.autodidactics)
    feeds.langram = await latestRSS(sources.RSS.langram)
    feeds.ytqmacro = await latestRSS(sources.RSS.ytqmacro)
    feeds.ytsapdevs = await latestRSS(sources.RSS.ytsapdevs)
    feeds.techaloud = await latestRSS(sources.RSS.techaloud)
    feeds.sap = await latestRSS(sources.RSS.sap)
    console.log(template({
      qmacro: feeds.qmacro,
      autodidactics: feeds.autodidactics,
      langram: feeds.langram,
      ytqmacro: feeds.ytqmacro,
      ytsapdevs: feeds.ytsapdevs,
      techaloud: feeds.techaloud,
      sap: feeds.sap
    }))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()




