const axios = require('axios')
const queryString = require('query-string')

const baseUrl = 'http://cnodejs.org/api/v1'

module.exports = (req, res, next) => {
  const path = req.path

  const user = req.session.user || {}

  const needAccessToken = req.query.needAccessToken

  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: needAccessToken && req.method === 'GET' ? user.accessToken : ''
  })

  if (query.needAccessToken) delete query.needAccessToken

  const option = {
    method: req.method,
    params: query,
    data: queryString.stringify(Object.assign({}, req.body, { accesstoken: needAccessToken && req.method === 'POST' ? user.accessToken : '' })),
    headers: {
      'ContentType': 'application/x-www-form-urlencoded'
    }
  }

  const pathUrl = `${baseUrl}${path}`
  axios(pathUrl, option)
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data)
      } else {
        res.status(res.status).send(resp.data)
      }
    }).catch(err => {
      if (err.response) {
        res.status(500).send(err.response)
      } else {
        res.status(500).send({
          success: false,
          msg: '未知错误'
        })
      }
    })
}
