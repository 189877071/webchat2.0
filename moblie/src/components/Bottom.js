import React, { PureComponent } from 'react'

import { View, Text, StyleSheet, CheckBox } from 'react-native'

import Icons from '../Icons'

import { ratio, windowW } from '../public/fn'

import { pleft, pright } from '../public/config'

const style = StyleSheet.create({
    box: {
        position: 'absolute',
        bottom: ratio(40),
        width: windowW,
        height: ratio(86),
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#435059',
        paddingRight: ratio(20),
    },
    row: {
        flexDirection: 'row',
    },
    frbx: {
        height: ratio(85),
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: ratio(40),
        marginLeft: pleft,
        marginRight: pright,
    },
})

export class LoginBottom extends PureComponent {
    render() {
        return (
            <View style={style.box}>
                <Text style={style.text}><Icons name='icon-qingqiu' style={style.text} size={14} /> 无知不是生存的障碍，傲慢才是！</Text>
            </View>
        )
    }
}

export class LoginFormBottom extends PureComponent {
    render() {
        return (
            <View style={[style.row, style.frbx]}>
                <View style={[style.row]}>
                    <View>
                        <CheckBox
                            value={this.props.value}
                            onValueChange={this.props.valueChange}
                        />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={style.text}>记住密码</Text>
                    </View>
                </View>
                <View>
                    <Text style={style.text} onPress={this.props.submit}>直接进入</Text>
                </View>
            </View>
        )
    }
}