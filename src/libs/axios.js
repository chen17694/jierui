import axios from 'axios'
import store from '@/store'
import { Spin, Modal } from 'iview'
import { getToken } from '@/libs/util'
const CancelToken = axios.CancelToken
const source = CancelToken.source()
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    let token = getToken() ? getToken() : ''
    const config = {
      baseURL: this.baseUrl,
      headers: {
        authToken: token,
        appType: '0'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length && (config.data && config.data.noLoading !== '1')) {
        Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 58
                }
              })
            ])
          }
        })
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      } else {
        console.log(errorInfo)
        if (errorInfo.status === 401) {
          source.cancel()
          if (errorInfo.data.status === 'TOKENREPEATED') {
            Message.info('您的账号已在其它设备登录')
          }
          setTimeout(function () {
            store.dispatch('handleLogOut').then(() => {
              window.location.reload()
            })
          }, 3000)
          // store.dispatch('handleLogOut').then(() => {
          //   window.location.reload()
          // })
        } else if (errorInfo.status === 405) {
          Spin.hide()
          this.queue = {}
          Modal.confirm({
            title: '无操作权限',
            onOk: () => {
              window.history.go(-1)
            },
            onCancel: () => {
              window.history.go(-1)
            }
          })
        } else if (errorInfo.status === 500) {
          Spin.hide()
          Modal.confirm({
            title: '网络错误'
          })
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
