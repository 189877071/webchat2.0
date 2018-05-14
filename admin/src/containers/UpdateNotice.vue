<script>
import NoticeMixin from "./NoticeMixin";
import axios from "../axios";
export default {
    name: "UpdateNotice",
    mounted() {
        this.getinfor();
    },
    data() {
        return {
            htitle: "修改公告",
            sendt: "修改"
        };
    },
    methods: {
        async getinfor() {
            const id = this.$route.params.id;

            if (!id) {
                this.$router.replace("/addnotice");
                return;
            }

            const response = await axios.post("notice", { id });

            if (!response.data.success) {
                this.error("该条公告不存在！");
                this.$router.replace("/noticelist");
                return;
            }

            const { title, content } = response.data.lists[0];

            this.title = title;

            this.editor = UE.getEditor("editor");

            this.editor.addListener("ready", () => {
                this.editor.setContent(content);
            });
        }
    },
    mixins: [NoticeMixin]
};
</script>