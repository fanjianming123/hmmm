<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 搜索按钮部分 -->
      <el-row type="flex" align="center" style="height: 32px">
        <el-col class="search-top">
          <span>关键字:</span>
          <el-input
            placeholder="根据编号搜索(范建明)"
            v-model.trim="keyword"
            class="search-input"
          ></el-input>
        </el-col>
        <el-col>
          <el-row justify="end" type="flex" style="height: 32px">
            <el-button size="small" @click="keywordFn">清除</el-button>
            <el-button
              size="small"
              type="primary"
              @click="searchGetRandoms"
              v-loading="loading"
            >
              搜索
            </el-button>
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
              @click="questionFn(item)"
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
          <template slot-scope="{ row }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              class="delBtn"
              @click="delRandoms(row)"
            ></el-button>
          </template>
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
    <!-- 题目编号详情弹窗 -->
    <!-- 预览弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="题目预览">
      <el-row>
        <el-col :span="6">
          【题型】：
          {{ list.questionType | questionType }}
        </el-col>
        <el-col :span="6">【编号】：{{ list.id }}</el-col>
        <el-col :span="6">【难度】：{{ list.difficulty | difficulty }}</el-col>
        <el-col :span="6">【标签】：{{ list.tags }}</el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">【学科】：{{ list.subjectName }}</el-col>
        <el-col :span="6">【目录】：{{ list.directoryName }}</el-col>
        <el-col :span="6">【方向】：{{ list.direction }}</el-col>
        <el-col :span="6"><div></div></el-col>
      </el-row>
      <el-divider></el-divider>
      <div>
        <div class="margin">【题干】：</div>
        <div class="margin" style="color: #4242ff" v-html="list.question"></div>
        <div class="margin">
          <div
            class="margin"
            v-if="list.questionType == 1 || list.questionType == 2"
          >
            <p>
              {{ list.questionType | difficulty }}
              选项:（以下选中的选项为正确答案）
            </p>
            <!-- 单选 -->
            <el-radio-group v-model="radio" v-if="list.questionType == 1">
              <div v-for="item in list.options" :key="item.id">
                <el-radio :disabled="item.isRight == 0" :label="item.isRight">
                  {{ item.title }}
                </el-radio>
              </div>
            </el-radio-group>
            <!-- 复选框组 -->
            <el-checkbox-group
              v-model="checkList"
              v-else-if="list.questionType == 2"
            >
              <div v-for="item in list.options" :key="item.id">
                <el-checkbox
                  :label="item.isRight"
                  :disabled="item.isRight == 0"
                >
                  {{ item.title }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>

          <!-- 简答 -->
          <div v-else>
            {{ list.tags }}
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <p>
        【参考答案】：<el-button
          type="danger"
          size="small"
          @click="showVideo = true"
          >视频答案预览</el-button
        >
      </p>
      <video
        controls="controls"
        v-if="showVideo"
        :src="list.videoURL || 'https://v-cdn.zjol.com.cn/277004.mp4'"
      ></video>
      <el-divider></el-divider>
      <el-row class="aaa">
        <el-col :span="3">【答案解析】：</el-col>
        <el-col v-html="list.answer" :span="21">{{ list.answer }}</el-col>
      </el-row>
      <el-divider></el-divider>
      <p>【题目备注】：{{ list.remarks }}</p>
      <template #footer>
        <el-button type="primary" @click="onclose">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { randoms, removeRandoms } from "../../api/hmmm/questions";
import { questionType } from "../../api/hmmm/constants.js";
import { detail } from "../../api/hmmm/questions";
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
      list: [], //基础题库与精选题库集合
      dialogVisible: false,
      showVideo: false,
      radio: 1,
      checkList: ["选中且禁用", 1],
      loading: false,
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
    async searchGetRandoms() {
      this.loading = true;
      await randoms({
        page: 1,
        pagesize: 10,
        keyword: this.keyword,
      });
      this.page = 1;
      this.getRandoms();
      this.loading = false;
    },
    async delRandoms(row) {
      this.$confirm("此操作将永久删除该题组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await removeRandoms(row);
        this.$message.success("删除成功");
        this.getRandoms();
      });
    },
    async questionFn(row) {
      this.dialogVisible = true;
      const { data } = await detail(row);
      console.log(data);
      this.list = data;
    },
    onclose() {
      this.dialogVisible = false;
      this.list = [];
    },
    keywordFn() {
      this.keyword = "";
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
.options {
  display: flex;
  flex-direction: column;
}
.title {
  margin: 10px 0;
}
.problem {
  color: blue;
}
.aaa {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
