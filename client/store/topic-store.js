import {
  observable,
  toJS,//eslint-disable-line
  computed,//eslint-disable-line
  action,//eslint-disable-line
  extendObservable//eslint-disable-line
} from 'mobx'

import { topicSchema, replySchema } from '../util/variable-define'
import { get, post } from '../util/http'

const createTopic = (topic) => { //eslint-disable-line
  return Object.assign({}, topicSchema, topic)
}

const createReply = (reply) => {//eslint-disable-line
  return Object.assign({}, replySchema, reply)
}

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }
  @observable syncing = false
  @observable createdReplies = []
  @action doReply(content) {
    return new Promise((resolve, reject) => {
      this.syncing = true
      this.topics = []
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content }).then((resp) => {
        if (resp.success) {
          this.createdReplies.push(createReply({
            id: resp.data.reply_id,
            content,
            create_at: Date.now(),
          }))
          resolve()
        } else {
          reject()
        }
        this.syncing = false
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

class TopicStore {//eslint-disable-line
  @observable topics
  @observable details
  @observable syncing
  @observable tab

  constructor({ syncing = false, topics = [], details = [], tab = null } = {}) {//eslint-disable-line
    this.syncing = syncing
    this.topics = topics.map((topic) => new Topic(createTopic(topic))) //eslint-disable-line
    this.details = details
    this.tab = tab
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail //eslint-disable-line
      return result
    }, {})
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve()
      }
      this.tab = tab
      this.syncing = true
      this.topics = []
      get('/topics', {
        mdrender: false,
        tab,
      }).then((resp) => {
        if (resp.success) {
          this.topics = resp.data.map((topic) => {//eslint-disable-line
            return new Topic(createTopic(topic))
          })
          resolve()
        } else {
          reject()
        }
        this.syncing = false
      }).catch((err) => {
        reject(err)
        this.syncing = false
      })
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
      } else {
        get(`/topic/${id}`, {
          mdrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data))
            this.details.push(topic)
            resolve(topic)
          } else {
            reject()
          }
        }).catch(reject)
      }
    })
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: this.tab,
    }
  }
}

export default TopicStore
