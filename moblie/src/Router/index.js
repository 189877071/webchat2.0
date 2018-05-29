import { createSwitchNavigator } from 'react-navigation'

import Loading from '../containers/Loading'

export default createSwitchNavigator(
    {
        loading: Loading
    }, 
    {
        initialRouteName: 'loading'
    }
)