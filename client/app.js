import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'  //eslint-disable-line
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { lightBlue, pink } from 'material-ui/colors'

import App from './views/App' //eslint-disable-line


import { createStoreMap } from './store/store'

// import { AppState, TopicStore } from './store/store'
// const appState = new AppState(initialState.appState)
// const topicStore = new TopicStore(initialState.appState)

// const stores = {
//   appState: appState,//eslint-disable-line
//   topicStore: topicStore,//eslint-disable-line
// };

const theme = createMuiTheme({
  palette: {
    primary: pink,
    accent: lightBlue,
    type: 'light',
  },
})

const root = document.getElementById('root');

const initialState = window.__INITIAL__STATE__ || {} //eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const stores = createStoreMap()

const render = (Comment) => {
  ReactDom.render(//eslint-disable-line
    <AppContainer>
      <Provider {...stores}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Comment />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>, root);
}

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default; //eslint-disable-line
    render(createApp(NextApp));
  });
}
