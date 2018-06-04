import React, { PureComponent } from 'react'

import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native'

import { headerBackground, pleft, pright } from '../public/config'

import { ratio } from '../public/fn'

import Icons from '../Icons'

import { SmallButton } from './Button'

const style = StyleSheet.create({
    box: {
        height: ratio(147),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainbox: {
        height: ratio(147),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: headerBackground,
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: '#fff',
        fontSize: ratio(52),
    },
    btnleft: {
        justifyContent: 'center',
        paddingLeft: pleft,
        flex: 1,
    },
    btnight: {
        flex: 1,
        paddingRight: pright,
        alignItems: 'flex-end'
    },
    chat: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: ratio(147)
    },
    chatchild: {
        height: ratio(110),
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    chatName: {
        fontSize: ratio(40),
        color: '#fff'
    },
    chatState: {
        fontSize: ratio(30),
        color: '#fff'
    }
});

class HeadLeft extends PureComponent {
    render() {
        const transform = {
            transform: [{
                translateY: ratio(3)
            }]
        };
        const oIcon = this.props.event && (
            <TouchableNativeFeedback onPress={() => { }}>
                <Text style={transform}>
                    <Icons
                        name='icon-fanhui'
                        size={ratio(52)}
                        color={this.props.color}
                    />
                </Text>
            </TouchableNativeFeedback>
        );
        return (
            <View style={style.btnleft}>
                {oIcon}
            </View>
        )
    }
}

export class Header extends PureComponent {
    render() {
        const { title } = this.props;
        return (
            <View style={[style.mainbox]}>
                <Text style={style.titleText}>{title}</Text>
            </View>
        )
    }
}

export class InlineHeader extends PureComponent {
    render() {
        return (
            <View style={style.box}>
                <HeadLeft event={() => { }} color={headerBackground} />
                <View style={style.title}>
                    <Text style={[style.titleText, { color: headerBackground }]}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={style.btnight}>
                    <SmallButton title='保存' />
                </View>
            </View>
        )
    }
}

export class ChatHeader extends PureComponent {
    render() {
        const transform = {
            transform: [{
                translateY: ratio(3)
            }]
        }
        return (
            <View style={[style.box, { backgroundColor: headerBackground }]}>
                <HeadLeft event={() => { }} color='#fff' />
                <View style={style.chat}>
                    <View style={style.chatchild}>
                        <Text style={style.chatName}>范疆养眼</Text>
                        <Text style={style.chatState}>离线</Text>
                    </View>
                </View>
                <View style={style.btnight}>
                    <TouchableNativeFeedback onPress={() => { }}>
                        <Text style={transform}>
                            <Icons name='icon-xingming' size={ratio(52)} color='#fff' />
                        </Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}