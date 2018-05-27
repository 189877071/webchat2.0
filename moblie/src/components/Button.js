import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Button, TouchableNativeFeedback } from 'react-native'

import { btnColor, pleft, pright } from '../public/config'

import { ratio } from '../public/fn'

const styles = StyleSheet.create({
    btnbox: {
        marginLeft: pleft,
        marginRight: pright,
        marginTop: ratio(60),
    },
    feedback: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    autobox: {
        width: ratio(153),
        height: ratio(75),
        borderRadius: ratio(5),
        backgroundColor: btnColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    smailtext: {
        color: '#fff',
        fontSize: ratio(32),
    }
});

export class BigButton extends PureComponent {
    render() {
        return (
            <View style={styles.btnbox}>
                <Button
                    title={this.props.title}
                    color={btnColor}
                    onPress={() => { }}
                />
            </View>
        )
    }
}

export class FeedBackBtn extends PureComponent {
    render() {
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
            >
                <View style={styles.feedback} />
            </TouchableNativeFeedback>
        )
    }
}

export class SmallButton extends PureComponent {
    render() {
        const { width, height } = this.props;

        let ostyle = {};

        if (width) {
            ostyle.width = width;
        }
        if (height) {
            ostyle.height = height;
        }
        return (
            <View style={[styles.autobox, ostyle]}>
                <Text style={styles.smailtext}>{this.props.title}</Text>
                <FeedBackBtn />
            </View>
        )
    }
}