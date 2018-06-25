import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image } from 'react-native'

import { ratio, windowW } from '../public/fn'

import Icons from '../Icons'

import { FeedBackBtn } from './Button'

export class UserPhoto extends PureComponent {
    render() {
        return (
            <Image
                source={{ uri: this.props.uri }}
                resizeMode='cover'
                style={styles.userphoto}
            />
        )
    }
}

export class UserName extends PureComponent {

    render() {
        return (
            <Text style={styles.username}>{this.props.name}</Text>
        )
    }
}

export class AnswerOptation extends PureComponent {
    render() {
        const { reject, answer } = this.props;
        return (
            <View style={styles.optation}>
                <View style={styles.optationItem}>
                    <View style={[styles.answerBtn, { backgroundColor: '#f00' }]}>
                        <Icons name='icon-guaduan' size={ratio(100)} color='#fff' />
                        <FeedBackBtn onPress={reject} />
                    </View>
                    <Text style={styles.btnText}>拒绝</Text>
                </View>
                <View style={styles.optationItem}>
                    <View style={[styles.answerBtn, { backgroundColor: '#3bb699' }]}>
                        <Icons name='icon-dianhua' size={ratio(100)} color='#fff' />
                        <FeedBackBtn onPress={answer} />
                    </View>
                    <Text style={styles.btnText}>接听</Text>
                </View>
            </View>
        )
    }
}

export class CallBtn extends PureComponent {
    render() {
        return (
            <View style={[styles.answerBtn, styles.hangUp]}>
                <Icons name='icon-guaduan' size={ratio(100)} color='#fff' />
                <FeedBackBtn onPress={() => this.props.close()} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    userphoto: {
        width: ratio(300),
        height: ratio(300),
        borderRadius: ratio(300)
    },
    username: {
        lineHeight: ratio(120),
        fontSize: ratio(50),
        color: '#fff'
    },
    optation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optationItem: {
        flex: 1,
        alignItems: 'center'
    },
    answerBtn: {
        width: ratio(150),
        height: ratio(150),
        borderRadius: ratio(150),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    btnText: {
        lineHeight: ratio(100),
        fontSize: ratio(50),
        color: '#fff'
    },
    hangUp: {
        position: 'absolute',
        left: ratio(50),
        bottom: ratio(50),
        backgroundColor: '#f00'
    }
});