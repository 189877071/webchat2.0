import Vue from 'vue'
import Vuex from 'vuex'
import { defaultSet } from '../fn'

Vue.use(Vuex)


const init = {
    namespaced: true,
    state: {
        alertSuccess: '',
        alertError: '',
        loading: true,
        login: null,
    },
    mutations: {
        success: defaultSet('alertSuccess'),
        error: defaultSet('alertError'),
        loading: defaultSet('loading'),
        login: defaultSet('login'), 
    }
}

const index = {
    namespaced: true,
    state: {
        title: ''
    },
    mutations: {
        setTitle: defaultSet('title')
    }
}

const store = new Vuex.Store({
    modules: {
        init,
        index
    }
})

export default store