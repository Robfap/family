import {connect} from 'react-redux';
import React from 'react';
import * as actions from './actions';
import _ from 'lodash';
import Menu from './menuElement';
import Container from './svgContainer';

const App = React.createClass({

    propTypes : {
        members: React.PropTypes.arrayOf( React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.object])).isRequired,
        saveMembers: React.PropTypes.func.isRequired,
        loadMembers: React.PropTypes.func.isRequired,
        route: React.PropTypes.object.isRequired,
        isMembersLoaded: React.PropTypes.bool.isRequired
    },

    componentWillMount: function () {
       this.debouncedSaveMembers = _.debounce( this.saveMembers, 1000);
    },

    componentWillReceiveProps: function(nextProps) {
        if (!_.isEqual(this.props.members, nextProps.members)) {
          this.debouncedSaveMembers(nextProps);
        }
    },

    saveMembers: function(nextProps) {
       this.props.saveMembers(nextProps.members);
    },

    componentDidMount: function() {
        this.props.loadMembers();
    },

    render: function () {
        const isShowingMode = this.props.route.path === "show";

        if (!this.props.isMembersLoaded) {
            return (
                <div>We are loading data!</div>
            )
        }

        return (
            <div>
                { isShowingMode ? <div /> : <Menu /> }
                <Container isShowingMode={isShowingMode} />
            </div>
        )
    }
});

function mapStateToProps (store) {
    return {
        members: store.members.members,
        isMembersLoaded: store.members.isMembersLoaded
    }
}

function mapDispatchToProps (dispatch) {
    return {
        saveMembers : (members) => {
            dispatch(actions.saveMembers(members));
        },

        loadMembers : () => {
            dispatch(actions.loadMembers());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);