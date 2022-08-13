<template>
  <div class="container">
    <el-card>
      <subjectSearch
        :labelName="labelName"
        @searchTag="searchTagFn"
      ></subjectSearch>
      <subjectTable
        v-bind.sync="tableData"
        :NavList="NavList"
        :loading="loading"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      >
        <template v-slot:default="{ data }">
          <el-button type="text" @click="subjectClassificationFn(data)">{{
            ['启用', '禁用'][data.state]
          }}</el-button>
          <el-button type="text" :disabled="data.state === 1">修改</el-button>
          <el-button type="text" :disabled="data.state === 1">删除</el-button>
        </template>
      </subjectTable>
    </el-card>
  </div>
</template>

<script>
import { list } from '@/api/hmmm/tags'
import subjectSearch from '@/components/subject/search'
import subjectTable from '@/components/subject/table'

export default {
  name: 'tags',
  data() {
    return {
      labelName: '标签',
      tableData: {},
      NavList: [
        { label: '所属学科', value: 'subjectName' },
        { label: '标签名称', value: 'tagName' },
        { label: '创建者', value: 'username' },
        { label: '创建日期', value: 'addDate' },
        { label: '状态', value: 'state' }
      ],

      baseParams: {
        page: 1,
        pagesize: 10,
        tagName: '',
        state: ''
      }
    }
  },
  created() {
    this.getSubjectList()
  },

  components: { subjectSearch, subjectTable },

  methods: {
    async getSubjectList() {
      this.loading = true
      const { data } = await list(this.baseParams)
      data.page = +data.page
      data.pagesize = +data.pagesize
      this.tableData = data
      // console.log(this.tableData)
      // console.log(data)
    },
    pageChange(val) {
      this.baseParams.page = +val
      this.getSubjectList()
    },
    sizeChange(val) {
      this.baseParams.pagesize = +val
      this.getSubjectList()
    },
    subjectClassificationFn(val) {
      console.log(val)
    },
    searchTagFn(val) {
      this.baseParams.tagName = val[0]
      if (val[1] !== undefined) {
        this.baseParams.state = +val[1]
      }else{
        this.baseParams.state = ''
      }
      this.baseParams.page = 1
      this.baseParams.pagesize = 10
      console.log(this.baseParams.state)
      this.getSubjectList()
    }
  }
}
</script>

<style scoped lang="less"></style>
