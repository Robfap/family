import * as actionTypes from '../actionTypes';
import _ from "lodash";

function copyStore (store) {
    return _.cloneDeep(store);
}

let initialState = {
    name: "",
    years: "",
    photo: "",
    fatherId: "",
    wifeId: ""
};

let MenuElementReducer = {};

MenuElementReducer[actionTypes.ALTER_MENU_FIELD] = function (store, action) {
    let newStore = copyStore(store);
    newStore[action.name] = action.value;

    return newStore;
};

MenuElementReducer[actionTypes.FILL_MENU_FIELDS] = (store, action) => {
    const { selectedMember } = action;
    const newStore = {
        name: selectedMember.name,
        years: selectedMember.years,
        photo: selectedMember.photo,
        fatherId: selectedMember.fatherId,
        wifeId: selectedMember.wifeId
    };

    return newStore;
};

MenuElementReducer[actionTypes.CLEAR_MENU_FIELDS] = () => {
    return initialState;
};

export default function(store = initialState, action) {
    const reducerFunction = MenuElementReducer[action.type];
    if (reducerFunction) {
        return reducerFunction.call(MenuElementReducer, store, action);
    }

    return store;
}
