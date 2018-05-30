const express = require('express')
const fs = require("fs")//eslint-disable-line
const path = require("path")//eslint-disable-line

const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')

const serverRender = require('./util/server-render')

const app = express()

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

const isDev = process.env.NODE_ENV === 'development'

if (!isDev) {
  const serverEntry = require('../dist/server.entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  app.use("/public", express.static(path.join(__dirname, '../dist')))//eslint-disable-line

  app.get('*', (req, res, next) => {
    // const appString = ReactSSR.renderToString(serverEntry)
    // res.send(template.replace('<!-- app -->', appString))

    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send(error)
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333
app.listen(port, host, () => {
  console.log('server is listening on 3333')
})
