import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image } from 'react-native'

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
    },
    messagebox: {
        flexDirection: 'row',
        paddingRight: pright,
        paddingLeft: pleft,
        position: 'relative',
        paddingTop: ratio(50),
        paddingBottom: ratio(50),
    },
    textbox: {
        paddingLeft: ratio(20),
        paddingRight: ratio(20),
        paddingTop: ratio(20),
        paddingBottom: ratio(20),
        borderRadius: ratio(20),
        borderWidth: 1,
        borderColor: '#94a3a8'
    },
    rtext: {
        backgroundColor: 'rgba(227, 220, 222, .8)',
        marginRight: ratio(5),
    },
    ltext: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
        marginLeft: ratio(5)
    },
    text: {
        fontSize: ratio(40),
        lineHeight: ratio(70),
        color: '#111'
    },
    img: {
        height: ratio(135),
        width: ratio(135),
        borderRadius: ratio(135),
        borderColor: '#94a3a8',
        borderWidth: 1
    },
    content: {
        paddingTop: ratio(10),
        maxWidth: ratio(760)
    },
    timebox: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        alignItems: 'center',
    },
    timetext: {
        backgroundColor: '#fff',
        paddingLeft: ratio(10),
        paddingRight: ratio(10),
        fontSize: ratio(24),
        color: '#333',
        lineHeight: ratio(40)
    }
})

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

export class MiTextMessage extends PureComponent {
    render() {
        return (
            <View style={[styles.messagebox, { justifyContent: 'flex-end', }]}>
                <View style={styles.content}>
                    <View style={[styles.textbox, styles.rtext]}>
                        <Text style={styles.text}>啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦……</Text>
                    </View>
                </View>
                <Image
                    source={require('../public/image/user-photo.jpg')}
                    style={styles.img}
                />
                <View style={styles.timebox}>
                    <Text style={styles.timetext}>06-03 23:11</Text>
                </View>
            </View>
        )
    }
}

export class HeTextMessage extends PureComponent {
    render() {
        return (
            <View style={styles.messagebox}>
                <Image
                    source={require('../public/image/user-photo.jpg')}
                    style={styles.img}
                />
                <View style={styles.content}>
                    <View style={[styles.textbox, styles.ltext]}>
                        <Text style={styles.text}>啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦……</Text>
                    </View>
                </View>
                <View style={styles.timebox}>
                    <Text style={styles.timetext}>06-03 23:11</Text>
                </View>
            </View>
        )
    }
}