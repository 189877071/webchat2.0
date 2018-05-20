import React, { PureComponent } from 'react'

import { Image, View, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');

export default class LgBg extends PureComponent {
    render() {
        return (
            <Image 
                source={require('../public/image/bg1.jpg')}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width, 
                    height,
                    zIndex: -1
                }}
            />
        )
    }
}