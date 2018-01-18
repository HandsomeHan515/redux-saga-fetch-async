# redux-saga-async
Use redux, redux-saga, normalizr, lodash and fetch api to apply service data with restful api.

## Usage
1. 将service和templates文件置于项目src目录下
2. 下载example文件至本电脑，执行npm install -> npm start查看效果 

### 安装依赖包

```
"lodash": "^4.17.4",
"react-redux": "^5.0.6",
"redux": "^3.7.2",
"redux-saga": "^0.16.0",
"normalizr": "^3.2.4",
```

### redux-saga-async配置
1. add api address in /service/addresss.js

```
const serviceDomain = 'https://api.github.com';

export const address = {
  users: `${serviceDomain}/users`,
}
```
2. add schema in /templates/store.js

使用normalizr,github地址 [https://github.com/paularmstrong/normalizr](https://github.com/paularmstrong/normalizr)

```
import { schema } from 'normalizr';

export const userSchema = new schema.Entity('users');

export const stateSchema = {
  users: [userSchema],
}
```

3. add config in config.js
+ id 可以看做是redux中的action
+ addr 访问的api地址
+ schmea 对获取的数据进行序列化
+ schemaID 和id一致即可
+ hasCert 是否需要验证，默认true

```
{ id: 'users', addr: address.users, schema: { results: [state.flowerSchema] }, schemaID: 'users', hasCert: false },
```

### React组件的使用

1. GET方法

```
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { handsome, combineData } from './templates';

class User extends Component {
  componentWillMount() {
    this.props.getUser()
  }

  render() {
    const { usersResults, usersEntities, usersStatus } = this.props
    const users = combineData(usersResults, usersEntities);

    console.log('users: %o', users)

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

### index.js配置
+ 安装Google浏览器插件[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)

```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { appSaga, appState, appReducer } from './templates';

import User from './User';

let sagaMiddleware = createSagaMiddleware()
let enhancer = {}

if (process.env.NODE_ENV === 'production') {
  enhancer = compose(
    applyMiddleware(sagaMiddleware),
  )
} else {
  enhancer = compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
}

export const store = createStore(
  appReducer,
  appState,
  enhancer,
)

sagaMiddleware.run(appSaga)

ReactDOM.render(
  <Provider store={store}>
    <User />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();

```
