# redux-saga-fetch-async
Use redux, redux-saga, normalizr, lodash and fetch api to apply service data with restful api.

## Usage

```
npm install redux-saga-fetch-async --save

or yarn add redux-saga-fetch-async

```

### redux-saga-fetch-async配置
有如下几个函数：
```
Provider, bindActionCreators, connect, handsome, ReduxInit， combineData
```
+ Provider, bindActionCreators, connect是redux及react-redux中原生的组件及函数, 可自行选择安装redux和react-redux
+ ReduxInit是初始化时需调用的函数，函数接收参数configList，返回Provider中的store
+ combineData将序列化之后的函数合成数组
+ handsome中存放action, action创建函数，saga

#### index.js配置
+ 安装Google浏览器插件[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)

```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider, reduxInit } from './redux-saga-async';

import User from './User';
import Ad from './Ad';

const address = {
  users: 'https://api.github.com/users',
  ads: 'http://api.handsomehan.cn:10001/v1/ads/',
}

const token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTE2NDEzMzIzLCJ1c2VyX2lkIjoxLCJlbWFpbCI6bnVsbH0.2lB5WfjSGLn4g2kFLZq54BADsQ2y10ilt-0JtF6Ch40'

const configList = [
  { id: 'users', addr: address.users, cert: undefined },
  { id: 'ads', addr: address.ads, cert: token }
]

const { store } = reduxInit(configList)

ReactDOM.render(
  <Provider store={store}>
    <Ad />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();

```

#### React组件的使用
+ rest api 中的GET、DELETE、POST、PATCH中的四种操作
+ 详情查看example中的例子

```
import React, { Component } from 'react';
import { handsome, combineData, bindActionCreators, connect } from './redux-saga-async';

import { image } from './redux-saga-async/service';

class Ad extends Component {
  componentWillMount() {
    this.props.getAd()
  }

  update = item => {
    let payload = {
      id: item.id,
      title: '漂亮的广告啊'
    }
    this.props.updateAd(payload)
  }

  delete = item => {
    this.props.deleteAd(item)
  }

  create = () => {
    let payload = {
      'title': '广告',
      'description': '内容',
      'image': image
    }

    this.props.createAd(payload)
  }

  render() {
    const { adsResults, adsEntities, adsStatus } = this.props
    const ads = combineData(adsResults, adsEntities);

    return (
      <div style={{ textAlign: 'center' }}>
        {
          adsStatus.isFetching ?
            null
            :
            <div>
              {
                ads.length ? ads.map((item, index) => {
                  return (
                    <div key={item.id} style={{ display: 'inline-block' }}>
                      <img
                        key={item.id}
                        style={{ height: 200, width: 300, display: 'inline-block', margin: 10 }}
                        src={item.image}
                        alt={item.title}
                        onClick={() => this.update(item)}
                      />
                      <div>
                        <button style={{ textAlign: 'center' }} onClick={() => this.delete(item)}>删除</button>
                        <button style={{ textAlign: 'center' }} onClick={this.create}>添加</button>
                      </div>
                    </div>
                  )
                })
                  :
                  <div>
                    <button style={{ textAlign: 'center' }} onClick={this.create}>添加</button>
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    adsResults: state.results.ads,
    adsEntities: state.entities.ads,
    adsStatus: state.status.ads,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getAd: handsome.ads.methods.get,
    updateAd: handsome.ads.methods.update,
    deleteAd: handsome.ads.methods.del,
    createAd: handsome.ads.methods.create,
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ad)
```