<template>
  <el-card class="box-card">
    <el-row>
      <el-col style="margin-bottom:20px;">
        <el-row type="flex" justify="end">
          <el-button size="small" icon="el-icon-edit" type="success"
            >新增权限组</el-button
          >
        </el-row>
      </el-col>
      <!-- 表单区域 -->
      <el-col>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="标题" >
          </el-table-column>
          <el-table-column prop="name" label="权限点代码" >
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template
              ><el-button
                class="edit-btn"
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                class="delete-btn"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },

  created() {},

  methods: {},
};
</script>

<style scoped lang="less">
.edit-btn {
  background-color: #ecf5ff;
  color: #71a7ff;
  border: 1px solid #d3e8ff;
}
.delete-btn {
  background-color: #fef0f0;
  color: #f6827f;
  border: 1px solid #fcd5d5;
}
</style>
