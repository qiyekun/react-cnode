import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import { CircularProgress } from 'material-ui/Progress'

import queryString from 'query-string'

// import Button from 'material-ui/Button'
// import { AppState } from '../../store/store'

import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'

@inject((stores) => {//eslint-disable-line
  return {
    // appState: stores.appState,
    topicStore: stores.topicStore,
  }
})
@observer
class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentWillMount() {
    this.props.topicStore.fetchTopics(this.getTab())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  bootstrap() {//eslint-disable-line
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab//eslint-disable-line
    return this.props.topicStore.fetchTopics(tab || 'all').then((topics) => {//eslint-disable-line
      return true
    }).catch(() => {//eslint-disable-line
      return false
    })
  }


  getTab(search) {
    search = search || this.props.location.search //eslint-disable-line
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    })
  }


  listItemClick = (topic) => {
    this.context.router.history.push(`/detail/${topic.id}`)
  }


  render() {
    const { topicStore } = this.props
    const topicList = topicStore.topics

    const syncingTopics = topicStore.syncing

    const tab = this.getTab()


    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>

        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map((t) => (//eslint-disable-line
              <Tab key={t} label={tabs[t]} value={t} />
            ))
          }
        </Tabs>

        {
          topicList && topicList.length > 0 ?
            <List>
              {
                topicList.map(topic => <TopicListItem onClick={() => this.listItemClick(topic)} topic={topic} key={topic.id} />)//eslint-disable-line
              }
            </List>
            : null
        }


        {
          syncingTopics ? <div style={{ display: 'flex', justifyContent: 'space-around', padding: '40px 0' }}><CircularProgress color="primary" size={100} /></div> : null
        }

      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}


export default TopicList
