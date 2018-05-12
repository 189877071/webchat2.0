import axios from 'axios'
import store from './store'
import config from './config'

export default axios.create({
    baseURL: config.baseURL,
    withCredentials: true,
    transformRequest: [(data, headers) => {
        if(data && !data._load) {
            store.commit('init/loading', true);
        }
        else {
            // delete data._load;
        }
        return JSON.stringify(data);
    }],
    transformResponse: [function (data) {
        store.commit('init/loading', false);
        try {
            return JSON.parse(data);
        }
        catch(e) {
            return {};
        }
    }],
    headers: {
        'Content-Type': 'application/json'
    }
})
