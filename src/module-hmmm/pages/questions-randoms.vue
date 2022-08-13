<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 搜索按钮部分 -->
      <el-row type="flex" align="center">
        <el-col class="search-top">
          <span>关键字:</span>
          <el-input
            placeholder="根据编号搜索(范建明)"
            class="search-input"
          ></el-input>
        </el-col>
        <el-col>
          <el-row justify="end" type="flex">
            <el-button size="small">清除</el-button>
            <el-button size="small" type="primary">搜索</el-button>
          </el-row>
        </el-col>
      </el-row>
      <!-- 提示框 -->
      <el-alert type="info" show-icon :closable="false" class="prompt">
        <template #title>
          <span
            >数据一共 <i>{{ count }}</i> 条</span
          >
        </template>
      </el-alert>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="编号"> </el-table-column>
        <el-table-column
          prop="questionType"
          :formatter="formatterQuestionType"
          label="题型"
        >
        </el-table-column>
        <el-table-column label="题目编号">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.questionIDs"
              :key="index"
              class="number"
            >
              {{ item.number }} <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="录入时间"></el-table-column>
        <el-table-column prop="totalSeconds" label="答题时间(s)">
        </el-table-column>
        <el-table-column
          prop="accuracyRate"
          label="正确率(%)"
        ></el-table-column>
        <el-table-column prop="userName" label="录入人"></el-table-column>
        <el-table-column prop="address" label="操作">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="delBtn"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" class="button-row">
        <el-col></el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-pagination
              background
              layout="prev, pager, next, sizes, jumper"
              :total="count"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pagesize"
              :current-page="page"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { randoms } from "../../api/hmmm/questions";
import { questionType } from "../../api/hmmm/constants.js";
export default {
  name: "QuestionsRandoms",
  data() {
    return {
      tableData: [],
      list: {},
      count: 0,
      questionType, // 题型
      page: 1, //当前页数
      pagesize: 20, //一页显示条数
      keyword: "", //关键字
    };
  },
  methods: {
    async getRandoms() {
      const {
        data: { counts, items },
      } = await randoms({
        page: this.page,
        pagesize: this.pagesize,
        keyword: this.keyword,
      });
      this.tableData = items;
      this.count = counts;
    },
    formatterQuestionType(row, column, cellValue, index) {
      const findQuestionType = questionType.find(
        (item) => item.value == cellValue
      );
      return findQuestionType ? findQuestionType.label : "打野";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRandoms();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getRandoms();
    },
  },
  created() {
    this.getRandoms();
  },
};
</script>

<style scoped lang="scss">
.container {
  .box-card {
    //搜索按钮部分
    .search-top {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 80px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-weight: 600;
      }
      ::v-deep .el-input__inner {
        width: 292px;
        height: 32px;
        line-height: 32px;
      }
    }
    //提示框
    .prompt {
      margin-top: 16px;
    }
    .delBtn {
      padding: 7px;
      color: #f56c6c;
      background-color: #fef0f0;
      border-color: #fbc4c4;
    }
    .delBtn:hover {
      background: #f56c6c;
      border-color: #f56c6c;
      color: #fff;
    }
    .number {
      color: rgb(0, 153, 255);
      cursor: pointer;
    }
    //分页
    .button-row {
      margin-top: 20px;
      ::v-deep .el-pagination span:not([class*="suffix"]) {
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        vertical-align: top;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-right: -10px;
      }
    }
  }
}
</style>
