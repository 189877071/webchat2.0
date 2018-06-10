import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { pleft, pright } from '../public/config'

import { ratio, getTextDate } from '../public/fn'

import Icons from '../Icons'

import { FeedBackBtn } from './Button'

const phizStyle = {
    phizimg: {
        width: ratio(100),
        height: ratio(100),

    },
    bqbbox: {
        height: ratio(615),
        borderTopWidth: 1,
        borderColor: '#eaebec',
        backgroundColor: 'rgba(255,255,255,.8)'
    },
    stbox: {
        width: ratio(70),
        height: ratio(70),
        justifyContent: 'center',
        alignItems: 'center',
    },
    stimg: {
        width: ratio(60),
        height: ratio(60)
    }
}

const styles = StyleSheet.create({
    ...phizStyle,
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
        paddingTop: ratio(70),
        paddingBottom: ratio(50),
    },
    textbox: {
        paddingLeft: ratio(20),
        paddingRight: ratio(20),
        paddingTop: ratio(20),
        paddingBottom: ratio(20),
        borderRadius: ratio(20),
        borderWidth: 1,
        borderColor: '#94a3a8',
        flexWrap: 'wrap',
        flexDirection: 'row'
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
        maxWidth: ratio(760),
        position: 'relative',
    },
    timebox: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: ratio(20),
        alignItems: 'center',
    },
    timetext: {
        backgroundColor: '#fff',
        paddingLeft: ratio(10),
        paddingRight: ratio(10),
        fontSize: ratio(24),
        color: '#333',
        lineHeight: ratio(40)
    },
    zzfsbox: {
        position: 'absolute',
        top: ratio(20)
    },
    lzzfs: {
        left: pleft,
    },
    rzzfs: {
        right: pright,
    },
    zzfs: {
        fontSize: ratio(32),
        color: '#045a99',
        lineHeight: ratio(50),
    },
    lerr: {
        right: ratio(-80),
    },
    rerr: {
        left: -ratio(80),
    },
    error: {
        position: 'absolute',
        bottom: ratio(20),
    },
    deletbox: {
        position: 'absolute',
        top: -ratio(110),
        width: ratio(120),
        height: ratio(116),
    },
    deleteimg: {
        width: ratio(120),
        height: ratio(116),
        position: 'absolute',
        left: 0,
        top: 0,
    },
    rdelet: {
        right: ratio(20),
    },
    ldelet: {
        left: ratio(20),
    },
    delete: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ratio(100),
    },
    deltext: {
        fontSize: ratio(25),
        color: '#fff'
    },
    end: {
        justifyContent: 'flex-end'
    }
});

const imgs = [];

for (let i = 0; i < 64; i++) {
    imgs.push({ uri: i, key: i });
}

const getImg = (n) => {
    switch (n) {
        case 1: return require('../public/image/biaoqing/1.png');
        case 2: return require('../public/image/biaoqing/2.png');
        case 3: return require('../public/image/biaoqing/3.png');
        case 4: return require('../public/image/biaoqing/4.png');
        case 5: return require('../public/image/biaoqing/5.png');
        case 6: return require('../public/image/biaoqing/6.png');
        case 7: return require('../public/image/biaoqing/7.png');
        case 8: return require('../public/image/biaoqing/8.png');
        case 9: return require('../public/image/biaoqing/9.png');
        case 10: return require('../public/image/biaoqing/10.png');
        case 11: return require('../public/image/biaoqing/11.png');
        case 12: return require('../public/image/biaoqing/12.png');
        case 13: return require('../public/image/biaoqing/13.png');
        case 14: return require('../public/image/biaoqing/14.png');
        case 15: return require('../public/image/biaoqing/15.png');
        case 16: return require('../public/image/biaoqing/16.png');
        case 17: return require('../public/image/biaoqing/17.png');
        case 18: return require('../public/image/biaoqing/18.png');
        case 19: return require('../public/image/biaoqing/19.png');
        case 20: return require('../public/image/biaoqing/20.png');
        case 21: return require('../public/image/biaoqing/21.png');
        case 22: return require('../public/image/biaoqing/22.png');
        case 23: return require('../public/image/biaoqing/23.png');
        case 24: return require('../public/image/biaoqing/24.png');
        case 25: return require('../public/image/biaoqing/25.png');
        case 26: return require('../public/image/biaoqing/26.png');
        case 27: return require('../public/image/biaoqing/27.png');
        case 28: return require('../public/image/biaoqing/28.png');
        case 29: return require('../public/image/biaoqing/29.png');
        case 30: return require('../public/image/biaoqing/30.png');
        case 31: return require('../public/image/biaoqing/31.png');
        case 32: return require('../public/image/biaoqing/32.png');
        case 33: return require('../public/image/biaoqing/33.png');
        case 34: return require('../public/image/biaoqing/34.png');
        case 35: return require('../public/image/biaoqing/35.png');
        case 36: return require('../public/image/biaoqing/36.png');
        case 37: return require('../public/image/biaoqing/37.png');
        case 38: return require('../public/image/biaoqing/38.png');
        case 39: return require('../public/image/biaoqing/39.png');
        case 40: return require('../public/image/biaoqing/40.png');
        case 41: return require('../public/image/biaoqing/41.png');
        case 42: return require('../public/image/biaoqing/42.png');
        case 43: return require('../public/image/biaoqing/43.png');
        case 44: return require('../public/image/biaoqing/44.png');
        case 45: return require('../public/image/biaoqing/45.png');
        case 46: return require('../public/image/biaoqing/46.png');
        case 47: return require('../public/image/biaoqing/47.png');
        case 48: return require('../public/image/biaoqing/48.png');
        case 49: return require('../public/image/biaoqing/49.png');
        case 50: return require('../public/image/biaoqing/50.png');
        case 51: return require('../public/image/biaoqing/51.png');
        case 52: return require('../public/image/biaoqing/52.png');
        case 53: return require('../public/image/biaoqing/53.png');
        case 54: return require('../public/image/biaoqing/54.png');
        case 55: return require('../public/image/biaoqing/55.png');
        case 56: return require('../public/image/biaoqing/56.png');
        case 57: return require('../public/image/biaoqing/57.png');
        case 58: return require('../public/image/biaoqing/58.png');
        case 59: return require('../public/image/biaoqing/59.png');
        case 60: return require('../public/image/biaoqing/60.png');
        case 61: return require('../public/image/biaoqing/61.png');
        case 62: return require('../public/image/biaoqing/62.png');
        case 63: return require('../public/image/biaoqing/63.png');
        default: return require('../public/image/biaoqing/1.png');
    }
}

export class ChatTab extends PureComponent {
    setColor = (active) => (this.props.active === active ? '#ff002a' : '#617286');

    render() {
        const { active, toggle } = this.props;

        return ( // toggle
            <View style={styles.tabbox}>
                <View style={styles.tabItem}>
                    <Icons name='icon-yuyin' size={ratio(70)} color={this.setColor('yuyin')} />
                    <FeedBackBtn onPress={() => { toggle('yuyin') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-biaoqing' size={ratio(70)} color={this.setColor('phiza')} />
                    <FeedBackBtn onPress={() => { toggle('phiza') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-llrandomshake' size={ratio(70)} color={this.setColor('llrandomshake')} />
                    <FeedBackBtn onPress={() => { toggle('llrandomshake') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-tupian' size={ratio(70)} color={this.setColor('upian')} />
                    <FeedBackBtn onPress={() => { toggle('upian') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-shexiangtou' size={ratio(70)} color={this.setColor('shexiangtou')} />
                    <FeedBackBtn onPress={() => { toggle('shexiangtou') }} />
                </View>
            </View>
        )
    }
}

export class TextMessage extends PureComponent {

    errorCom = () => {
        let style = [styles.error];

        style[1] = (this.props.sender == 'mi') ? styles.rerr : styles.lerr;

        return (
            <Icons
                name='icon-gantanhao'
                style={style}
                size={ratio(60)}
                color='#f00'
            />
        )
    }

    deletCom = () => {
        const { sender, delet, id } = this.props;

        let style = [styles.deletbox];

        style[1] = (sender == 'mi') ? styles.rdelet : styles.ldelet;

        return (
            <View style={style}>
                <Image
                    source={require('../public/image/delete.png')}
                    style={styles.deleteimg}
                />
                <View style={styles.delete}>
                    <Icons name='icon-shanchu' size={ratio(50)} color='#fff' />
                    <Text style={styles.deltext}>删除</Text>
                </View>
                <FeedBackBtn onPress={() => { delet(id) }} />
            </View>
        )
    }

    zzfsCom = () => {
        let style = [styles.zzfsbox];
        let content = '……正在发送';
        if (this.props.sender === 'mi') {
            style[1] = styles.rzzfs;
        }
        else {
            style[1] = styles.lzzfs;
            content = '正在发送……';
        }

        return (
            <View style={style}>
                <Text style={styles.zzfs}>{content}</Text>
            </View>
        )
    }

    timeCom = () => (
        <View style={styles.timebox}>
            <Text style={styles.timetext}>{getTextDate(this.props.time)}</Text>
        </View>
    )

    imgCom = () => (
        <Image
            source={{ uri: this.props.userphoto }}
            style={styles.img}
        />
    )

    ContentCom = () => {
        const { sender, content, setDeletId, id } = this.props;

        const textstyle = [styles.textbox, styles[sender === 'mi' ? 'rtext' : 'ltext']];

        const List = content.map((item, index) => {
            if (item.type == 'text') {
                return (
                    <Text key={index} style={styles.text}>{item.content}</Text>
                )
            }
            else {
                return (
                    <View style={styles.stbox} key={index}>
                        <Image source={getImg(Number(item.content))} style={styles.stimg} />
                    </View>
                )
            }
        });

        return (
            <TouchableWithoutFeedback onLongPress={() => setDeletId(id)}>
                <View style={textstyle}>{List}</View>
            </TouchableWithoutFeedback>
        )
    }

    render() {

        const { sender, content, id, state, showtime, lastTime, showDelet, userphoto, setDeletId } = this.props;

        let boxstyle = [styles.messagebox];
        let contextstyle = [styles.content];
        let imgstyle = [styles.img];

        if (sender == 'mi') {
            boxstyle[1] = styles.end;
        }

        return (
            <View style={boxstyle}>
                {sender !== 'mi' && this.imgCom()}
                <View style={contextstyle}>

                    {this.ContentCom()}
                    {/* 发送出错组件 */}
                    {state === 'error' && this.errorCom()}
                    {/* 删除组件 */}
                    {showDelet && this.deletCom()}
                </View>
                {sender === 'mi' && this.imgCom()}
                {/* 时间组件 */}
                {showtime && this.timeCom()}
                {/* 正在发送组件 */}
                {state === 'transmit' && this.zzfsCom()}
            </View>
        )
    }
}

export class PhizIcon extends PureComponent {
    ItemCom = ({ item, index }) => {
        return (
            <View style={{ width: ratio(152), alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { this.props.addIcon(`{{icon${index}}}`) }}>
                    <Image
                        source={getImg(item.uri)}
                        style={styles.phizimg}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    ItemSeparatorComponent = () => (<View style={{ height: ratio(55) }} />);

    BothEndCom = () => (<View style={{ height: ratio(30) }} />);

    render() {
        return (
            <View style={styles.bqbbox}>
                <FlatList
                    data={imgs}
                    numColumns={7}
                    renderItem={this.ItemCom}
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                    ListHeaderComponent={this.BothEndCom}
                    ListFooterComponent={this.BothEndCom}
                />
            </View>
        )
    }
}

const wlen = ratio(600);
export class TypeMessage extends PureComponent {

    render() {
        const { content } = this.props;
        let w = 0;
        const List = content.map((item, index) => {
            
            if (item.type == 'text') {
                let o = w;
                w += item.content.length * ratio(30);
                let content = item.content;
                if (w > wlen) {
                    Math.floor((wlen - o) / ratio(30));
                    content = content.slice(0, Math.floor((wlen - o) / ratio(30)));
                }
                return (
                    <Text key={index} style={[styles.text, { color: '#666' }]}>{content}</Text>
                )
            }
            else {
                w += ratio(60);
                if (w > wlen) {
                    return null;
                }
                return (
                    <View style={styles.stbox} key={index}>
                        <Image source={getImg(Number(item.content))} style={styles.stimg} />
                    </View>
                )
            }
        });
        return (
            <View style={{ flexDirection: 'row', height: ratio(70), alignItems: 'center' }}>{List}</View>
        )
    }
}