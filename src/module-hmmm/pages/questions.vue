<template>
  <el-card class="box-card">
    <SearchTop ></SearchTop>
    <SubjuctList
      :dataName="dataName"
      :tableData="tableData"
      :tableDataHeade="tableDataHeade"
    >
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            circle
            type="primary"
            plain
            size="small"
            @click="previewFn(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-edit"
            circle
            type="success"
            plain
            size="small"
            @click="previewFn(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            circle
            type="danger"
            plain
            size="small"
            @click="previewFn(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-check"
            circle
            type="warning"
            plain
            size="small"
            @click="previewFn(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </SubjuctList>
  </el-card>
</template>

<script>
import SearchTop from "../components/questions-subject-search.vue";
import SubjuctList from "../components/questions-subject-list.vue";
import { list } from "@/api/hmmm/questions.js";

export default {
  data() {
    return {
      tableDataHeade: [
        { label: "试题编号", value: "number" },
        { label: "学科", value: "subject" },
        { label: "目录", value: "catalog" },
        { label: "题型", value: "questionType" },
        { label: "题干", value: "question" },
        { label: "录入时间", value: "addDate" },
        { label: "难度", value: "difficulty" },
        { label: "录入人", value: "creator" },
      ],
      tableData: [],
      dataName: 0,
    };
  },
  components: {
    SearchTop,
    SubjuctList,
  },
  created() {
    this.getQuestionsList();
  },
  methods: {
    async getQuestionsList() {
      const { data } = await list();
      console.log(data);
      this.dataName = data.counts;
      this.tableData = data.items;
    },
    previewFn() {},
  },
};
</script>

<style scoped lang="less"></style>
