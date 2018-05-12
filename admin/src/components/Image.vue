<template>
  <transition name="el-fade-in-linear">
      <img :src="osrc" v-if="osrc" ref="oimg" alt=" ">
  </transition>
</template>
<script>
export default {
    name: "Image",
    props: ["src"],
    data() {
        return {
            osrc: ''
        };
    },
    methods: {
        load() {
            
            if (!this.src) {
                return;
            }
            
            const oimg = this.$refs.oimg;

            let oImage = new Image();
            oImage.onload = () => {
                this.osrc = this.src;
                oImage = null;
            };
            oImage.onerror = () => {
                console.log('123')
                oImage = null;
            }
            oImage.src = this.src;
        }
    },
    mounted() {
        this.load();
    }
};
</script>
