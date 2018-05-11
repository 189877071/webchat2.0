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
        async submit() {
            const d = new Date(this.age);
            console.log(d.getTime())
            // console.log(this.age)
        }
    },
    async mounted() {
        const response = await axios.post("userlist?optation=user", {
            _load: true,
            id: this.$route.params.id
        });

        const { success, age, class: { oclass }, email, issystem, name, username } = response.data;
        
        if(!success) {
            alert('获取用户数据失败');
            this.$router.go(-1);
            return;
        }

        this.username = username;
        this.name = name;
        this.email = email;
        console.log(issystem)
        this.issystem = issystem;
    }
};
</script>