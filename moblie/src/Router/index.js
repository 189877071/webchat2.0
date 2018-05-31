import { createSwitchNavigator } from 'react-navigation'

import Loading from '../containers/Loading'

import Login from '../containers/Login'

import Index from '../containers/Index'

// import Demo from '../containers/Demo'

export default createSwitchNavigator(
    {
        loading: Loading,
        login: Login,
        index: Index
    }, 
    {
        initialRouteName: 'loading'
    }
)