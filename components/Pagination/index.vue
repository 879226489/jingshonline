<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  text-align: center;
  &.hidden{
   display: none;
  }
}
</style>
<style lang="scss">
.el-pagination{
  font-weight: 400;
  &.is-background{
    .el-pager{
      li:not(.disabled){
        &.active{
          background-color: #F68020;
        }
        &:hover{
          color: #f68020;
        }
      }
    }
  }
}
.el-select-dropdown__item{
  &.selected{
    color: #F68020;
  }
}
.el-pagination__sizes,.el-pagination__jump{
  .el-input{
    &.is-focus,&:hover,&:focus{
      .el-input__inner{
        border-color: #F68020;
      }
    }

  }
}

</style>
