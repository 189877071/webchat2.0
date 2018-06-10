import { AppRegistry, YellowBox } from 'react-native';

import App from './src/App';

import './src/public/socketMessage'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('moblie', () => App);
