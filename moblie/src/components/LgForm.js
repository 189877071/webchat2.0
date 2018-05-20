import React, { Component, PureComponent } from 'react'

import { View, TextInput, StyleSheet, Button, CheckBox, Text } from 'react-native'

import { ratio, inputBorderColor, btnColor } from '../public/config'

const style = StyleSheet.create({
    box: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputbox: {
        width: 920 / ratio,
        paddingLeft: 25 / ratio,
        borderBottomWidth: 1,
        borderColor: inputBorderColor,
        height: 116 / ratio,
        marginTop: 50 / ratio,
    },
    input: {
        width: 890 / ratio,
        height: 116 / ratio
    },
    btnbox: {
        width: 920 / ratio,
        marginTop: 80 / ratio,
    },
    row: {
        flexDirection: 'row',
    },
    frbx: {
        height: 85 / ratio,
        width: 920 / ratio,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40 / ratio,
    },
    text: {
        color: '#435059'
    },
});

export class LgInput extends PureComponent {
    render() {
        return (
            <View
                style={style.inputbox}>
                <TextInput
                    style={style.input}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="#afa6a7"
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.props.password ? true : false}
                />
            </View>
        )
    }
}

export class LgButton extends PureComponent {
    render() {
        return (
            <View style={style.btnbox}>
                <Button
                    title={this.props.title}
                    color={btnColor}
                    onPress={() => { }}
                />
            </View>
        )
    }
}

class AccessoryForm extends PureComponent {
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
                    <Text style={style.text}>直接进入</Text>
                </View>
            </View>
        )
    }
}

export default class LgForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: false
        }
    }
    checkBoxChange = () => {
        this.setState({ checkbox: this.state.checkbox ? false : true });
    }
    render() {
        return (
            <View style={style.box}>
                <LgInput
                    placeholder="用户名/邮箱"
                />
                <LgInput
                    placeholder="密码"
                    password
                />
                <LgButton
                    title="登 录"
                />
                <AccessoryForm
                    value={this.state.checkbox}
                    valueChange={this.checkBoxChange}
                />
            </View>
        )
    }
}