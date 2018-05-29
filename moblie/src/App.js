import React, { Component } from 'react'
import SplashScreen from 'rn-splash-screen'
import { Keyboard } from 'react-native'

import Router from './Router'

import { Provider } from 'react-redux'

import { statusBarColor } from './public/config'

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

Keyboard.addListener('keyboardDidShow', () => {
    store.dispatch({ value: true, type: 'ckeybord' });
});

Keyboard.addListener('keyboardDidHide', () => {
    store.dispatch({ value: false, type: 'ckeybord' });
});