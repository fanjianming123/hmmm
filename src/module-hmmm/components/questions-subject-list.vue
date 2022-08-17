<template>
  <div>
    <el-alert
      :title="`数据一共${total}条`"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :prop="item.value"
        :label="item.label"
        v-for="item in tableDataHeade"
        :key="item.label"
        :width="tabelWidth(item.label)"
      >
        <template slot-scope="{ row }">
          <span v-if="item.label === '题型'">
            {{ row[item.value] | questionTypeFilter }}
          </span>
          <span v-else-if="item.label === '题干'">
            {{ row[item.value] | questionFilter }}
          </span>
          <span v-else-if="item.label === '录入时间'">
            {{ row[item.value] | addDateFilter }}
          </span>
          <span v-else-if="item.label === '难度'">
            {{ row[item.value] | difficultyFilter }}
          </span>
          <span v-else-if="item.label === '审核状态'">
            {{ row[item.value] | chkStateFilter }}
          </span>
          <span v-else-if="item.label === '发布状态'">
            {{ row[item.value] | chkStateFilter }}
          </span>
          <span v-else>
            {{ row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'subjectList',
  data() {
    return {}
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    tableDataHeade: {
      type: Array,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    }
  },
  created() {},
  computed: {
    tabelWidth() {
      return function (val) {
        switch (val) {
          case '题干':
            return 280
          case '录入时间':
            return 180
          case '录入人':
            return 103
          case '审核人':
            return 103
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('update:pageSize', val)
      this.$emit('update:page', 1)
      this.$emit('updataList')
    },
    handleCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('updataList')
    }
  }
}
</script>

<style scoped lang="scss">
// ::v-deep .el-table_1_column_5 .el-table__cell {
//   .cell {
//     width: 280px !important;
//   }
// }
// ::v-deep .el-table .el-table__cell .cell {
//   min-width: 120px;
// }
</style>
