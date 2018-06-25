import React, { PureComponent, Component } from 'react'

import { BoxShadow } from 'react-native-shadow'

import ImageZoom from 'react-native-image-pan-zoom'

import { View, StyleSheet, Text, Image, Modal } from 'react-native'

import { FeedBackBtn } from './Button'

import { ratio, getTextDate, sliceStr, windowH, windowW } from '../public/fn'

const [w976, w490, w30, w130, w42, w28, color, w58, w35, w75, w106, w49, w10, unreadjpg, w24] = [
    ratio(976),
    ratio(490),
    ratio(30),
    ratio(130),
    ratio(42),
    ratio(28),
    '#5f7489',
    ratio(58),
    ratio(35),
    ratio(75),
    ratio(106),
    ratio(49),
    ratio(10),
    require('../public/image/unread.jpg'),
    ratio(24),
]

const styles = StyleSheet.create({
    outbox: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: w30,
        paddingBottom: w30,
        position: 'relative'
    },
    box: {
        width: w976,
        height: w490,
        backgroundColor: 'rgba(255,255,255, .6)',
        position: 'relative'
    },
    titleBox: {
        height: w130,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: w30,
        paddingRight: w30,
        borderBottomWidth: 1,
        borderColor: '#d2d1cf'
    },
    title: {
        fontSize: ratio(50),
        color: '#000'
    },
    time: {
        fontSize: w35,
        color
    },
    synopsis: {
        paddingTop: w28,
        paddingLeft: w28,
        paddingRight: w28
    },
    synopsistext: {
        lineHeight: w75,
        fontSize: ratio(50),
        color
    },
    unread: {
        position: 'absolute',
        width: w106,
        height: w49,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: w58,
        right: w35
    },
    unreadImg: {
        width: w106,
        height: w49,
        position: 'absolute',
        left: 0,
        top: 0
    },
    unreadtext: {
        fontSize: w24,
        color: '#fff'
    },
    deleted: {
        width: w976,
        height: w490,
        backgroundColor: 'rgba(255,255,255, .8)',
        left: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const setting = {
    width: w976,
    height: w490,
    border: w30,
    opacity: .1,
    color: '#000',
    x: 0,
    y: 0,
}


class Unread extends PureComponent {
    render() {
        return (
            <View style={styles.unread}>
                <Image
                    source={unreadjpg}
                    style={styles.unreadImg}
                />
                <Text style={styles.unreadtext}>未读</Text>
            </View>
        )
    }
}

export class NoticeItem extends PureComponent {
    render() {
        let { title, otime, description, id, read, href } = this.props;

        return (
            <View style={styles.outbox}>
                <BoxShadow setting={setting}>
                    <View style={styles.box}>
                        <View style={styles.titleBox}>
                            <Text style={styles.title}>{sliceStr(title, 15)}</Text>
                            <Text style={styles.time}>{getTextDate(otime)}</Text>
                        </View>
                        <View style={styles.synopsis}>
                            <Text style={styles.synopsistext}>
                                {sliceStr(description, 68)}
                            </Text>
                        </View>
                        <FeedBackBtn onPress={() => href({ id })} />
                    </View>
                </BoxShadow>
                {read || <Unread />}
            </View>
        )
    }
}

export class ShowImageZoom extends PureComponent {
    render() {
        const [width, height] = [
            this.props.width || windowW,
            this.props.height || ratio(500)
        ];
       
        return (
            <Modal
                animationType='fade'
                onRequestClose={() => { }}
                transparent={false}
                visible={!!this.props.uri}
            >
                <ImageZoom
                    cropWidth={windowW}
                    cropHeight={windowH}
                    imageWidth={width}
                    imageHeight={height}
                    style={{ backgroundColor: '#000' }}
                    onClick={this.props.close}
                >
                    <Image
                        source={{ uri: this.props.uri }}
                        resizeMode='cover'
                        style={{ width, height }}
                    />
                </ImageZoom>
            </Modal>
        )
    }
}