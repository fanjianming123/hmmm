<template>
  <el-card class="box-card">
    <el-row>
      <!-- 头部搜索 -->
      <el-col>
        <el-row type="flex">
          <el-col>
            <el-input
              v-model="RoleName"
              placeholder="根据用户名搜索"
              style="width: 200px; margin-right: 15px"
            ></el-input>
            <el-button size="small">清除</el-button>
            <el-button size="small" type="primary">搜索</el-button>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <el-button size="small" icon="el-icon-edit" type="success"
                >新增权限组</el-button
              >
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <!-- 消息提示 -->
      <el-col style="margin: 20px 0"
        ><el-alert title="共3条记录" type="info" show-icon :closable="false">
        </el-alert
      ></el-col>
      <!-- 表格区域 -->
      <el-col>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="400"></el-table-column>
          <el-table-column label="用户名">
            <template slot-scope="scope">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column
            prop="create_date"
            label="日期"
            :formatter="formatterTime"
          >
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="120">
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
        <!-- 分页 -->
        <div class="footer-page">
          <page></page>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import page from "../components/page-tool.vue";
import { list } from "@/api/base/permissions.js";
import dayjs from "dayjs";
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
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      RoleName: "",
      pages: {
        page: 1,
        pagesize: 10,
      },
    };
  },
  components: {
    page, //分页
    // user, //新增弹层
  },
  created() {
    this.getpermissions();
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async getpermissions() {
      const { data } = await list(this.pages);
      this.tableData = data.list;
      console.log(data);
    },
    formatterTime(row, column, cellValue, index) {
      return dayjs(cellValue).format("YYYY-MM-DD");
    },
  },
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
.footer-page {
  display: flex;
  justify-content: end;
  margin: 20px 0;
}
</style>
