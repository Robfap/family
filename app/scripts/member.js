import React from 'react';

const IMG_SIZE = 100;
const LINE_HEIGHT = 20;
const Member = React.createClass({

    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        id: React.PropTypes.string.isRequired,
        isSelected: React.PropTypes.bool,
        onCoordinatesChanged: React.PropTypes.func.isRequired,
        onSelect : React.PropTypes.func.isRequired,
        photo : React.PropTypes.string,
        name : React.PropTypes.string,
        years : React.PropTypes.string,
    },

    isMoving: false,
    clientX: undefined,
    clientY: undefined,
    isFirstTime: true,

    onMouseDown(e) {
        e.stopPropagation();
        this.props.onSelect(this.props.id);
        this.isMoving = true;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
    },

    onMouseMove(e){
        e.stopPropagation();
        if (this.isMoving) {
            const deltaX = e.clientX - this.clientX;
            const deltaY = e.clientY - this.clientY;
            this.clientX = e.clientX;
            this.clientY = e.clientY;

            this.props.onCoordinatesChanged(this.props.x + deltaX, this.props.y + deltaY, this.props.id);
        }
    },

    onMouseUp(e) {
        e.stopPropagation();
        this.isMoving = false;
    },

    onMouseOut() {
        this.isMoving = false;
    },

    render() {
        return (
            <g

            >

                <rect x={this.props.x}
                        y={this.props.y}
                        width={IMG_SIZE}
                        height={IMG_SIZE}
                        className={this.props.isSelected ? "" : "nonSelectedMember"}
                        style={{fill: "none", stroke: "#ac0d0d", strokeWidth:3}}
                />

                <image
                    href={this.props.photo}
                    x={this.props.x}
                    y={this.props.y}
                    width={IMG_SIZE}
                    height={IMG_SIZE}
                    cursor="move"

                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    onMouseOut={this.onMouseOut}
                />

                <text className="svgText" textAnchor="middle" x={parseInt(this.props.x, 10) + IMG_SIZE/2} y={parseInt(this.props.y, 10) + IMG_SIZE + LINE_HEIGHT}>{this.props.name}</text>
                <text className="svgText" textAnchor="middle" x={parseInt(this.props.x, 10) + IMG_SIZE/2} y={parseInt(this.props.y, 10) + IMG_SIZE + LINE_HEIGHT*2}>{this.props.years}</text>
            </g>
        );
    }
});

export default Member;