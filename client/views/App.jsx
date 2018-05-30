import React from 'react'
import Route from '../config/router'

import AppBar from './layout/app-bar'

export default class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return [
      <AppBar key="app-bar" />,
      <Route key="app-route" />,
    ]
  }
}

