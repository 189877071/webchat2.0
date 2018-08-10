import React, { PureComponent } from 'react'

import { StyleSheet, View, Text, TouchableNativeFeedback, TouchableHighlight } from 'react-native'

import { headerBackground, pleft, pright } from '../public/config'

import { ratio } from '../public/fn'

import Icons from '../Icons'

import { SmallButton } from './Button'

import { SearchInput } from './Input'

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
        flex: 1,
        paddingLeft: pleft,
        height: ratio(147),
        justifyContent: 'center'
    },
    btnight: {
        flex: 1,
        paddingRight: pright,
        height: ratio(147),
        alignItems: 'flex-end',
        justifyContent: 'center'
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
    },
    search: {
        flex: 1,
        paddingLeft: pleft,
    },
    searchbtn: {
        paddingRight: pright,
        paddingLeft: pleft,
        justifyContent: 'flex-end',
        height: ratio(147),
    }
});

class HeadLeft extends PureComponent {
    render() {
        const transform = {
            transform: [{
                translateY: ratio(3)
            }]
        };
        return (
            <View style={style.btnleft}>
                <TouchableNativeFeedback onPress={this.props.event}>
                    <Text style={transform}>
                        <Icons
                            name='icon-fanhui'
                            size={ratio(52)}
                            color={this.props.color}
                        />
                    </Text>
                </TouchableNativeFeedback>
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
        const { title, hideBtn, backup, submit } = this.props;
        return (
            <View style={style.box}>
                <HeadLeft event={backup} color={headerBackground} />
                <View style={style.title}>
                    <Text style={[style.titleText, { color: headerBackground }]}>
                        {title}
                    </Text>
                </View>
                <View style={style.btnight}>
                    {!hideBtn && <SmallButton href={submit} title='保存' />}
                </View>
            </View>
        )
    }
}

export class ChatHeader extends PureComponent {
    render() {
        const { goBack, name, state, infor } = this.props;
        const transform = {
            transform: [{
                translateY: ratio(3)
            }]
        }
        return (
            <View style={[style.box, { backgroundColor: headerBackground }]}>
                <HeadLeft event={goBack} color='#fff' />
                <View style={style.chat}>
                    <View style={style.chatchild}>
                        <Text style={style.chatName}>{name}</Text>
                        <Text style={style.chatState}>{state ? '在线' : '离线'}</Text>
                    </View>
                </View>
                <View style={style.btnight}>
                    <TouchableNativeFeedback onPress={infor}>
                        <Text style={transform}>
                            <Icons name='icon-xingming' size={ratio(52)} color='#fff' />
                        </Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

export class SearchHeaser extends PureComponent {
    render() {
        const { value, change, href, blurCallback } = this.props;
        return (
            <View style={[style.box, { justifyContent: 'flex-start' }]}>
                <View style={style.search}>
                    <SearchInput value={value} change={change} blurCallback={blurCallback} />
                </View>
                <View style={style.searchbtn}>
                    <SmallButton height={ratio(105)} fontSize={ratio(40)} href={href} title='取消' />
                </View>
            </View>
        )
    }
}