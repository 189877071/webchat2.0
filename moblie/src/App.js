import React, { Component } from 'react'
import SplashScreen from 'rn-splash-screen'
import { Keyboard } from 'react-native'
import Login from './containers/Login'

import { Provider } from 'react-redux'

import store from './store'

Keyboard.addListener('keyboardDidShow', () => {
    store.dispatch({value: true, type: 'ckeybord'});
});

Keyboard.addListener('keyboardDidHide', () => {
    store.dispatch({value: false, type: 'ckeybord'});
});

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Login />
            </Provider>
        )
    }
    componentDidMount() {
        SplashScreen.hide();
    }
}