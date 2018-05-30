import React from 'react'
import PropTypes from 'prop-types'

import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import ListItemText from 'material-ui/List/ListItemText'
import Avatar from 'material-ui/Avatar' //eslint-disable-line

import { withStyles } from 'material-ui/styles' //eslint-disable-line

import IcomHome from 'material-ui-icons/Home' //eslint-disable-line

import cx from 'classnames'

import { topicPrimaryStyle, topicSecondaryStyles } from './styles'

import { tabs } from '../../util/variable-define'


const Primary = ({ classes, topic }) => { //eslint-disable-line
  const classnames = cx({
    [classes.tab]: true,
    [classes.top]: topic.top,
  })

  return (
    <div className={classes.root}>
      <span className={classnames}>{topic.top ? '置顶' : tabs[topic.tab]}</span>
      <span classes={classes.title}>{topic.title}</span>
    </div>
  )
}

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary)

Primary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
}

const Secondary = ({ classes, topic }) => { //eslint-disable-line
  return (
    <span className={classes.root}>
      <span className={classes.username}>{topic.author.loginname}</span>
      <span className={classes.count}>
        <span className={classes.accentColor}>{topic.reply_count}</span>
        <span>/</span>
        <span>{topic.visit_count}</span>
      </span>
      <span>创建时间:{topic.create_at}</span>
    </span>
  )
}


const StyledSecondary = withStyles(topicSecondaryStyles)(Secondary)

Secondary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
}

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <ListItemAvatar>
      <Avatar src={topic.author.avatar_url} />
    </ListItemAvatar>
    <ListItemText
      primary={<StyledPrimary topic={topic} />}
      secondary={<StyledSecondary topic={topic} />}
    />
  </ListItem>
)

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
}

export default TopicListItem
