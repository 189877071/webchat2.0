const commonMixin = {
    methods: {
        error(text) {
            this.$store.commit('init/error', text);
        },
        success(text) {
            this.$store.commit('init/success', text);
        },
        confirm(title, callback) {
            this.$store.commit('init/confirm', {
                title,
                callback
            });
        }
    }
}

export default commonMixin;