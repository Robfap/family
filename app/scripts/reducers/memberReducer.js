import * as actionTypes from '../actionTypes';
import uuid from "uuid-v4";
import _ from "lodash";

function copyStore (store) {
    return _.cloneDeep(store);
}

let memberReducer = {};

memberReducer[actionTypes.ADD_MEMBER] = function (store, action) {
    const newMember = {
        id: uuid(),
        x: 100,
        y: 100
    };

    let newStore = copyStore(store);
    Object.assign(newMember, action.menuFields);

    newStore.members.push(newMember);

    return newStore;
};

memberReducer[actionTypes.UPDATE_SELECTED_MEMBER] = (store, action) => {
    let newStore = copyStore(store);
    let selectedMember = newStore.members.find((member) => {return member.id === newStore.selectedId});
    Object.assign(selectedMember, action.menuFields);

    return newStore;
};

memberReducer[actionTypes.SELECT_MEMBER] = (store, action) => {
    let newStore = copyStore(store);
    const isSelected = action.memberId === newStore.selectedId;

    newStore.selectedId = (isSelected && action.isOff) ? "" : action.memberId;

    return newStore;
};

memberReducer[actionTypes.DESELECT_MEMBER] = (store) => {
    let newStore = copyStore(store);
    newStore.selectedId = "";

    return newStore;
};

memberReducer[actionTypes.DELETE_MEMBER] = (store, action) => {
    let newStore = copyStore(store);
    const delIndex = newStore.members.findIndex((m) => {return m.id === action.memberId});
    if (delIndex >= 0) {
        newStore.members.forEach((m) => {
            if (m.fatherId === action.memberId) {
                m.fatherId = undefined;
            }
            if (m.wifeId === action.memberId) {
                m.wifeId = undefined;
            }
        });
        newStore.members = [...newStore.members.slice(0, delIndex), ...newStore.members.slice(delIndex+1)];
        if (newStore.selectedId === action.memberId) {
            newStore.selectedId = undefined;
        }
    }

    return newStore;
};

memberReducer[actionTypes.UPDATE_MEMBER_COORDINATES] = (store, action) => {
    let newStore = copyStore(store);
    let updatingMember = newStore.members.find((m) => {return m.id === action.memberId});

    if (updatingMember) {
        updatingMember.x = action.x;
        updatingMember.y = action.y;
    }

    return newStore;
};

memberReducer[actionTypes.SAVE_MEMBERS_REQUEST] = (store) => {
    let newStore = copyStore(store);

    newStore.isMembersSaving = true;
    return newStore;
};

memberReducer[actionTypes.SAVE_MEMBERS_SUCCESS] = (store) => {
    let newStore = copyStore(store);

    newStore.isMembersSaving = false;
    return newStore;
};

memberReducer[actionTypes.SAVE_MEMBERS_FAILURE] = (store) => {
    let newStore = copyStore(store);
    // TODO: error handling
    newStore.isMembersSaving = false;
    return newStore;
};

memberReducer[actionTypes.LOAD_MEMBERS_REQUEST] = (store) => {
    let newStore = {
        ...store,
        isMembersLoading : true
    };
    return newStore;
};

memberReducer[actionTypes.LOAD_MEMBERS_SUCCESS] = (store, action) => {
    let newStore = {
        ...store,
        members : action.payload,
        isMembersLoaded : true,
        isMembersLoading : false
    };

    return newStore;
};

memberReducer[actionTypes.LOAD_MEMBERS_FAILURE] = (store) => {
    let newStore = {
        ...store,
        isMembersLoaded : false,
        isMembersLoading : false
    };
    return newStore;
};


let initialState = {
    members: [],
    selectedId: undefined,
    isMembersLoaded: false,
};

export default function(store = initialState, action) {
    const reducerFunction = memberReducer[action.type];
    if (reducerFunction) {
        return reducerFunction.call(memberReducer, store, action);
    }

    return store;
}