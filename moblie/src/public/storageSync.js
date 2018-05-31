import { storage } from './fn'

export default {
    audio(params) {
        const { resolve } = params;
        // 声音默认开启
        storage.save({ key: 'audio', data: true, expires: null });
        resolve(true);
    }
}