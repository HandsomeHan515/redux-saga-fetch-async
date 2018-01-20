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