import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text } from 'react-native'

import { pleft, pright } from '../public/config'

import { ratio } from '../public/fn'

import Icons from '../Icons'

import { FeedBackBtn } from './Button'

const styles = StyleSheet.create({
    tabbox: {
        flexDirection: 'row',
        height: ratio(120),
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: ratio(120),
    }
})

export class ScrollBox extends PureComponent {
    render() {
        return (
            <View style={{ flex: 1 }}></View>
        )
    }
}

export class ChatTab extends PureComponent {
    render() {
        return (
            <View style={styles.tabbox}>
                <View style={styles.tabItem}>
                    <Icons name='icon-yuyin' size={ratio(70)} color='#617286' />
                    <FeedBackBtn />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-biaoqing' size={ratio(70)} color='#617286' />
                    <FeedBackBtn />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-llrandomshake' size={ratio(70)} color='#617286' />
                    <FeedBackBtn />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-tupian' size={ratio(70)} color='#617286' />
                    <FeedBackBtn />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-shexiangtou' size={ratio(70)} color='#617286' />
                    <FeedBackBtn />
                </View>
            </View>
        )
    }
}

