<script>
import UserMixin from "./UserMixin";
import axios from "../axios";
export default {
    name: "AddUser",
    data() {
        return {
            title: '输入新用户信息',
            btn: '添加'
        }
    },
    methods: {
        async submit() {
            if (!this.username || this.username.length < 5) {
                this.error("账户名长度不能少于5位字符！");
                return;
            }
            if (/\W/.test(this.username)) {
                this.error("账户名只能是字母，数字，下划线！");
                return;
            }

            const testUsername = await axios.post(
                "userlist?optation=username",
                { username: this.username }
            );

            if (!testUsername.data.success) {
                this.error("账户名已存在，请重新输入");
                return;
            }

            if (!this.password || this.password.length < 6) {
                this.error("密码长度不能少于6位字符！");
                return;
            }
            if (!this.name) {
                this.error("姓名不能为空！");
                return;
            }
            if (!this.email) {
                this.error("邮箱地址不能为空！");
                return;
            }
            if (
                !/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
                    this.email
                )
            ) {
                this.error("请输入正确的邮箱地址！");
                return;
            }

            const testEmail = await axios.post("userlist?optation=email", {
                email: this.email
            });

            if (!testEmail.data.success) {
                this.error("邮箱地址已存在，请重新输入");
                return;
            }

            if (!this.age) {
                this.error("请设置用户年龄！");
                return;
            }
            if (!this.head) {
                this.error("请上传用户头像！");
                return;
            }

            let age = new Date(this.age).getTime();

            if (age > Date.now()) {
                age = Date.now();
            }

            const data = {
                username: this.username,
                password: this.password,
                name: this.name,
                email: this.email,
                sex: this.sex,
                headphoto: this.head,
                // headphoto: '/demo.jpg',
                oclass: this.activeClass,
                synopsis: this.synopsis,
                age
            };

            const response = await axios.post("userlist?optation=add", data);
            if (!response.data.success) {
                this.error("添加失败");
                return;
            }

            this.$store.commit("init/success", "添加成功");

            this.username = "";
            this.password = "";
            this.name = "";
            this.email = "";
            this.age = "";
            this.sex = "1";
            this.head = "";
            this.synopsis = "";
            this.activeClass = 1;
        }
    },
    mixins: [ UserMixin ]
};
</script>

