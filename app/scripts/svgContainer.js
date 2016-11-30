import React from 'react';
import Member from './member.js';
import * as actions from "./actions";
import {connect} from 'react-redux';
import _ from 'lodash';
import $ from 'jquery';
import classnames from 'classnames';

const Container = React.createClass({

    propTypes: {
        selectMember : React.PropTypes.func.isRequired,
        updateCoordinates : React.PropTypes.func.isRequired,
        deselectMember : React.PropTypes.func.isRequired,
        members : React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
        isShowingMode : React.PropTypes.bool.isRequired,
    },

    fatherConnections : [],
    wifeConnections : [],
    startScrolling : false,
    mousePosition : {
        x : undefined,
        y : undefined
    },
    downPosition : {
        x : undefined,
        y : undefined
    },

    calculateSvgSize(members) {
        let maxY = 0;
        let maxX = 0;
        const svgSelector = $('#mainSvg');

        members.forEach((member) => {
            if (member.y > maxY) {
                maxY = member.y;
            }
            if (member.x > maxX) {
                maxX = member.x;
            }
        });

       svgSelector.css('height', maxY + 300 + 'px');
       svgSelector.css('width', maxX + 300 + 'px');
    },

    getFatherLinks(members) {
        let connections = [];

        members.forEach((member, index) => {
            if (member.fatherId) {
                const father = members.find((m)=> { return m.id === member.fatherId});
                if (father) {
                    connections.push({
                        x1 : member.x + 50,
                        y1 : member.y + 50,
                        x2 : father.x + 50,
                        y2 : father.y + 50,
                        id : index
                    });
                }
            }
        });

        this.fatherConnections = connections;
    },

    getWifeLinks(members) {
        let connections = [];

        members.forEach((member, index) => {
            if (member.wifeId) {
                const wife = members.find((m)=> { return m.id === member.wifeId});
                if (wife) {
                    connections.push({
                        x1 : member.x + 50,
                        y1 : member.y + 50,
                        x2 : wife.x + 50,
                        y2 : wife.y + 50,
                        id : index
                    });
                }
            }
        });

        this.wifeConnections = connections;
    },

    componentWillReceiveProps(nextProps) {
        this.getFatherLinks(nextProps.members);
        this.getWifeLinks(nextProps.members);
        this.calculateSvgSize(nextProps.members);
   },

    onMemberSelect(memberId, isOff) {
        this.props.selectMember(memberId, isOff);
    },

    onCoordinatesChanged(x, y, id) {
        this.props.updateCoordinates(id, x, y);
    },

    onMouseDown(e) {
        this.startScrolling = true;
        this.mousePosition = {
            x : e.clientX,
            y : e.clientY
        };

        this.downPosition = Object.assign({}, this.mousePosition);
    },

    onMouseMove(e) {
        const containerSelector = $('.svg-container');
        if (this.startScrolling) {
            const delta = {
                x : e.clientX - this.mousePosition.x,
                y : e.clientY - this.mousePosition.y
            };

            containerSelector.scrollTop(containerSelector.scrollTop() - delta.y);
            containerSelector.scrollLeft(containerSelector.scrollLeft() - delta.x);

            this.mousePosition = {
                x : e.clientX,
                y : e.clientY
            }
        }
    },

    onMouseUp(e) {
        const delta = {
            x : e.clientX - this.downPosition.x,
            y : e.clientY - this.downPosition.y
        };

        if ( Math.abs(delta.x) + Math.abs(delta.y) < 4) {
            this.props.deselectMember();
        }


        this.startScrolling = false;
    },

    onMouseOut() {
        this.startScrolling = false;
    },

    renderConnections() {
        return (
                this.fatherConnections.map((line) => {
                    return (
                        <line
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            key={line.id}
                            strokeWidth="2"
                            stroke="black"
                        />
                    )
                })
        );
    },

    renderWifeConnections () {
        return (
            this.wifeConnections.map((line) => {
                return (
                    <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        key={line.id}
                        strokeWidth="4"
                        stroke="red"
                    />
                )
            })
        );
    },

    renderMembers() {
        return (
            this.props.members.map((member) => {
                return (
                    <Member
                        key={member.id}
                        x={member.x}
                        y={member.y}
                        id={member.id}
                        name={member.name}
                        years={member.years}
                        photo={member.photo}
                        fatherId={member.fatherId}
                        isSelected={member.isSelected}
                        onCoordinatesChanged={this.onCoordinatesChanged}
                        onSelect={this.onMemberSelect}
                    />
                )
            })
        );
    },

    render: function(){

        const containerClassNames = classnames({
            'svg-container' : true,
            'svg-container--padding' : !this.props.isShowingMode
        });

        return (
            <div className={containerClassNames}>
                <svg
                    id="mainSvg"
                    className="svg"
                    cursor="pointer"
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    onMouseOut={this.onMouseOut}
                >
                    {
                        this.renderConnections()
                    }
                    {
                        this.renderWifeConnections()
                    }
                    {
                        this.renderMembers()
                    }
                </svg>
            </div>
        );
    }
});

function addSelected(members, selectedId) {
    let copyMembers = _.cloneDeep(members);
    let selected = copyMembers.find((m) => {return m.id === selectedId});
    if (selected) {
        selected.isSelected = true;
    }

    return copyMembers;
}

function mapStateToProps (store) {
    return {
        members: addSelected(store.members.members, store.members.selectedId)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deselectMember : () => {
            dispatch(actions.deselectMember());
        },

        updateCoordinates : (id, x, y) => {
            dispatch(actions.updateCoordinates(id, x, y));
        },

        selectMember : (memberId, isOff) => {
            dispatch(actions.selectMember(memberId, isOff));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);