<template>
  <div>
      <router-view></router-view>
      <div class="mask" v-loading="loading" v-if="loading"></div>
      <my-message-box />
  </div>
</template>

<style lang="scss" scoped>
    .mask {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 20000;
    }
</style>

<script>
import { mapState } from 'vuex'
import axios from './axios'
import MessageBox from './components/MessageBox'
export default {
    name: "App",
    computed: {
        ...mapState('init',['loading', 'login'])
    },
    watch: {
        login(newVal) {
            if(!newVal) {
                this.$router.replace('/login');
            }
        }
    },
    components: { myMessageBox: MessageBox },
    mounted() {
        axios.post('init').then((response) => {
            this.$store.commit('init/login', !!response.data.success);
        })
    }
};
</script>