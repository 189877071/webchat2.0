import { createSwitchNavigator } from 'react-navigation'

import Loading from '../containers/Loading'

import Login from '../containers/Login'

import Index from '../containers/Index'

import Chat from '../containers/Chat'

// import Demo from '../containers/Demo'

import SettingChildren from '../containers/SettingChildren'

export default createSwitchNavigator(
    {
        loading: Loading,
        login: Login,
        index: Index,
        chat: Chat,
        settingChildren: SettingChildren
    }, 
    {
        initialRouteName: 'chat'
    }
)