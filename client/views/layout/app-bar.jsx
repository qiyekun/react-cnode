import React from 'react'
import PropTypes from 'prop-types' //eslint-disable-line
import { withStyles } from 'material-ui/styles' //eslint-disable-line

import {
  inject,
  observer,
} from 'mobx-react'

import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/Toolbar' //eslint-disable-line
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
}

@inject((stores) => {//eslint-disable-line
  return {
    appState: stores.appState,
  }
})
@observer
class MainAppBar extends React.Component {
  // 声明Context对象属性
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.onHomeIconClick = this.onHomeIconClick.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
    this.loginButtonClick = this.loginButtonClick.bind(this)
  }

  /* eslint-disable */
  onHomeIconClick() {
    this.context.router.history.push('/list?tab=all')
  }

  createButtonClick() {

  }

  loginButtonClick() {
    const { appState } = this.props
    const { user } = appState
    if (user.isLogin) {
      this.context.router.history.push('/user/info')
    } else {
      this.context.router.history.push('/user/login')
    }

  }
  /* eslint-enable */

  render() {
    const { appState, classes } = this.props
    const { user } = appState
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="default" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>JNode</Typography>
            <Button variant="raised" color="inherit" onClick={this.createButtonClick}>新建话题</Button>
            <Button color="default" onClick={this.loginButtonClick}>{user.isLogin ? user.info.loginname : '登陆'}</Button>
          </ToolBar>
        </AppBar>
      </div>
    )
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)
