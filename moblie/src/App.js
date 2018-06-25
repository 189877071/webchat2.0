import React, { Component } from 'react'

import Router from './Router'

import {  } from 'react-native'

import { Provider } from 'react-redux'

import store from './store'

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        )
    }
    componentDidMount() {
        
    }
}