<template>
<transition name="el-fade-in-linear">
    <img :src="osrc" v-if="osrc" alt=" ">
</transition>
</template>

<script>
export default {
    name: "Imaged",
    props: ["src"],
    data() {
        return {
            osrc: ""
        };
    },
    methods: {
        load() {
            if (!this.src) {
                return;
            }

            let oImage = new Image();

            oImage.onload = () => {
                this.osrc = this.src;
                oImage = null;
            };
            oImage.onerror = () => {
                oImage = null;
            };
            oImage.src = this.src;
        }
    },
    mounted() {
        this.load();
    }
};
</script>
