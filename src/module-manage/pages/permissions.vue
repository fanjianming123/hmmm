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
              @keyup.enter.native="enterSearch"
            ></el-input>
            <el-button size="small" @click="clearInput">清除</el-button>
            <el-button size="small" type="primary" @click="searchName"
              >搜索</el-button
            >
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
            sortable
            label="日期"
            :formatter="formatterTime"
          >
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="120">
            <template slot-scope="{ row }"
              ><el-button
                class="edit-btn"
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="removeCurrent(row)"
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
          <page
            :total="counts"
            :paginationPage="page"
            :paginationPagesize="pagesize"
            @pageChange="pageChange"
            @pageSizeChange="pageSizeChange"
          ></page>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import page from "../components/page-tool.vue";
import { list, remove } from "@/api/base/permissions.js";
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
        pagesize: 10, //发送
      },
      counts: "", //总条数
      page: "", //当前页 传给子组件
      pagesize: "", //每页显示的条数 传给子组件
    };
  },
  components: {
    page, //分页
    // user, //新增弹层
  },
  created() {
    this.getpermissions(this.pages);
  },

  methods: {
    handleSelectionChange(val) {
      console.log(val); // 选中获得当前项  复选框
    },
    //获取列表数据
    async getpermissions(params) {
      const { data } = await list(params);
      this.tableData = data.list;
      this.counts = data.counts;
      this.page = data.page;
      this.pagesize = data.pagesize;
      // console.log(data);
    },
    //搜索名字
    searchName() {
      const data = {
        page: this.pages.page,
        pagesize: this.pages.pagesize,
        title: this.RoleName,
      };
      this.getpermissions(data);
    },
    // 删除input框
    clearInput() {
      this.RoleName = "";
      this.getpermissions(this.pages);
    },
    // 删除当前项
    removeCurrent(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getpermissions(this.pages);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 回车搜索
    enterSearch() {
      this.searchName();
    },
    // 过滤时间
    formatterTime(row, column, cellValue, index) {
      return dayjs(cellValue).format("YYYY-MM-DD");
    },
    // 更新pege
    pageChange(val) {
      this.pages.page = val;
      this.getpermissions(this.pages);
    },
    //更新pegeSize
    pageSizeChange(val) {
      this.pages.pagesize = val;
      this.getpermissions(this.pages);
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
