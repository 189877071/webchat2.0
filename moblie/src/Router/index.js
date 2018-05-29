import { createSwitchNavigator } from 'react-navigation'

import Loading from '../containers/Loading'

import Login from '../containers/Login'

import Index from '../containers/Index'

export default createSwitchNavigator(
    {
        loading: Loading,
        login: Loading,
        index: Index
    }, 
    {
        initialRouteName: 'loading'
    }
)