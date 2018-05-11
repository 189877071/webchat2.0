import Vue from 'vue'
import Vuex from 'vuex'
import { defaultSet } from '../fn'

Vue.use(Vuex)


const init = {
    namespaced: true,
    state: {
        alertSuccess: '',
        alertError: '',
        confirmT: '',
        confirmC: null,
        loading: true,
        login: null,
    },
    mutations: {
        success: defaultSet('alertSuccess'),
        error: defaultSet('alertError'),
        loading: defaultSet('loading'),
        login: defaultSet('login'), 
        confirm: (state, optation) => {
            const { title, callback }  = optation;
            state.confirmT = title;
            state.confirmC = callback;
        },
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