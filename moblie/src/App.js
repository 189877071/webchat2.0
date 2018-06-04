import React, { Component } from 'react'

import navigation from 'react-navigation'

import SplashScreen from 'rn-splash-screen'

import './public/socketMessage'

import Router from './Router'

import { Provider } from 'react-redux'

import store from './store'

import { setKeyboard } from './store/common/action'

// Keyboard.addListener('keyboardDidShow', () => {
//     store.dispatch(setKeyboard(true));
// });

// Keyboard.addListener('keyboardDidHide', () => {
//     store.dispatch(setKeyboard(false));
// });

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










