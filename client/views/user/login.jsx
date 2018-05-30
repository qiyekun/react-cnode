import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import {//eslint-disable-line
  Redirect,
} from 'react-router-dom'
import queryString from 'query-string'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

import UserWrapper from './user'
import loginStyles from './styles/login-style'

@inject((stores) => {//eslint-disable-line
  return {
    appState: stores.appState,
    user: stores.appState.user,
  }
})
@observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  componentWillMount() {
    if (this.props.user.isLogin) {
      this.context.router.history.replace('/user/info')
    }
  }

  getFrom(location) {
    location = location || this.props.location //eslint-disable-line
    const query = queryString.parse(location.search)
    return query.from || '/user/info'
  }

  handleLogin() {
    const { accesstoken } = this.state //eslint-disable-line

    // handle login here
    if (!accesstoken) {
      return this.setState({
        helpText: '必须填写',
      })
    }

    this.setState({
      helpText: '',
    })

    return this.props.appState.login(accesstoken).catch((error) => {
      console.log(error)
    })
    // .catch((msg) => this.props.appState.notify({ message: msg }))
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  render() {
    const { classes } = this.props
    const { isLogin } = this.props.user
    const from = this.getFrom()

    if (isLogin) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="raised"
            color="inherit"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}


export default withStyles(loginStyles)(UserLogin)
