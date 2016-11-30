import { combineReducers } from 'redux';
import members from './memberReducer';
import menuElement from './menuElementReducer';


const rootReducer = combineReducers({
    members,
    menuFields: menuElement
});

export default rootReducer;