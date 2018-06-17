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
    },
    editor: {
        position: 'relative',
        height: ratio(124),
        width: ratio(175),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ratio(20),
        borderRadius: ratio(10),
    },
    editorbox: {
        justifyContent: 'flex-end'
    }
});

export class BigButton extends PureComponent {
    render() {
        const { title, onPress } = this.props;
        return (
            <View style={styles.btnbox}>
                <Button
                    title={title}
                    color={btnColor}
                    onPress={onPress}
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
                {...this.props}
            >
                <View style={styles.feedback} />
            </TouchableNativeFeedback>
        )
    }
}

export class SmallButton extends PureComponent {
    render() {
        const { width, height, href, fontSize } = this.props;

        let ostyle = {};
        let otext = {};
        if (width) {
            ostyle.width = width;
        }
        if (height) {
            ostyle.height = height;
        }
        if (fontSize) {
            otext.fontSize = fontSize
        }
        return (
            <View style={[styles.autobox, ostyle]}>
                <Text style={[styles.smailtext, otext]}>{this.props.title}</Text>
                <FeedBackBtn onPress={href} />
            </View>
        )
    }
}

export class EditorBtn extends PureComponent {
    render() {
        const backgroundColor = this.props.deep ? '#627385' : '#a7b3bf';
        return (
            <View style={styles.editorbox}>
                <View style={[styles.editor, { backgroundColor }]}>
                    <Text style={{ color: '#fff', fontSize: ratio(40) }}>发送</Text>
                    <FeedBackBtn onPress={this.props.submit} />
                </View>
            </View>
        )
    }
}
