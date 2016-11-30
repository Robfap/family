import * as actionTypes from './actionTypes';
import { CALL_API } from 'redux-api-middleware';

export function alterMenuField (name, value) {
    return {
        type: actionTypes.ALTER_MENU_FIELD,
        name,
        value
    }
}

export function addMember (menuFields) {
    return {
        type: actionTypes.ADD_MEMBER,
        menuFields
    }
}

export function updateSelectedMember (menuFields) {
    return {
        type: actionTypes.UPDATE_SELECTED_MEMBER,
        menuFields
    }
}

export function selectMember (memberId, isOff) {
    return {
        type: actionTypes.SELECT_MEMBER,
        memberId,
        isOff
    }
}

export function deselectMember () {
    return {
        type: actionTypes.DESELECT_MEMBER
    }
}

export function fillMenuFields (selectedMember) {
    return {
        type: actionTypes.FILL_MENU_FIELDS,
        selectedMember
    }
}

export function deleteMember (memberId) {
    return {
        type: actionTypes.DELETE_MEMBER,
        memberId
    }
}

export function clearFields () {
    return {
        type: actionTypes.CLEAR_MENU_FIELDS
    }
}

export function deleteAndClearFields (memberId) {
    return function(dispatch) {
        dispatch(deleteMember(memberId));
        dispatch(clearFields());
    }
}

export function updateCoordinates (memberId, x, y) {
    return {
        type: actionTypes.UPDATE_MEMBER_COORDINATES,
        memberId,
        x,
        y
    }
}

export function loadMembers () {
    let action = {};
    action[CALL_API] = {
        method: 'GET',
        endpoint: `https://jsonblob.com/api/jsonBlob/580f3a91e4b0a828bd1a9e59`,
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            actionTypes.LOAD_MEMBERS_REQUEST,
            actionTypes.LOAD_MEMBERS_SUCCESS,
            actionTypes.LOAD_MEMBERS_FAILURE
        ]
    };

    return action;
}

export function saveMembers (members) {
    let action = {};
    action[CALL_API] = {
        method: 'PUT',
        endpoint: `https://jsonblob.com/api/jsonBlob/580f3a91e4b0a828bd1a9e59`,
        headers: {
            'Content-Type': 'application/json'
        },
        types: [
            actionTypes.SAVE_MEMBERS_REQUEST,
            actionTypes.SAVE_MEMBERS_SUCCESS,
            actionTypes.SAVE_MEMBERS_FAILURE
        ],
        body: JSON.stringify(members)
    };

    return action;
}