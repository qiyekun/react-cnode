import React from 'react';
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'


import App from './views/App'
import { createStoreMap } from './store/store'

// 让mobx在服务端渲染的时候，不会重复数据交换
useStaticRendering(true)

export default (stores, routerContext, sheetsRegistry, jss, them, url) => { //eslint-disable-line
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider them={them}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )
}

export { createStoreMap }
