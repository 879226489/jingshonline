<template>
  <div class="two_content">
    <p> <i class="iconfont iconid-card"/> 案件基本信息</p>
    <div>
      <CaseInfoLawSuit v-if="type===1" ref="caseInfo" :source-case-info="CaseInfo"/>
      <CaseInfoLawNotSuit v-else ref="caseInfo" :source-case-info="CaseInfo"/>
    </div>
  </div>
</template>
<script>
import CaseInfoLawSuit from './case-info-law-suit'
import CaseInfoLawNotSuit from './case-info-law-notSuit'
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
    CaseInfoLawSuit,
    CaseInfoLawNotSuit
  },
  props: {
    type: {
      type: Number,
      default: null
    },
    CaseInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {

    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang='scss' scoped>
.two_content{
  text-align: left;
  padding: 0 34px;
  p{
    font-size: 16px;
    margin-bottom: 66px !important;
    i{
      margin-right: 8px;
    }
  }
  >div{
    padding: 0 50px;
  }
}
</style>
