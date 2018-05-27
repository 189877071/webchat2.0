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
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        color: '#fff',
        fontSize: ratio(52),
    },
    bothEnds: {
        justifyContent: 'center',
        paddingLeft: pleft,
        flex: 1,
    },
    inlineright: {
        flex: 1,
        paddingRight: pright,
        alignItems: 'flex-end'
    }
})


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
            <View style={style.bothEnds}>
                {oIcon}
            </View>
        )
    }
}

class HeadRight extends PureComponent {
    render() {
        const transform = {
            transform: [{
                translateY: ratio(3)
            }]
        }
        const oIcon = this.props.event && (
            <TouchableNativeFeedback onPress={() => { }}>
                <Text style={transform}>
                    <Icons name='icon-xingming' size={ratio(52)} color='#fff' />
                </Text>
            </TouchableNativeFeedback>
        )
        return (
            <View style={style.bothEnds}>
                {oIcon}
            </View>
        )
    }
}

export class Header extends PureComponent {
    render() {
        const { title, leftEvent, rightEvent } = this.props;
        return (
            <View style={[style.box, { backgroundColor: headerBackground }]}>
                <HeadLeft event={leftEvent} color='#fff' />
                <View style={style.title}>
                    <Text style={style.titleText}>{title}</Text>
                </View>
                <HeadRight event={rightEvent} />
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
                <View style={style.inlineright}>
                    <SmallButton title='保存' />
                </View>
            </View>
        )
    }
}