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
+ Provider, bindActionCreators, connect是redux中原生的组件
+ ReduxInit是初始化时需调用的函数，函数接收参数configList，返回Provider中的store
+ combineData将序列化之后的函数合成数组
+ handsome生成action创建函数

#### index.js配置
+ 安装Google浏览器插件[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)

```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import User from './User';
import { Provider, reduxInit } from './redux-saga-async';

const address = {
  users: 'https://api.github.com/users',
}

const lists = Object.keys(address)

const configList = lists.map((item, index) => {
  return { id: item, addr: Object.values(address)[index], hasCert: false }
})

const { store } = reduxInit(configList)

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();

```

#### React组件的使用

1. GET方法

```
import React, { Component } from 'react';
import { handsome, combineData, bindActionCreators, connect } from 'redux-saga-fetch-async';

class User extends Component {
  componentWillMount() {
    this.props.getUser()
  }

  render() {
    const { usersResults, usersEntities, usersStatus } = this.props
    const users = combineData(usersResults, usersEntities);

    return (
      <div style={{ textAlign: 'center' }}>
        {
          usersStatus.isFetching ?
            null
            :
            <div>
              {
                users.map((item, index) =>
                  <img
                    key={item.id}
                    style={{ height: 200, width: 300, display: 'inline-block', margin: 10 }}
                    src={item.avatar_url}
                    alt={item.login}
                  />)
              }
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    usersResults: state.results.users,
    usersEntities: state.entities.users,
    usersStatus: state.status.users,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getUser: handsome.users.methods.get,
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
```