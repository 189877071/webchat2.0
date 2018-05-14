<script>
import NoticeMixin from "./NoticeMixin";
import axios from "../axios";
export default {
    name: "AddNotice",
    mounted() {
        this.editor = UE.getEditor("editor");
    },
    data() {
        return {
            htitle: "发布公告",
            sendt: "发布"
        };
    },
    mixins: [NoticeMixin]
};
</script>
