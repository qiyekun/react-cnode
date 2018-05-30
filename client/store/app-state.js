import {
  observable,
  computed,//eslint-disable-line
  action,
  toJS,
} from 'mobx'

import { post, get } from '../util/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      syncing: false,
    },
    collections: {
      syncing: false,
      list: [],
    },
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    this.user.detail.syncing = true
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`).then((resp) => {
        if (resp.success) {
          this.user.detail.recentTopics = resp.data.recent_topics
          this.user.detail.recentReplies = resp.data.recent_replies
          resolve()
        } else {
          reject(resp)
        }
        this.user.detail.syncing = false
      }).catch((error) => {
        this.user.detail.syncing = false
        reject(error)
      })
    })
  }

  @action getUserCollections() {
    this.user.collections.syncing = true
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`).then((resp) => {
        if (resp.success) {
          this.user.collections.list = resp.data
          resolve()
        } else {
          reject(resp)
        }
        this.user.collections.syncing = false
      }).catch((error) => {
        this.user.collections.syncing = false
        reject(error)
      })
    })
  }

  toJson() {
    return {
      user: toJS(this.user),
    }
  }
}
