<template>
  <div class="lawyer-case">
    <!-- ↓↓↓↓↓↓↓↓↓↓↓ 勿删！勿删！勿删！勿删！勿删！  没有任何作用且页面不显示。防止  antdv tree-select option 定位跑偏    勿删！勿删！勿删！勿删！勿删！ ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
    <a-tree-select
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      show-search
      allow-clear
      style="width: 100%;display:none;"
      tree-node-filter-prop="title"
      placeholder="请选择"
    />
    <!-- ↑↑↑↑↑↑↑↑↑↑↑ 勿删！勿删！勿删！勿删！勿删！  没有任何作用且页面不显示。防止  antdv tree-select option 定位跑偏    勿删！勿删！勿删！勿删！勿删！ ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ -->
    <div class="lawyer-case-select">
      <div class="lawyer-case-item">
        <p>管辖法院 :</p>
        <el-select
          v-model="caseListParam.courtId"
          placeholder="请选择"
          filterable
          clearable
          popper-class="lawyer-court"
        >
          <el-option
            v-for="item in courtListData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :title="item.name"
          />
        </el-select>
      </div>
      <div class="lawyer-case-item">
        <p>所属行业 :</p>
        <a-tree-select
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="industryDataList"
          v-model="caseListParam.industryId"
          show-search
          style="width: 280px"
          allow-clear
          tree-node-filter-prop="title"
          placeholder="请选择"
        />
      </div>
      <div class="lawyer-case-item">
        <p>所属领域 :</p>
        <a-tree-select
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="practiceareaDataList"
          v-model="caseListParam.practiceAreaId"
          show-search
          style="width: 280px"
          allow-clear
          tree-node-filter-prop="title"
          placeholder="请选择"
        />
      </div>
    </div>
    <div class="lawyer-case-filter">
      <span :class="activeIndex === 1 ? 'filter-active' : ''" @click="filterChange('updatetime')">更新时间</span>
      <span :class="activeIndex === 2 ? 'filter-active' : ''" @click="filterChange('clickcount')">访问人数</span>
      <span :class="activeIndex === 3 ? 'filter-active' : ''" @click="filterChange('followerCount')">收藏数量</span>
      <i/>
    </div>
    <div v-if="lawyerCaseList.length" class="lawyer-case-list">
      <div v-for="(item,index) in lawyerCaseList" :key="index" class="lawyer-case-list-item">
        <nuxt-link :to="'/case/'+item.id+'/info'">
          <div v-if="item.highlight.title" class="case-item-title">{{ item.highlight.title[0] }}</div>
          <div class="case-info">
            <div>
              <p v-if="item.caseType !== 2"><span><i class="el-icon-caret-right"/>管辖法院 : {{ item.courtName ? item.courtName :'暂无数据' }}</span></p>
              <p v-if="item.caseType !== 1"><span><i class="el-icon-caret-right"/>所属行业 : {{ item.industryName ? item.industryName:'暂无数据' }}</span></p>
            </div>
            <div>
              <p v-if="item.caseType !== 2"><span><i class="el-icon-caret-right"/>所属案由 : {{ item.caseReasonName?item.caseReasonName:'暂无数据' }}</span></p>
              <p><span><i class="el-icon-caret-right"/>所属领域 : {{ item.practiceAreaName?item.practiceAreaName:'暂无数据' }}</span></p>
            </div>
          </div>
          <div class="case-item-article">
            <div>
              <p class="title">【法院观点】</p>
              <span class="text" v-text="'暂无数据'"/>
            </div>
            <div>
              <p class="title">【结果命中】</p>
              <span class="text" v-html="item.highlight.judgmentDocument ? item.highlight.judgmentDocument[0] : '暂无数据'"/>
            </div>
          </div>
          <div class="case-item-bottom">
            <span v-if="item.judgmentNumber && item.caseType !== 2" class="judgement-number">{{ item.judgmentNumber	}}</span>
            <span class="case-time"><i class="el-icon-time"/>{{ item.updateTime }}</span>
            <span class="collect no-select" @click.prevent="userCollect(index)"><i :class="item.isFollow ? 'el-icon-star-on' : 'el-icon-star-off'" v-text="item.isFollow? '已收藏' : '收藏'"/></span>
            <!-- <span class="share no-select" @click.prevent="share(item.id)"><i/>分享</span> -->
          </div>
          <i v-if="item.isClassicCase" class="classic"/>
        </nuxt-link>
      </div>
    </div>
    <div v-else class="no-data">
      暂无相关案例
    </div>
    <Pagination v-show="totalCount>0" :total="totalCount" :page="caseListParam.pageIndex" :limit="caseListParam.pageCount" @pagination="handlePageChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { mapActions } from 'vuex'
import ElTreeSelect from '@/components/ElTree/index'
export default {
  name: 'LawyerCase',
  components: {
    Pagination,
    ElTreeSelect
  },
  props: {
    industryDataList: {
      type: Array,
      default: function() {
        return []
      }
    },
    practiceareaDataList: {
      type: Array,
      default: function() {
        return []
      }
    },
    courtListData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      // 认证案例列表
      lawyerCaseList: [],
      // 筛选条件高亮
      activeIndex: 1,
      // 分页器
      totalCount: 0,
      // 获取认证案例所需参数
      caseListParam: {
        practiceAreaId: undefined, // 领域Id number 【诉讼领域,非诉讼领域】
        searchKey: '', // 搜索关键字: 支持(当事人、律师、专业领域、案由、法院、律所、裁判文书关键字) string
        courtLevel: undefined, // 法院等级 number
        courtReginId: undefined, // 法院所属区域 nmuber || arr
        courtId: undefined, // 法院Id number
        caseReasonId: undefined, // 案由Id number
        lawyerId: this.$route.params.id, // 律师Id number
        industryId: null, // 行业id 暂无检索条件
        sorting: '', // 排序
        sortType: 0, // 排序类型
        pageCount: 5, // 页目条数 number
        pageIndex: 1// 页码 number
      }
    }
  },
  watch: {
    // 监听检索条件
    caseListParam: {
      deep: true,
      handler(val) {
        this.getLawyerCaseList(val)
      }
    }
  },
  mounted() {
    this.getLawyerCaseList(this.caseListParam)
  },
  methods: {
    ...mapActions('case', ['getCaseListData', 'caseFollowClick', 'caseUnfollowClick']),
    ...mapActions('region', ['getCourtRegionsData', 'getCourtRegionsChildData']),
    // 获取认证案例列表
    getLawyerCaseList(query) {
      this.getCaseListData(query).then(res => {
        if (res !== null) {
          this.totalCount = res.totalCount
          res.items.forEach(item => {
            item.updateTime = this.$moment(item.updateTime).format('YYYY-MM-DD')
          })
          this.lawyerCaseList = res.items
        }
      })
    },
    // 改变排序状态
    filterChange(type) {
      if (type === 'updatetime') {
        this.activeIndex = 1
        this.caseListParam.sorting = 'updatetime'
      }
      if (type === 'clickcount') {
        this.activeIndex = 2
        this.caseListParam.sorting = 'clickcount'
      }
      if (type === 'followerCount') {
        this.activeIndex = 3
        this.caseListParam.sorting = 'followerCount'
      }
    },
    // 翻页操作
    handlePageChange(val) {
      this.caseListParam.pageIndex = val.page
      this.caseListParam.pageCount = val.limit
    },
    // 用户收藏
    userCollect(index) {
      const caseIndex = this.lawyerCaseList[index]
      if (caseIndex.isFollow) {
        this.caseUnfollowClick(caseIndex.id).then(res => {
          this.$notify({
            message: `取消收藏案例 : ${this.lawyerCaseList[index].title}`,
            duration: 2000
          })
          this.lawyerCaseList[index].isFollow = !this.lawyerCaseList[index].isFollow
        })
      } else {
        this.caseFollowClick(caseIndex.id).then(res => {
          this.$notify({
            message: `收藏案例 : ${this.lawyerCaseList[index].title}`,
            duration: 2000
          })
          this.lawyerCaseList[index].isFollow = !this.lawyerCaseList[index].isFollow
        })
      }
    }
  }
}
</script>

<style lang="scss">
.no-select{
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently not supported by any browser */
}
.lawyer-case{
  padding-bottom: 24px;
  min-height: 412px;
  .pagination-container {
    background: #f2f2f2;
  }
  .lawyer-case-select{
    background: #fff;
    padding-top: 25px;
    padding-left: 38px;
    padding-bottom: 25px;
    border: 1px solid #eee;
    border-top: none;
    display: flex;
    justify-content: flex-start;
    line-height: 28px;
    p {
      margin-bottom: 6px;
    }
    .lawyer-case-item {
      margin-right: 60px;
      color: #333333;
      .el-input__inner,.ant-select-selection {
        width: 280px;
        height: 30px;
        line-height: 28px;
        outline: none;
        border: 1px solid #e7edf1;
        border-radius: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-input__icon {
        // color: #fff;
        position: absolute;
        right: -5px;
        top: 1.2px;
        transition: none;
        width:30px;
        height:30px;
        line-height:30px;
        background:rgba(204,204,204,1);
      }
      .el-icon-arrow-up:before{
        color: #fff;
        font-size: 16px;
      }
      .el-icon-circle-close{
        font-size: 16px;
        color: #fff;
      }
      .ant-select-arrow{
        width: 30px;
        height: 30px;
        top: 6px;
        right: 0;
        background: #ccc;
        .ant-select-arrow-icon{
          line-height: 30px;
          color: #fff;
          font-size: 16px;
        }

      }
    }
  }
  .lawyer-case-filter {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    color: #999999;
    padding-left: 12px;
    position: relative;
    .filter-active {
      color:#f68020;
    }
    i{
      position: absolute;
      width: 147px;
      height: 20px;
      background-image: url("../../../../assets/lawyerinfo/jinsh.png");
      background-repeat: no-repeat;
      block-size: 100% 100%;
      right: 18px;
      top: 18px;
    }
    span {
      cursor: pointer;
      margin-right: 40px;
    }
  }
  .lawyer-case-list {
    margin-bottom: 24px;
    .lawyer-case-list-item {
      background: #fff;
      cursor: pointer;
      height: auto;
      border-width: 1px 1px 1px 3px;
      border-style: solid;
      border-color:#eee #eee #eee #c5c5c5;
      position: relative;
      margin-bottom: 16px;
      .case-item-title {
        padding-left: 24px;
        padding-right: 28px;
        font-size: 16px;
        color: #333333;
        line-height: 28px;
        margin-top: 30px;
        position: relative;
        overflow: hidden;
        span{
          position: absolute;
          right: 28px;
        }
      }
      .case-info {
        margin-top: 7px;
        color:#737373;
        font-size: 14px;
        padding-left: 48px;
        box-sizing: border-box;
        display: flex;
        div {
          margin-right: 60px;
        }
        .el-icon-caret-right{
          color: #999999;
        }
        p {
          line-height: 28px;
        }
      }
      .case-item-article {
        padding-left: 24px;
        padding-right: 28px;
        font-size: 14px;
        line-height: 24px;
        color: #333;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        .title{
          margin-top: 2px !important;
          margin-bottom: 7px !important;
        }
        .text{
          overflow: hidden;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          box-orient: vertical;
          display: -webkit-box;
          margin-bottom: 11px;
        }
      }
      .case-item-bottom {
        left: 2px;
        bottom: -3px;
        width:100%;
        height: 29px;
        background: #fbfbfb;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span {
          line-height: 29px;
          font-size: 12px;
          color: #333333;
          cursor: pointer;
        }
        .judgement-number {
          color: #949494;
          margin-right: 28px;
        }
        .case-time {
          margin-right: 15px;
          .el-icon-time{
            color: #828282;
            margin-right: 5px;
          }
        }
        .collect {
          width: 60px;
          text-align: center;
          user-select: none;
          margin-right: 25px;
          .el-icon-star-off:before {
            margin-right: 6px;
          }
          .el-icon-star-on:before {
            margin-right: 6px;
            color: #f68020
          }
          i {
            display: inline-block;
            margin-right: 6px;
            vertical-align: -1px;
          }
        }
        .share {
        i {
            display: inline-block;
            width: 12px;
            height: 12px;
            background-image: url("../../../../assets/lawyerinfo/share.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-right: 6px;
            vertical-align: -1px;
        }
      }
      }
      .classic {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 49px;
        height: 49px;
        background-image: url("../../../../assets/lawyerinfo/classic.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .lawyer-case-list-item:hover {
      border-color:#eee #eee #eee #f68020;
    }
  }
    /* 分享 */
  .share{
    div{
      margin-top: 5px;
      text-align: right;
    }
    img{
      width: 100px;
    }
  }
  .no-data{
    margin-top: 100px;
    text-align: center;
    font-size: 32px;
  }
}
.lawyer-court{
  width: 280px;
}
</style>
