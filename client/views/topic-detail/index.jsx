import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked' //eslint-disable-line
import Helmet from 'react-helmet'
import {
  inject,
  observer,
} from 'mobx-react'

import SimpleMDE from 'react-simplemde-editor'
import Button from 'material-ui/Button'
import IconReply from 'material-ui-icons/Reply'

import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
import dateformat from 'dateformat'
import Container from '../layout/container'

import { TopicStore } from '../../store/topic-store'
import { topicDetailStyle } from './styles'

import Reply from './reply'


@inject((stores) => {//eslint-disable-line
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
  }
}) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      newReplay: '',//eslint-disable-line
    }

    this.handleNewReplayChange = this.handleNewReplayChange.bind(this)
    this.goToLogin = this.goToLogin.bind(this)
    this.doReply = this.doReply.bind(this)
  }

  componentDidMount() {
    const id = this.getTopicId()
    this.props.topicStore.getTopicDetail(id)
  }

  bootstrap() {//eslint-disable-line
    const id = this.getTopicId()
    this.props.topicStore.getTopicDetail(id)
  }

  getTopicId() {
    return this.props.match.params.id
  }

  handleNewReplayChange(value) {
    this.setState({
      newReplay: value,//eslint-disable-line
    })
  }

  goToLogin() {
    this.context.router.history.push('/user/login')
  }

  doReply() {
    const { newReplay } = this.state
    const id = this.getTopicId()
    const topic = this.props.topicStore.detailMap[id]
    topic.doReply(newReplay).then(() => {
      this.setState({ newReplay: '' })
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    const {
      classes,
      topicStore,
      appState,
    } = this.props
    const id = this.getTopicId()
    const topic = topicStore.detailMap[id]
    const { user } = appState

    console.log(user)

    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="accent" />
          </section>
        </Container>
      )
    }

    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        {
          topic.createdReplies
            && topic.length > 0
            ? <Paper elevation={4} className={classes.replies}>
              <header className={classes.replyHeader}>
                <span>我的最新回复</span>
                <span>{`${topic.createdReplies.length}条`}</span>
              </header>
              {
                createdReplies.map(reply => {//eslint-disable-line
                  return (
                    <Reply
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginName,
                        },
                      })}
                      key={reply.id}
                    />
                  )
                })
              }
            </Paper>//eslint-disable-line
            : null
        }

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${dateformat(topic.last_reply_at, 'yy年m月dd日')}`}</span>
          </header>

          {
            user.isLogin && <section className={classes.replyEditor}>
              <SimpleMDE
                onChange={this.handleNewReplayChange}
                value={this.state.newReply}
                options={{
                  toolbar: false,
                  autoFocus: true,
                  spellChecker: false,
                  placeholder: '添加您的精彩恢复',
                }}
              />
              <Button fab color="primary" onClick={this.doReply} className={classes.replyButton} >
                <IconReply />
              </Button>
            </section> //eslint-disable-line
          }

          {
            !user.isLogin && <section className={classes.notLoginButton}>
              <Button variant="raised" color="inherit" onClick={this.goToLogin} >登录并进行回复</Button>
            </section>//eslint-disable-line
          }

          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

TopicDetail.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,//eslint-disable-line
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}


TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail)
