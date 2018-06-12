import React, { Component } from 'react';

import { View } from 'react-native';

import ImagePicker from 'react-native-image-picker'

import { connect } from 'react-redux';

import Box, { ScrollBox } from '../components/Box'

import { BigButton } from '../components/Button'

import { Background } from '../components/Image'

import { ratio, ofetch, uploadImage, hint } from '../public/fn'

import { setLoginActiveState, setCoAudio } from '../store/common/action'

import { UserPhoto, UserName, SettingItems } from '../components/SettingList'

import { setAtoSex, setAAge, setAHeadphoto } from '../store/active/action'

import { hostname } from '../public/config'

class Setting extends Component {
    constructor(props) {
        super(props);

        this.isload = false;
    }
    exit = async () => {
        const { success, error } = await ofetch('/exit', this.props.socketInfor);
        if (!success) {
            alert(error);
            return;
        }
        this.props.exit();
    }

    setphoto = async (headphoto, grayheadphoto) => {
        if (!headphoto || !grayheadphoto) return;

        const { success } = await ofetch('/setting?optation=photo', { headphoto, grayheadphoto });

        this.isload = false;
        
        if (!success) {
            hint('头像修改失败');
            return;
        }
        
        this.props.setphoto(headphoto);

        hint('头像修改成功');
    }

    openimg = () => {

        if(this.isload) {
            hint('正在提交数据……');
            return;
        }

        const photoOptions = {
            title: '请选择',
            quality: 0.8,
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            allowsEditing: true,
            noData: false,
            maxWidth: 400,
            maxHeight: 400,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(photoOptions, async (response) => {
           
            if (response.didCancel || response.error || response.customButton) {
                hint('操作失败……');
                return;
            }
            this.isload = true;
            const { success, name, grayname } = await uploadImage(response.uri);

            if (!success) {
                hint('图片上传失败');
                this.isload = false;
                return;
            }

            this.setphoto(name, grayname);
        });

    }

    render() {
        return (
            <Box>
                <Background active="setting" />
                <ScrollBox>
                    <UserPhoto uri={hostname + this.props.headphoto} open={this.openimg} />
                    <UserName name={this.props.username} />
                    <SettingItems {...this.props} />
                    <BigButton title='退出' onPress={this.exit} />
                    <View style={{ paddingBottom: ratio(100) }} />
                </ScrollBox>
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    socketInfor: state.c.socketInfor,
    id: state.a.id,
    // 用户名
    username: state.a.username,
    // 头像
    headphoto: state.a.headphoto,
    // 邮箱
    email: state.a.email,
    // 性别
    sex: state.a.sex,
    // 年龄
    age: state.a.age,
    // 昵称
    name: state.a.name,
    // 简介
    synopsis: state.a.synopsis,
    // 声音
    audio: state.c.audio
}), (dispatch, props) => ({
    exit: () => dispatch(setLoginActiveState(2)),
    setsex: value => dispatch(setAtoSex(value)),
    setage: value => dispatch(setAAge(value)),
    setaudio: value => dispatch(setCoAudio(value)),
    setphoto: value => dispatch(setAHeadphoto(value))
}))(Setting);