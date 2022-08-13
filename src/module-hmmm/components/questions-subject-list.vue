<template>
  <div>
    <el-alert
      :title="`数据一共${dataName}条`"
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
          <span v-else>
            {{ row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dataName: {
      type: Number,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    tableDataHeade: {
      type: Array,
      required: true,
    },
  },
  created() {},

  methods: {},
};
</script>

<style scoped lang="scss">
::v-deep .el-table_1_column_5 .el-table__cell {
  .cell {
    width: 280px !important;
  }
}
</style>
