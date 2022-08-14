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
          v-model="formInline.subjectID"
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
          v-loading="loading"
          @focus="getcatalogIDList"
          v-model="formInline.catalogID"
          placeholder="请选择"
        >
          <el-option
            v-for="item in catalogIDList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" size="small">
        <el-select
          v-loading="loading"
          @focus="getTagsList"
          v-model="formInline.tags"
          placeholder="请选择"
        >
          <el-option
            v-for="item in TagsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" size="small">
        <el-input v-model.trim="formInline.keyword"></el-input>
      </el-form-item>
      <el-form-item label="试题类型" size="small">
        <el-select v-model="formInline.questionType" placeholder="请选择">
          <el-option
            v-for="item in questionType"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难度" size="small">
        <el-select v-model="formInline.difficulty" placeholder="请选择">
          <el-option
            v-for="item in difficulty"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方向" size="small">
        <el-select v-model="formInline.direction" placeholder="请选择">
          <el-option
            v-for="item in direction"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="录入人" size="small">
        <el-select v-model="formInline.creatorID" placeholder="请选择">
          <el-option :label="name" :value="name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目备注" size="small">
        <el-input v-model.trim="formInline.remarks"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" size="small">
        <el-input v-model.trim="formInline.shortName"></el-input>
      </el-form-item>
      <el-form-item label="城市" size="small" class="small">
        <el-select
          v-loading="loading"
          v-model="formInline.city"
          placeholder="请选择"
          @focus="getCityList"
        >
          <el-option
            v-for="item in citysList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-loading="loading"
          v-model="formInline.area"
          placeholder="请选择"
          @focus="getDatasCity"
        >
          <el-option
            v-for="item in areaList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="SearchButton">
        <el-row type="flex" justify="end">
          <el-button size="small" @click="clearFormInline">清除</el-button>
          <el-button type="primary" size="small" @click="searchForm"
            >搜索</el-button
          >
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as subjects from '@/api/hmmm/subjects.js'
import * as Tags from '@/api/hmmm/tags.js'
import * as directorys from '@/api/hmmm/directorys.js'
import { questionType, difficulty, direction } from '@/api/hmmm/constants.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
export default {
  name: 'subjectSearch',
  data() {
    return {
      formInline: {
        subjectID: '', //学科
        catalogID: '', //二级目录
        tags: '', //标签
        keyword: '', //关键字
        questionType: '', //试题类型
        difficulty: '', //难度
        direction: '', //方向
        creatorID: '', //录入人
        remarks: '', //题目备注
        shortName: '', //企业简称
        city: '', //城市(市)
        area: '' //城市(区)
      },
      loading: false,
      subjectList: [], //学科列表
      catalogIDList: [], //二级目录列表
      TagsList: [], //标签列表
      questionType, //试题类型列表
      difficulty, //难度列表
      direction, //方向列表
      name: this.$store.state.user.name, //录入人
      citysList: [], //城市(市)列表
      areaList: [] //城市(区)列表
    }
  },
  props: {},
  created() {},
  methods: {
    async getSubjectList() {
      this.loading = true
      const { data } = await subjects.simple()
      this.subjectList = data
      this.loading = false
    },
    async getcatalogIDList() {
      this.loading = true
      // console.log(this.formInline.subject);

      const { data } = await directorys.simple({
        subjectID: this.formInline.subjectID
      })
      console.log(data)
      this.catalogIDList = data
      this.loading = false
    },
    async getTagsList() {
      this.loading = true
      // console.log(this.formInline.subject);
      const { data } = await Tags.simple({
        subjectID: this.formInline.subjectID
      })
      console.log(data)
      this.TagsList = data
      this.loading = false
    },
    getCityList() {
      this.loading = true
      // console.log(111);
      this.citysList = provinces()
      this.loading = false
    },
    getDatasCity() {
      this.loading = true
      this.areaList = citys(this.formInline.city)
      this.loading = false
    },
    clearFormInline() {
      this.formInline = {
        subjectID: '',
        catalogID: '',
        tags: '',
        keyword: '',
        questionType: '',
        difficulty: '',
        direction: '',
        creatorID: '',
        remarks: '',
        shortName: '',
        city: '',
        area: ''
      }
    },
    searchForm() {
      let flag
      for (let key in this.formInline) {
        if (this.formInline[key]) {
          flag = true
          break
        } else {
          flag = false
        }
      }
      // console.log(flag)
      if (flag) {
        this.$emit('SearchSubjectList', this.formInline)
      } else {
        this.$emit('SearchSubjectList')
      }
    }
  }
}
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
