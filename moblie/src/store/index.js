import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

import common from './common'

const reducers = combineReducers({
    c: common
});

const newCreateStore = applyMiddleware(thunk)(createStore);

export default newCreateStore(reducers);