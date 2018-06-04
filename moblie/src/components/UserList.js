import React, { PureComponent } from 'react'

import { View, Text, StyleSheet, Image, Animated, PanResponder } from 'react-native'

import { borderColor, listBg, pleft, pright } from '../public/config'

import { ratio, windowW } from '../public/fn'

import { FeedBackBtn } from './Button'

import Icons from '../Icons'

const [w130, w174, w126, w162, w450, w20, w26, w30, w60, w40, w35, w55, w28, w46] = [
    ratio(130),
    ratio(174),
    ratio(126),
    ratio(162),
    ratio(450),
    ratio(20),
    ratio(26),
    ratio(30),
    ratio(60),
    ratio(40),
    ratio(35),
    ratio(55),
    ratio(28),
    ratio(46),
]

const styles = StyleSheet.create({
    useritembox: {
        height: w174,
        borderBottomWidth: 1,
        borderColor: borderColor,
        backgroundColor: listBg,
        flexDirection: 'row'
    },
    messageContent: {
        width: windowW + w450,
        flexDirection: 'row',
        position: 'relative'
    },
    usercontent: {
        width: windowW,
        flexDirection: 'row',
    },
    useritemlist: {
        width: windowW,
        flexDirection: 'row',
        position: 'relative'
    },
    portrait: {
        // width: w162,
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        alignItems: 'center',
        paddingLeft: pleft,
    },
    portraitimg: {
        width: w126,
        height: w126,
        borderRadius: w126,
        borderWidth: 1,
        borderColor: borderColor
    },
    usermessage: {
        flex: 1,
        paddingLeft: w20,
        paddingTop: w26,
        paddingRight: pright
    },
    usermessagelist: {
        height: w60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontSize: w40,
        color: '#4b5e6f'
    },
    time: {
        fontSize: w35,
        color: '#5f7688'
    },
    tishi: {
        fontSize: w35,
        color: '#888'
    },
    unlbox: {
        height: w55,
        paddingLeft: w20,
        paddingRight: w20,
        backgroundColor: '#637285',
        borderRadius: w55,
        alignItems: 'center',
        flexDirection: 'row'
    },
    unl: {
        fontSize: w28,
        color: '#fff'
    },
    hidebox: {
        width: w450,
        flexDirection: 'row'
    },
    unshift: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#18bd9d',
        position: 'relative'
    },
    delete: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3a31',
        position: 'relative'
    },
    white: {
        color: '#fff',
        fontSize: w46
    },
    classify: {
        borderBottomWidth: 0,
        borderTopWidth: 1,
        alignItems: 'center',
        paddingLeft: ratio(20),
        position: 'relative'
    },
    jiantou: {
        width: ratio(60),
        height: ratio(60),
        justifyContent: 'center',
        alignItems: 'center'
    },
    classTitle: {
        color: '#4a6f8a',
        fontSize: ratio(40)
    }
})


class UserPortrait extends PureComponent {
    render() {
        return (
            <View style={styles.portrait}>
                <Image
                    source={require('../public/image/user-photo.jpg')}
                    resizeMethod='scale'
                    style={styles.portraitimg}
                />
            </View>
        )
    }
}

class UserMessage extends PureComponent {
    render() {
        return (
            <View style={styles.usermessage}>
                <View style={styles.usermessagelist}>
                    <Text style={styles.name}>须继月</Text>
                    <Text style={styles.time}>昨天</Text>
                </View>
                <View style={styles.usermessagelist}>
                    <Text>[离线] 阿拉啦啦……</Text>
                    <View style={styles.unlbox}>
                        <Text style={styles.unl}>1</Text>
                    </View>
                </View>
            </View>
        )
    }
}

class UserInfor extends PureComponent {
    render() {
        return (
            <View style={styles.usermessage}>
                <View style={styles.usermessagelist}>
                    <Text style={styles.name}>须继月</Text>
                </View>
                <View style={styles.usermessagelist}>
                    <Text>阿拉啦啦……</Text>
                </View>
            </View>
        )
    }
}

class UserHideBtn extends PureComponent {
    render() {
        return (
            <View style={styles.hidebox}>
                <View style={styles.unshift}>
                    <Text style={styles.white}>置顶</Text>
                </View>
                <View style={styles.delete}>
                    <Text style={styles.white}>删除</Text>
                </View>
            </View>
        )
    }
}

class MessageContent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
            start: 0,
            move: 0,
            show: false,
            bg: new Animated.Value(0)
        };

        this.state.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt) => {
                this.state.pan.extractOffset();
                this.setState({ start: evt.nativeEvent.pageX + this.state.move });
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                Animated.timing(this.state.bg, {
                    toValue: 1,
                    duration: 600
                }).start();
            },
            onPanResponderMove: (evt, gestureState) => {
                let move = this.state.start - evt.nativeEvent.pageX;
                if (move > w450) {
                    move = w450;
                }
                else if (move < 0) {
                    move = 0;
                }
                this.state.pan.setOffset({ x: -move, y: 0 });
                this.setState({ move });
            },
            onPanResponderRelease: (evt, gestureState) => {
                let r = this.state.move / w450;
                let move = 0;
                let show = false;
                if (!this.state.show) {
                    if (r > 0.2) {
                        move = w450;
                        show = true;
                    }
                }
                else {
                    if (r > 0.8) {
                        move = w450;
                        show = true;
                    }
                }

                this.state.pan.flattenOffset();

                Animated.parallel([
                    Animated.timing(this.state.pan, {
                        toValue: { x: -move, y: 0 },
                        duration: 150
                    }),
                    Animated.timing(this.state.bg, {
                        toValue: 0,
                        duration: 300
                    })
                ]).start();

                this.setState({ move, show });
            },
        });
    }
    render() {
        return (
            <Animated.View
                style={[
                    styles.messageContent,
                    {
                        transform: this.state.pan.getTranslateTransform(),
                        backgroundColor: this.state.bg.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.07)']
                        })
                    }
                ]}
                {...this.state.panResponder.panHandlers}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}

export class MessageItem extends PureComponent {
    render() {
        return (
            <View style={styles.useritembox}>
                <MessageContent>
                    <View style={styles.useritemlist}>
                        <UserPortrait />
                        <UserMessage />
                    </View>
                    <UserHideBtn />
                </MessageContent>
            </View>
        )
    }
}

export class UserItem extends PureComponent {
    render() {
        return (
            <View style={styles.useritembox}>
                <UserPortrait />
                <UserInfor />
                <FeedBackBtn />
            </View>
        )
    }
}

export class UserClassify extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rotate: new Animated.Value(0)
        };
    }
    startRotate = (num) => {
        Animated.timing(this.state.rotate, {
            toValue: num,
            duration: 100
        }).start();
    }
    render() {
        return (
            <View style={[styles.useritembox, styles.classify]}>
                <Animated.View style={[styles.jiantou, {
                    transform: [{
                        rotate: this.state.rotate.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '90deg']
                        })
                    }]
                }]}>
                    <Icons name='icon-202-copy' size={ratio(50)} style={{transform: [{
                        translateY: ratio(3)
                    }]}} color='#bebec0' />
                </Animated.View>
                <View>
                    <Text style={styles.classTitle}>默认项目组</Text>
                </View>
                <FeedBackBtn />
            </View>
        )
    }
}