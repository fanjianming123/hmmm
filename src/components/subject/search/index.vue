<template>
  <div class="search-container">
    <el-row type="flex">
      <!-- 左侧表单部分 -->
      <el-col
        ><el-form label-width="80px" :inline="true">
          <el-form-item :label="labelName + '名称'">
            <el-input
              v-model="valueName"
              size="small"
              @input="inputFn"
              @keyup.enter.native="enterSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" v-if="!isSubject">
            <el-select v-model="state" placeholder="请选择" size="small">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="clearInput">清除</el-button>
            <el-button type="primary" size="small" @click="searchFn"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 右侧按钮部分 -->
      <el-col>
        <el-row type="flex" justify="end">
          <el-button type="text" icon="el-icon-back" v-if="!isSubject"
            >返回学科</el-button
          >
          <el-button
            type="success"
            style="height: 32px"
            class="add-btn"
            icon="el-icon-edit"
            @click="addDate"
            >新增{{ labelName }}</el-button
          >
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import baseApi from '@/api/base/baseApi'
export default {
  name: 'Search',
  data() {
    return {
      valueName: '',
      state: '',
      statusOptions: baseApi.status,
      subjectName: '',
      directoryName: '',
      tagName: ''
    }
  },

  created() {},
  props: {
    labelName: {
      type: String,
      required: true
    }
  },

  computed: {
    isSubject() {
      return this.labelName === '学科'
    }
  },

  watch: {
    valueName(val) {
      if (this.labelName === '学科') {
        this.subjectName = val
      } else if (this.labelName === '目录') {
        this.directoryName = val
      } else if (this.labelName === '标签') {
        this.tagName = val
      }
    }
  },

  methods: {
    clearInput() {
      this.valueName = ''
      this.state = ''
      this.inputFn()
    },
    searchFn() {
      if (this.labelName === '学科') {
        this.$emit('searchSubject', this.subjectName)
      } else if (this.labelName === '目录') {
        this.$emit('searchDirectory', [this.directoryName, this.state])
      } else if (this.labelName === '标签') {
        this.$emit('searchTag', [this.tagName, this.state])
      }
    },
    inputFn() {
      if (this.valueName !== '') return
      if (this.labelName === '学科') {
        this.subjectName = ''
      } else if (this.labelName === '目录') {
        this.directoryName = ''
      } else if (this.labelName === '标签') {
        console.log(1)
        this.tagName = ''
      }
      this.searchFn()
    },
    enterSearch() {
      this.searchFn()
    },
    addDate() {
      this.$emit('AddSubject', true)
    }
  }
}
</script>

<style scoped lang="scss">
.search-container {
  .add-btn {
    font-size: 12px;
    height: 32px;
  }
}
</style>
