<template>
  <div class="four_content">
    <p> <i class="iconfont iconfolderplus"/> 办案小结</p>
    <div>
      <el-tabs style="margin-bottom:20px">
        <el-tab-pane :label="type===1?'案情简介':'项目简介'">
          <Tinymce v-if="active" ref="editor" v-model="analyses[0].describe" :width="'98.5%'" :height="400" :toolbar="tinymceToolbar" :menubar="''" />
        </el-tab-pane>
      </el-tabs>
      <el-tabs style="margin-bottom:20px">
        <el-tab-pane :label="type===1?'案情经过':'项目经过'">
          <Tinymce v-if="active" ref="editor" v-model="analyses[1].describe" :width="'98.5%'" :height="400" :toolbar="tinymceToolbar" :menubar="''" />
        </el-tab-pane>
      </el-tabs>
      <el-tabs style="margin-bottom:20px">
        <el-tab-pane :label="type===1?'案情结果':'项目结果'">
          <Tinymce v-if="active" ref="editor" v-model="analyses[2].describe" :width="'98.5%'" :height="400" :toolbar="tinymceToolbar" :menubar="''" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
export default {
  layout: 'userCenter',
  name: 'UserCenterCaseStatistical',
  middleware: 'auth',
  head() {
    return {
      title: `${this.$route.path.indexOf('update') > 1 ? '编辑' : '添加'}案例-我的案例-用户中心-京师在线`,
      meta: [
        { hid: 'description', name: 'description', content: '京师在线用户中心；jingshonline-usercenter' }
      ]
    }
  },
  components: {
    Tinymce
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    sourceAnalyses: {
      type: Array,
      default: function() {
        return [
          {
            describe: '',
            stage: 1
          },
          {
            describe: '',
            stage: 2
          },
          {
            describe: '',
            stage: 3
          }
        ]
      }
    }
  },
  data() {
    return {
      active: false,
      tinymceToolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote removeformat subscript superscript undo redo'],
      analyses: [
        {
          describe: '',
          stage: 1
        },
        {
          describe: '',
          stage: 2
        },
        {
          describe: '',
          stage: 3
        }
      ]
    }
  },
  watch: {
    sourceAnalyses: {
      handler: function(val) {
        this.analyses = val
      },
      deep: true,
      immediate: true
    }

  },
  deactivated() {
    this.active = false
  },
  activated() {
    this.active = true
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
.four_content{
  text-align: left;
  padding: 0 45px;
  p{
    font-size: 16px;
    margin-bottom: 36px !important;
    i{
      margin-right: 8px;
    }
  }
  >div{
    padding: 0 30px;
  }
}
</style>
