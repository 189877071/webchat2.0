<script>
import UserMixin from "./UserMixin";
import axios from "../axios";
export default {
    name: "UpdateUser",
    mixins: [UserMixin],
    data() {
        return {
            title: "修改用户信息",
            btn: "修改"
        };
    },
    methods: {
        async submit() {}
    },
    async mounted() {
        const response = await axios.post("userlist?optation=user", {
            _load: true,
            id: this.$route.params.id
        });

        
    }
};
</script>