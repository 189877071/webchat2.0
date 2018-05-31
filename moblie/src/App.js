import React, { Component } from 'react'

import SplashScreen from 'rn-splash-screen'

import { Keyboard, View, Dimensions } from 'react-native'

import './public/socketMessage'

import Router from './Router'

import { Provider } from 'react-redux'

import store from './store'

import { setKeyboard } from './store/common/action'

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
    store.dispatch(setKeyboard(true));
});

Keyboard.addListener('keyboardDidHide', () => {
    store.dispatch(setKeyboard(false));
});






