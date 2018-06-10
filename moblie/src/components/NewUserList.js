import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image, Animated, PanResponder } from 'react-native'

import { borderColor, listBg, pleft, pright, hostname } from '../public/config'

import { ratio, windowW } from '../public/fn'

import { FeedBackBtn } from './Button'

import Icons from '../Icons'

const styles = StyleSheet.create({
    box: {
        height: ratio(174),
        borderColor: borderColor,
        backgroundColor: listBg,
        flexDirection: 'row',
    },
    itembox: {
        position: 'relative',
        justifyContent: 'space-between',
        paddingLeft: pleft,
        paddingRight: pright,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headPortrait: {
        width: ratio(126),
        height: ratio(126),
        borderRadius: ratio(126),
        borderWidth: 1,
        borderColor: borderColor,
    },
    itemMain: {
        flex: 1,
        paddingLeft: ratio(26),
        height: ratio(120),
    },
    mainItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontSize: ratio(40),
        color: '#4b5e6f'
    },
    synopsis: {
        fontSize: ratio(42),
        color: '#787878'
    },
    classbox: {
        position: 'relative',
        alignItems: 'center',
        paddingLeft: ratio(20),
        borderTopWidth: 1,
    },
    jiantou: {
        width: ratio(60),
        height: ratio(60),
        justifyContent: 'center',
        alignItems: 'center'
    },
    className: {
        color: '#4a6f8a',
        fontSize: ratio(40)
    }
})


export class UserItem extends PureComponent {
    render() {
        const { name, username, synopsis, id, isonline, grayheadphoto, headphoto, end, show, href } = this.props;

        const imgurl = hostname + (isonline ? headphoto : grayheadphoto);

        const oname = name || username;

        const osynopsis = synopsis || '该用户未填写个人介绍';

        const ostyle = {};

        if (end) ostyle.borderBottomWidth = 0;

        if (!show) {
            ostyle.display = 'none';
        }

        return (
            <View style={[styles.box, styles.itembox, ostyle]}>
                <Image
                    source={{ uri: imgurl }}
                    resizeMethod='scale'
                    style={styles.headPortrait}
                />
                <View style={styles.itemMain}>
                    <View style={styles.mainItem}>
                        <Text style={styles.name}>{oname}</Text>
                    </View>
                    <View style={styles.mainItem}>
                        <Text style={styles.synopsis}>{osynopsis}</Text>
                    </View>
                </View>
                <FeedBackBtn onPress={() => href({ id })} />
            </View>
        )
    }
}

export class Classify extends PureComponent {
    render() {
        const { name, id, onshow, show } = this.props;
        return (
            <View style={[styles.box, styles.classbox]}>
                <View style={[styles.jiantou, {
                    transform: [{
                        rotate: show ? '90deg' : '0deg'
                    }]
                }]}>
                    <Icons name='icon-202-copy' size={ratio(50)} style={{
                        transform: [{
                            translateY: ratio(3)
                        }]
                    }} color='#bebec0' />
                </View>

                <View>
                    <Text style={styles.className}>{name}</Text>
                </View>
                <FeedBackBtn onPress={() => onshow(id)} />
            </View>
        )
    }
}
