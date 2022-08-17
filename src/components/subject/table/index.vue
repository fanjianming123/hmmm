<template>
  <div class="table-container">
    <el-alert
      :title="'数据一共' + counts + '条'"
      type="info"
      show-icon
      :closable="false"
      style="margin-bottom: 15px"
    >
    </el-alert>
    <el-table :data="items" style="width: 100%" v-loading="loading">
      <!-- 序号列-->
      <el-table-column label="序号" type="index" :index="tableIndex" width="80">
      </el-table-column>
      <!-- 中间循环的列 -->
      <el-table-column
        :prop="item.value"
        :label="item.label"
        v-for="item in NavList"
        :key="item.value"
      >
        <template slot-scope="{ row }">
          <span v-if="item.label === '创建日期'">{{
            row[item.value] | formatTime
          }}</span>

          <span v-else-if="item.label === '前台是否显示'"
            >{{ ['否', '是'][row[item.value]] }}
          </span>
          <span v-else-if="item.label === '录入时间'">{{
            row[item.value] | formatTime
          }}</span>
          <span v-else-if="item.label === '状态'">{{
            ['已禁用', '已启用'][row[item.value]]
          }}</span>
          <span v-else>{{ row[item.value] }}</span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" width="240">
        <template slot-scope="{ row }">
          <slot :data="row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" style="margin-top: 20px">
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagesize"
        layout="  prev, pager, next, sizes, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      loading: true
    }
  },

  created() {},
  props: {
    counts: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    pagesize: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default: () => []
    },
    NavList: {
      type: Array,
      default: () => []
    },
    subjectID: {
      type: Number,
      default: null
    }
  },

  computed: {
    tableIndex() {
      return this.pagesize * (this.page - 1) + 1
    }
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.$emit('sizeChange', val)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.$emit('pageChange', val)
    }
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(val) {
        console.log(this.subjectID)
        console.log(val.length)
        if (val.length > 0 && this.subjectID === null) {
          this.loading = false
        } else if (this.subjectID !== null) {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-table--enable-row-transition .el-table__body td.el-table__cell {
  height: 57px;
}
</style>
