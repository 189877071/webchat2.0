import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, Animated } from 'react-native'

import { ratio } from '../public/fn'

const [off, on, w110, w50, w38, w142] = [
    require('../public/image/radio-off.png'),
    require('../public/image/radio-on.png'),
    ratio(110),
    ratio(50),
    ratio(38),
    ratio(142),
]

const styles = StyleSheet.create({
    box: {
        width: w142,
        height: w110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: ratio(32)
    },
    fankui: {
        width: w110,
        height: w110,
        borderRadius: w110,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: -1
    },
    img: {
        width: w50,
        height: w50
    },
    text: {
        fontSize: w38,
        color: '#989795'
    }
})

export default class Redio extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bgcolor: new Animated.Value(0),
            scale: new Animated.Value(0),
        };
    }
    onchange = () => {
        const { value, children, active, onChange } = this.props;

        onChange(value);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.state.scale, {
                    toValue: 1,
                    duration: 200,
                }),
                Animated.timing(this.state.bgcolor, {
                    toValue: 1,
                    duration: 50,
                })
            ]),
            Animated.timing(this.state.bgcolor, {
                toValue: 0,
                duration: 200,
            })
        ]).start(() => {
            this.state.scale.setValue(0);
        });

    }
    render() {
        const { value, children, active, onChange } = this.props;

        let img = off;

        if (value == active) {
            img = on;
        }

        return (
            <TouchableWithoutFeedback onPress={this.onchange}>
                <View style={styles.box}>
                    <Animated.View style={[styles.fankui, {
                        backgroundColor: this.state.bgcolor.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(0,0,0,0)', 'rgba(50,201,170,.07)']
                        }),
                        transform: [{
                            scaleX: this.state.scale
                        }, {
                            scaleY: this.state.scale
                        }]
                    }]} />
                    <Image
                        source={img}
                        style={styles.img}
                    />
                    <Text style={styles.text}>{children}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
