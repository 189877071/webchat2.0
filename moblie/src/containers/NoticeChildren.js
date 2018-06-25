import React, { Component, PureComponent } from 'react';

import { View, Text, ScrollView, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { InlineHeader } from '../components/Header'

import { ofetch, ratio, getTextDate, windowW, sliceStr } from '../public/fn'

import { pleft, pright, hostname } from '../public/config'

import { setNAddContent } from '../store/notice/action'

import { ShowImageZoom } from '../components/NoticeList'

const styles = StyleSheet.create({
    nullbox: { height: ratio(300), justifyContent: 'center', alignItems: 'center' },
    nulltext: { fontSize: ratio(60), color: '#000' },
    title: {
        fontSize: ratio(60), color: '#000', lineHeight: ratio(80), paddingLeft: pleft, paddingRight: pright, fontWeight: 'bold'
    },
    infor: {
        borderBottomWidth: 1, borderColor: '#07bb98', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center', paddingLeft: pleft, paddingRight: pright,
    },
    infortext: {
        fontSize: ratio(40), color: '#555', lineHeight: ratio(100)
    },
    description: {
        margin: ratio(30),
        backgroundColor: 'rgba(255,255,255,.6)', padding: ratio(30),
        borderWidth: 1, borderColor: '#ddd'
    },
    descriptiontext: {
        fontSize: ratio(50), color: '#000', lineHeight: ratio(80)
    },
    imagec: {
        width: windowW - pleft - pright, height: ratio(600)
    },
    imgcbox: {
        alignItems: 'center', marginTop: ratio(40), marginBottom: ratio(40)
    },
    titlecbox: {
        paddingLeft: pleft, paddingRight: pright,
    },
    titletext: {
        fontSize: ratio(60), fontWeight: 'bold', lineHeight: ratio(80), color: '#000'
    },
    ctext: {
        fontSize: ratio(50), lineHeight: ratio(80), color: '#000'
    }
});

const urlrep = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;

function _url(url) {
    return urlrep.test(url) ? url : hostname + url;
}

class ContentCom extends PureComponent {
    render() {
        let { title, mobliecontent, description, otime, seturi } = this.props;
        let content = null;
        try {
            mobliecontent = JSON.parse(mobliecontent);
            content = mobliecontent.map((item, index) => {
                // image view title
                switch (item.type) {
                    case 'image':
                        const src = _url(item.src);
                        return (
                            <View key={index} style={styles.imgcbox}>
                                <TouchableNativeFeedback onPress={() => seturi(src)}>
                                    <Image source={{ uri: src }} resizeMode='cover' style={styles.imagec} />
                                </TouchableNativeFeedback>
                            </View>
                        );
                    case 'title':
                        return (
                            <View key={index} style={styles.titlecbox}>
                                <Text style={styles.titletext}>{item.text}</Text>
                            </View>
                        );
                    case 'view':
                        return (
                            <View key={index} style={styles.titlecbox}>
                                <Text style={styles.ctext}>{item.text}</Text>
                            </View>
                        );
                    default:
                        return null;
                }
            })
        }
        catch (e) {
            content = (
                <View style={styles.nullbox}>
                    <Text style={styles.nulltext}>数据解析失败！</Text>
                </View>
            )
        }

        return (
            <ScrollView style={{ flex: 1 }}>
                <Text style={styles.title}>{sliceStr(title, 30)}</Text>
                <View style={styles.infor}>
                    <Text style={styles.infortext}>发布人：admin</Text>
                    <Text />
                    <Text style={styles.infortext}>日期：{getTextDate(otime)}</Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptiontext}>{description}</Text>
                </View>
                {content}
                <View style={{ height: ratio(100) }} />
            </ScrollView>
        )
    }
}

class NoticeChildren extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            load: true,
            uri: ''
        }

        if (!this.props.content) {
            this.getdata();
        }
    }
    // 返回
    backup = () => {
        this.props.navigation.goBack();
    }

    NoDataCom = () => (
        <View style={styles.nullbox}>
            <Text style={styles.nulltext}>
                {this.state.load ? '正在获取数据中' : '数据获取失败'}……
            </Text>
        </View>
    )

    seturi = (uri) => {
        this.setState({ uri });
    }

    render() {
        let { content } = this.props;

        return (
            <Box>
                <Background active="noticechildren" />
                <InlineHeader title="公告内容" hideBtn={true} backup={this.backup} />
                {!content ? this.NoDataCom() : <ContentCom {...content} seturi={this.seturi} />}
                <ShowImageZoom uri={this.state.uri} close={() => this.seturi('')} />
            </Box>
        )
    }
    async getdata() {
        // 获取数据
        const { success, data } = await ofetch('/notice', { id: this.props.id });

        this.setState({ load: false });

        if (!success) {
            return;
        }
        // 获取成功
        this.props.dispatch(setNAddContent(data, this.props.id));
    }
}

export default connect((state, props) => {
    const id = props.navigation.getParam('id', 0);
    return {
        id,
        navigation: props.navigation,
        content: state.n.content[id]
    }
})(NoticeChildren);