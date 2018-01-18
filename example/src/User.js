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