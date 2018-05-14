<script>
import UserMixin from "./UserMixin";
import axios from "../axios";
import config from "../config";
export default {
    name: "UpdateUser",
    mixins: [UserMixin],
    data() {
        return {
            title: "修改用户信息",
            btn: "修改",
            init: {}
        };
    },
    methods: {
        async submit() {
            const init = this.init;

            let data = {};

            if (this.username != init.username) {
                if (!/^[a-z0-9_-]{5,20}$/.test(this.username)) {
                    this.error(
                        "账户名长度为5~20位字符，并且只能是字母/数字/下划线！"
                    );
                    return;
                }
                const testUsername = await axios.post(
                    "userlist?optation=username",
                    { username: this.username, _load: true }
                );

                if (!testUsername.data.success) {
                    this.error("账户名已存在，请重新输入");
                    return;
                }
                data.username = this.username;
            }

            if (this.password) {
                if (!/^[a-z0-9_-]{6,20}$/.test(this.password)) {
                    this.error(
                        "密码长度为5~20位字符，并且只能是字母/数字/下划线！"
                    );
                    return;
                }
                data.password = this.password;
            }

            if (this.name != init.name) {
                data.name = this.name;
            }

            if (this.email != init.email) {
                if (
                    !/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
                        this.email
                    )
                ) {
                    this.error("请输入正确的邮箱地址！");
                    return;
                }
                const testEmail = await axios.post("userlist?optation=email", {
                    email: this.email,
                    _load: true
                });
                if (!testEmail.data.success) {
                    this.error("邮箱地址已存在，请重新输入");
                    return;
                }
                data.email = this.email;
            }

            if (this.synopsis != init.synopsis) {
                data.synopsis = this.synopsis;
            }

            if (this.age != init.age) {
                let age = new Date(this.age).getTime();
                if (age > Date.now()) {
                    age = Date.now();
                }

                data.age = age;
            }

            if (this.sex != init.sex) {
                data.sex = this.sex;
            }

            if (this.head != config.serverHostName + init.headphoto) {
                data.headphoto = this.head;
            }

            if (this.activeClass != init.class) {
                data.oclass = this.activeClass;
            }

            if (JSON.stringify(data) == "{}") {
                this.error("您还没有修改内容!");
                return;
            }

            const response = await axios.post("userlist?optation=update", {
                ...data,
                id: init.id
            });

            if (!response.data.success) {
                this.error("修改失败!");
                return;
            }
            this.success("修改成功!");
        }
    },
    async mounted() {
        const response = await axios.post("userlist?optation=user", {
            _load: true,
            id: this.$route.params.id
        });

        const {
            success,
            age,
            class: oclass,
            email,
            synopsis,
            name,
            username,
            sex,
            headphoto
        } = response.data;

        if (!success) {
            alert("获取用户数据失败");
            this.$router.push("/userlists");
            return;
        }

        this.username = username;
        this.name = name;
        this.email = email;
        this.synopsis = synopsis;
        this.age = age;
        this.sex = sex;
        this.head = config.serverHostName + headphoto;
        this.activeClass = oclass;
        this.init = response.data;
    }
};
</script>