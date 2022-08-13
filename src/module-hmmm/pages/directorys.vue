<template>
  <div class="container">
    <el-card>
      <subjectSearch
        :labelName="labelName"
        @searchDirectory="searchDirectoryFn"
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
import { list } from '@/api/hmmm/directorys'
import subjectSearch from '@/components/subject/search'
import subjectTable from '@/components/subject/table'

export default {
  name: 'Subject',
  data() {
    return {
      labelName: '目录',
      tableData: {},
      NavList: [
        { label: '所属学科', value: 'subjectName' },
        { label: '目录名称', value: 'directoryName' },
        { label: '创建者', value: 'username' },
        { label: '创建日期', value: 'addDate' },
        { label: '面试题数量', value: 'totals' },
        { label: '状态', value: 'state' }
      ],

      baseParams: {
        page: 1,
        pagesize: 10,
        directoryName: '',
        state: null
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
      console.log(data)
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
    searchDirectoryFn(val) {
      this.baseParams.directoryName = val[0]
      if (val[1] !== '') {
        this.baseParams.state = +val[1]
      } else {
        this.baseParams.state = null
      }
      this.baseParams.page = 1
      this.baseParams.pagesize = 10
      console.log(this.baseParams)
      this.getSubjectList()
    }
  }
}
</script>

<style scoped lang="less"></style>
