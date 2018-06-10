import React, { Component } from 'react'

import SplashScreen from 'rn-splash-screen'

import Router from './Router'

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
        SplashScreen.hide();
    }
}










