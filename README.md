# redux-saga-fetch-async
Use redux, redux-saga, normalizr, lodash and fetch api to apply service data with restful api.

 ![image](http://api.handsomehan.cn:10001/media/84f19f7f-afd.jpg)

## Usage

```
npm install redux-saga-fetch-async --save

or yarn add redux-saga-fetch-async

```

### redux-saga-fetch-async配置

1. 有如下几个函数：
```
Provider, bindActionCreators, connect, handsome, ReduxInit， combineData
```
+ Provider, bindActionCreators, connect是redux及react-redux中原生的组件及函数, 可自行选择安装redux和react-redux
+ ReduxInit是初始化时需调用的函数，函数接收参数configList，返回Provider中的store
+ combineData将序列化之后的函数合成数组
+ handsome中存放action, action创建函数，saga

2. 采用fetch api请求数据

+ config 中的headers视情况添加（默认配置如下）

```
let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}
```

#### index.js配置
+ 安装Google浏览器插件[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)

```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider, reduxInit } from './redux-saga-async';

// import User from './User';
import Ad from './Ad';

const address = {
  users: 'https://api.github.com/users',
  ads: 'http://api.handsomehan.cn:10001/v1/ads/',
}

const token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTE2NDEzMzIzLCJ1c2VyX2lkIjoxLCJlbWFpbCI6bnVsbH0.2lB5WfjSGLn4g2kFLZq54BADsQ2y10ilt-0JtF6Ch40'

let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': token
}

const configList = [
  { id: 'users', addr: address.users },
  { id: 'ads', addr: `${address.ads}?limit=2`, headers: headers }
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
+ rest api 中的GET、DELETE、POST、PATCH中的四种操作及GET请求的分页处理
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

              <button onClick={() => { this.props.nextAd({ url: adsEntities['next'] }) }}>下一页</button>
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
    nextAd: handsome.ads.methods.nextPage
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ad)
```

### 服务端数据格式

1. 类型一

```
[
  {id: 1, name:'12345'},
  {id: 2, name:'12345'},
  {id: 3, name:'12345'},
  {id: 4, name:'12345'},
  {id: 5, name:'12345'},
  {id: 6, name:'12345'},
  {id: 7, name:'12345'},
  {id: 8, name:'12345'},
  {id: 9, name:'12345'},
]
```

2. 类型二
+ count代表数据长度
+ next代表下一个分页的路径
+ previous代表上一个分页的路径

```
{
   count： 3，
   next:null,
   previous: null,
   results: [
     {id: 1, name:'12345'},
     {id: 2, name:'12345'},
     {id: 3, name:'12345'},
   ]
}
```
