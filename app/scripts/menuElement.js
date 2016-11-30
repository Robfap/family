import React from 'react';
import {connect} from 'react-redux';
import * as actions from './actions';
import { Link } from 'react-router';

const Menu = React.createClass({

    propTypes : {
        selectedId : React.PropTypes.string,
        fillMenuFields : React.PropTypes.func.isRequired,
        clearFields : React.PropTypes.func.isRequired,
        isUpdate : React.PropTypes.bool.isRequired,
        updateSelectedMember : React.PropTypes.func.isRequired,
        menuFields : React.PropTypes.object,
        addMember : React.PropTypes.func.isRequired,
        deleteAndClearFields : React.PropTypes.func.isRequired,
        fieldChange : React.PropTypes.func.isRequired,
        relatives : React.PropTypes.arrayOf(React.PropTypes.element),
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.selectedId !== this.props.selectedId) {
          if (nextProps.selectedId) {
              this.props.fillMenuFields(nextProps.selected);
          } else {
              this.props.clearFields();
          }
      }
    },

    onSubmit() {
        if (this.props.isUpdate) {
            this.props.updateSelectedMember(this.props.menuFields);
        } else {
            this.props.addMember(this.props.menuFields);
            this.props.clearFields();
        }
    },

    onDelete() {
        this.props.deleteAndClearFields(this.props.selectedId);
    },

    onFieldChange(field, event) {
        this.props.fieldChange(field, event.target.value);
    },

    render: function () {
        return (
            <div className="menu">
                <div className="input-item">
                    <div className="input-item__name">Name:</div>
                    <input onChange={this.onFieldChange.bind(this, "name")} value={this.props.menuFields.name} className="input-item__input" />
                </div>
                <div className="input-item">
                    <div className="input-item__name">Years:</div>
                    <input onChange={this.onFieldChange.bind(this, "years")} value={this.props.menuFields.years} className="input-item__input" />
                </div>
                <div className="input-item">
                    <div className="input-item__name">Link to photo:</div>
                    <input onChange={this.onFieldChange.bind(this, "photo")} value={this.props.menuFields.photo} className="input-item__input" />
                </div>
                <div className="input-item">
                    <div className="input-item__name">Father:</div>
                    <select value={this.props.menuFields.fatherId} onChange={this.onFieldChange.bind(this, "fatherId")} id="fatherSelect">
                        <option key="1" value="">Select Father</option>
                        {this.props.relatives.map((member) => {
                            return <option key={member.id} value={member.id}>{member.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-item">
                    <div className="input-item__name">Wife:</div>
                    <select value={this.props.menuFields.wifeId} onChange={this.onFieldChange.bind(this, "wifeId")} id="wifeSelect">
                        <option key="1" value="">Select Wife</option>
                        {this.props.relatives.map((member) => {
                            return <option key={member.id} value={member.id}>{member.name}</option>
                        })}
                    </select>
                </div>
                <div className="input-item">
                    <button type="submit" onClick={this.onSubmit}>{this.props.isUpdate ? "Update" : "Create"}</button>
                    <button type="submit" className={!this.props.isUpdate ? "hidden" : ""} onClick={this.onDelete}>Delete</button>
                    <Link to="/show">Observer mode</Link>
                </div>
            </div>
        );
    }
});

function getRelatives(members, selectedId) {
    if (selectedId) {
        const index = members.findIndex((el) => {return el.id === selectedId});
        return [...members.slice(0, index), ...members.slice(index+1)];
    }

    return members;
}

function getSelected(selectedId, members) {
    return members.find((member) => {return member.id === selectedId});
}

function mapStateToProps(store) {
    return {
        selectedId: store.members.selectedId,
        selected: getSelected(store.members.selectedId, store.members.members),
        menuFields: store.menuFields,
        relatives: getRelatives(store.members.members, store.members.selectedId),
        isUpdate: !!store.members.selectedId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fillMenuFields : (selected) => {
            dispatch(actions.fillMenuFields(selected));
        },

        clearFields : () => {
            dispatch(actions.clearFields())
        },

        updateSelectedMember : (menuFields) => {
            dispatch(actions.updateSelectedMember(menuFields));
        },

        addMember : (menuFields) => {
            dispatch(actions.addMember(menuFields));
        },

        deleteAndClearFields : (id) => {
            dispatch(actions.deleteAndClearFields(id));
        },

        fieldChange : (field, value) => {
            dispatch(actions.alterMenuField(field, value));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);