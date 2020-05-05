# weibo-crawler
node.js crawler get weibo hotList

## start

yarn start => node app.js

## commit

### add commitizen

yarn add commitizen --dev

&then package.json add
```json
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

yarn commit => git add . && git-cz

