import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

import common from './common'

import users from './users'

import active from './active'

import notice from './notice'

const reducers = combineReducers({
    c: common,
    u: users,
    a: active,
    n: notice
});

const newCreateStore = applyMiddleware(thunk)(createStore);

export default newCreateStore(reducers);