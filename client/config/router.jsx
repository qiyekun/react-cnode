import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'

import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'

import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => {// eslint-disable-line
  // debugger // eslint-disable-line
  return (
    <Route
      {...rest}
      render={
        (props) => (// eslint-disable-line
          isLogin ?
            <Component {...props} /> :
            <Redirect
              to={{
                pathname: '/user/login',
                search: `?from=${rest.path}`, // eslint-disable-line
              }}
            />
        )
      }
    />
  )
}

const InjectedPrivateRoute = withRouter(inject(({ appState }) => {// eslint-disable-line
  return {
    isLogin: appState.user.isLogin,
  }
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
  isLogin: PropTypes.bool,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="index" />,
  <Route path="/list" component={TopicList} exact key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact component={UserLogin} key="login" />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} key="user-info" />,
]
