<template>
  <div>
    <div class="lawyer-info-container">
      <el-breadcrumb separator-class="el-icon-minus" class="breadcrumb title">
        <el-breadcrumb-item :to="{path:'/'}" >首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/Lawyer'}">查找律师</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="lawyer-info-card">
        <div v-if="lawyerInformation.status === 2" class="lawyer-isAuthentication"/>
        <div class="lawyer-info-top">
          <a class="lawyer-info-picture" href=":javascript">
            <img :src="lawyerInformation.avatar" alt="律师头像">
          </a>
          <div class="lawyer-info-detail">
            <p class="lawyer-name">{{ lawyerInformation.realName || '暂无数据' }}</p>
            <p class="lawyer-year"><span>{{ lawyerInformation.experienceYear || '0' }}年</span><span>{{ lawyerInformation.caseCount || '0' }}例</span></p>
            <p class="lawyer-id"><span>ID: {{ lawyerInformation.id || '暂无数据' }} 最后更新时间: </span></p>
            <p class="lawyer-time">{{ lawyerInformation.lastModificationTime || '暂无数据' }} </p>
          </div>
        </div>
        <div class="lawyer-information">
          <h4>基本信息</h4>
          <ul>
            <li><span>所在律所</span>{{ lawyerInformation.lawfirmName || '暂无数据' }}</li>
            <li><span>所在地</span>{{ lawyerInformation.regionName || '暂无数据' }}</li>
            <li><span>最高学历</span>{{ lawyerInformation.highestDegree || '暂无数据' }} </li>
            <li><span>执业证号</span>{{ lawyerInformation.licenceNo || '暂无数据' }}</li>
          </ul>
          <h4>联系方式</h4>
          <ul>
            <li><span>联系电话</span>{{ lawyerInformation.phone || '暂无数据' }}</li>
            <li><span>律师邮箱</span>{{ lawyerInformation.email || '暂无数据' }}</li>
          </ul>
          <h4>业务专长</h4>
          <div v-if="lawyerBusiness.length">
            <ul class="lawyer-business">
              <li v-for="(item,index) in lawyerBusiness" :key="index"><a href="javascript:void(0);">{{ item }}</a></li>
            </ul>
          </div>
          <p v-else>暂无数据</p>
        </div>
      </div>
      <lawyer-detail
        :is-follow="lawyerInformation.isFollow"
        :real-name="lawyerInformation.realName"
        :resume-data="resumeData"
        :lawyer-remark="lawyerInformation.remark"
        :court-data="courtData"
        :court-list-data="courtListData"
        :chart-data="chartData"
        :industry-data-list="industryDataList"
        :practicearea-data-list="practiceareaDataList"
      />
    </div>
    <ExtraWrap :plugins="'error,qrcode,totop,share'" :share-url="shareUrl" :top="'200px'" :left="'100px'" />
  </div>
</template>

<script>
import LawyerDetail from './components/LawyerDetail'
import axios from 'axios'
import setting from '@/plugins/setting'
import ExtraWrap from '@/components/ExtraWrap'
import { mapActions } from 'vuex'
import utils from '@/utils'
import moment from 'moment'
export default {
  layout: 'web',
  components: {
    LawyerDetail,
    ExtraWrap
  },
  head() {
    return {
      title: '律师详情',
      meta: [
        { hid: 'description', name: 'description', content: '京师在线律师详情；jingshonline-lawyerinfo' }
      ]
    }
  },
  async asyncData({ params }) {
    const [LawyerResumeData, LawyerInformation, CourtData, PracticData, NoPracticData, industryData, practiceareaData, courtListData] = await Promise.all([
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/customer/lawyer/resume/get`, { params: { lawyerId: params.id }}, { 'Content-Type': 'application/json' }), // 简历
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/customer/lawyer/get/${params.id}`, { 'Content-Type': 'application/json' }), // 律师详情
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/customer/case/frequent/region/court/${params.id}`, { 'Content-Type': 'application/json' }), // 常去法院
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/customer/case/frequent/chart/practicearea/${params.id}`, { params: { caseType: 1 }}, { 'Content-Type': 'application/json' }), // 诉讼领域
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/customer/case/frequent/chart/practicearea/${params.id}`, { params: { caseType: 2 }}, { 'Content-Type': 'application/json' }), // 非诉领域
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/industry/tree`, { 'Content-Type': 'application/json' }), // 行业
      axios.get(`${process.env.baseUrl}/${setting.apiPrefix}/practicearea/tree`, { 'Content-Type': 'application/json' }), // 领域
      axios.post(`${process.env.baseUrl}/${setting.apiPrefix}/court/list`, { query: {}}, { 'Content-Type': 'application/json' }) // 法院
    ])
    // 律师基础信息数据容错
    let lawyerInformationData = {}
    if (LawyerInformation.data.data) {
      lawyerInformationData = LawyerInformation.data.data
    }
    // 律师业务专长数据容错
    let lawyerBusiness = []
    if (lawyerInformationData.practiceareas && lawyerInformationData.practiceareas.length) {
      lawyerBusiness = LawyerInformation.data.data.practiceareas.map(item => {
        return item.name
      }).concat(LawyerInformation.data.data.industries.map(item => {
        return item.name
      }))
    }
    // 律师业务专长排序
    lawyerBusiness.sort(function(a, b) {
      return a.length - b.length
    })
    // 律师简历信息数据容错
    const resumeData = {}
    if (LawyerResumeData.data.data) {
      const resumeInfo = LawyerResumeData.data.data
      if (resumeInfo.workExperiences) {
        resumeInfo.workExperiences.forEach(item => {
          item.startDate = moment(item.startDate).format('YYYY.MM')
          item.endDate = moment(item.endDate).format('YYYY.MM')
        })
        resumeData.workExperiences = resumeInfo.workExperiences
      }
      if (resumeInfo.socialPositions) {
        resumeData.socialPositions = resumeInfo.socialPositions
      }
      if (resumeInfo.educations) {
        resumeInfo.educations.forEach(item => {
          item.startDate = moment(item.startDate).format('YYYY.MM')
          item.endDate = moment(item.endDate).format('YYYY.MM')
        })
        resumeData.educations = resumeInfo.educations
      }
      if (resumeInfo.certificates) {
        resumeData.certificates = resumeInfo.certificates
      }
      if (resumeInfo.academics) {
        resumeData.academics = resumeInfo.academics
      }
    }
    // 律师常去法院数据容错
    let courtData = []
    if (CourtData.data.data && CourtData.data.data.length) {
      courtData = CourtData.data.data
    }
    // 图表数据容错
    const chartData = {}
    if (PracticData.data.data) {
      chartData.practicea = PracticData.data.data
    }
    if (NoPracticData.data.data) {
      chartData.noPracticea = NoPracticData.data.data
    }
    return {
      // 律师简历数据
      resumeData,
      // 律师基本信息
      lawyerInformation: lawyerInformationData,
      // 律师常去法院数据
      courtData,
      // 律师业务专长
      lawyerBusiness,
      // 图表数据
      chartData,
      // 行业
      industryDataList: utils.formatTreeDataForAntd(industryData.data.data),
      // 领域
      practiceareaDataList: utils.formatTreeDataForAntd(practiceareaData.data.data),
      // 法院数据
      courtListData: courtListData.data.data
    }
  },
  data() {
    return {
      // 律师履历信息
      resumeData: {
        workExperiences: [],
        socialPositions: [],
        educations: [],
        certificates: [],
        academics: []
      },
      // 律师基本信息
      lawyerInformation: {
        id: 0, // 律师Id
        realName: '', // 真实姓名
        email: '', // 邮箱
        phone: '', // 律师电话 缺少返回信息
        lawfirmName: '', // 律所
        avatarPathId: null, // 头像路径Id
        avatar: '', // 头像路径
        sex: 0, // 性别 0女 1 男
        licenceNo: '', // 执业证号
        licenceDate: '', // 颁发执业证日期 2019-12-30 09:34:20
        isShowExperience: false, // 是否显示工作年限
        experienceYear: '', // 从业年限
        isRecommend: true, // 是否为推荐律师
        isDirector: true, // 是否为主任律师
        regionName: '', // 地区 天津-和平区
        highestDegree: '', // 最高学位
        status: 0, // 律师是否审核
        followerCount: 0, // 关注人数（关注度）
        clickCount: 0, // 律师浏览量
        caseCount: 0, // 案例总数
        lastModificationTime: '', // 最后更新时间 2019-12-30 09:34:20
        practiceareas: [], // 律师擅长领域 [{knowledgeId:领域/行业Id,name:领域/行业名称,caseCount:案例数}]
        industries: [] // 律师擅长行业 [{knowledgeId:领域/行业Id,name:领域/行业名称,caseCount:案例数}]
      },
      courtData: [],
      regionData: [],
      lawyerBusiness: [],
      chartData: [],
      industryDataList: [],
      practiceareaDataList: [],
      courtList: [],
      shareUrl: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path !== '/') {
      next(vm => {
        const lawyerId = vm.$route.params.id
        vm.LawyerClickCount(lawyerId).then(res => {})
      })
    } else {
      next()
    }
  },
  mounted() {
    this.shareUrl = window.location.href
  },
  methods: {
    ...mapActions('lawyer', ['LawyerClickCount'])
  }
}
</script>

<style lang="scss" scoped>
.lawyer-info-container {
  min-width: 1376px;
  max-width: 1376px;
  margin: 0 auto;
  background: #f2f2f2;
  overflow: hidden;
  .lawyer-info-card {
    background: #fff;
    float: left;
    position: relative;
    width: 314px;
    border: 2px solid #f1f1f1;
    padding: 18px 0 18px 18px;
    height: auto;
    box-sizing: border-box;
    margin-right: 16px;
    .lawyer-isAuthentication {
      position: absolute;
      width: 54px;
      height: 54px;
      background-image: url("../../../assets/lawyerinfo/isAuthentication.png");
      background-size: 100% 100%;
      top: 0;
      right: 0;
    }
    .lawyer-info-top{
      padding-bottom: 16px;
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
      .lawyer-info-picture {
        display: block;
        width: 128px;
        height: 162px;
        box-sizing: border-box;
        padding: 2px;
        border: 1px solid #d7d7d7;
        margin-right: 20px;
      img {
        display: block;
        width: 122px;
        height: 156px;
      }
      }
    .lawyer-info-detail {
        font-size: 12px;
        box-sizing: border-box;
      .lawyer-name {
        font-size: 24px;
        margin: 30px 0 20px 0 !important;
      }
      .lawyer-year {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 7px !important;
        span {
          margin-right: 11px;
          padding: 3px 9px;
          color: #fff;
          background: #f68020;
        }
      }
      .lawyer-id,.lawyer-time {
        color: #666666;
        line-height: 24px;
      }
    }
    }
    .lawyer-information {
      h4 {
        margin-top: 13px !important;
        font-size: 16px;
        color: #333;
        padding-bottom: 9px;
        border-bottom: 1px dashed #ececec;
        margin-bottom: 17px !important;
      }
      ul li {
        overflow: hidden;
        list-style: none;
        font-size: 14px;
        line-height: 16px;
        color: #333;
        margin-bottom: 27px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        span {
          width: 58px;
          display: inline-block;
          color: #dbdbdb;
          margin-right: 19px;
        }
      }
      .lawyer-business {
        display: flex;
        flex-wrap: wrap;
        li {
          border: 1px solid #ddd;
          border-radius: 5%;
          margin: 0 20px 14px 0;
          padding: 0 14px;
          line-height: 26px;
          a {
            text-decoration: none;
            color: #666666;
          }
        }
      }
    }
  }
}
</style>
