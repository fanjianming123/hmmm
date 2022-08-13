<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col>
        <span style="font-size: 12px; color: pink"
          >说明：目前支持学科和关键字条件筛选</span
        >
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <el-button type="success" size="small">
            <i class="el-icon-edit"></i>
            <span>新增试题</span>
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="学科" size="small">
        <el-select
          v-loading="loading"
          v-model="formInline.subject"
          placeholder="请选择"
          @focus="getSubjectList"
        >
          <el-option
            v-for="item in subjectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级目录" size="small">
        <el-select
          @focus="getNextSubjectList"
          v-model="formInline.region"
          placeholder="请选择"
        >
          <el-option
            v-for="item in NextSubjectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" size="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" size="small">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="试题类型" size="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难度" size="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方向" size="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="录入人" size="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目备注" size="small">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" size="small">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="城市" size="small" class="small">
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
        <el-select v-model="formInline.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="SearchButton">
        <el-row type="flex" justify="end">
          <el-button size="small">清除</el-button>
          <el-button type="primary" size="small">搜索</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as subjects from "@/api/hmmm/subjects.js";
import * as Tags from "@/api/hmmm/tags.js";
export default {
  name: "subjectSearch",
  data() {
    return {
      formInline: {
        user: "",
        region: "",
        name: "",
        subject: "",
      },
      loading: false,
      subjectList: [],
      NextSubjectList: [],
    };
  },
  props: {},
  created() {},

  methods: {
    async getSubjectList() {
      this.loading = true;
      const { data } = await subjects.simple();
      this.subjectList = data;
      this.loading = false;
    },
    async getNextSubjectList() {
      // console.log(this.formInline.subject);
      const { data } = await Tags.simple({
        subjectID: this.formInline.subject,
      });
      console.log(data);
      this.NextSubjectList = data;
    },
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 15px;
}
::v-deep .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 80px;
}
.el-input--suffix .el-input__inner {
  padding-right: 30px;
}
::v-deep .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 238px;
}
.el-form {
  width: 1277px;
}

::v-deep .el-form--inline .el-form-item {
  margin-right: 0;
}
::v-deep .small {
  .el-select .el-select--small {
    width: 119px;
    margin-right: 5px;
  }
  .el-input__inner {
    width: 119px;
    margin-right: 5px;
  }
}
.SearchButton .el-row {
  width: 305px;
}
</style>
