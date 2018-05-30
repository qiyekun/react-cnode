const ejs = require('ejs')
const bootstrap = require('react-async-bootstrapper')
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default
const ReactDomServer = require('react-dom/server')

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const colors = require('material-ui/colors')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const routerContext = {}
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default

    const stores = createStoreMap()

    const sheetsRegistry = new SheetsRegistry()
    const jss = create(preset())
    jss.options.createGenerateClassName = createGenerateClassName
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
        type: 'light'
      }
    })

    // const app = createApp(stores, routerContext, req.url)
    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)

    bootstrap(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }

      const helmet = Helmet.rewind()

      const state = getStoreState(stores)

      const context = ReactDomServer.renderToString(app)

      const html = ejs.render(template, {
        appString: context,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.style.toString(),
        materialCss: sheetsRegistry.toString()
      })

      res.send(html)
      // res.send(template.replace('<!-- app -->', context))
      resolve()
    }).catch(reject)
  })
}
