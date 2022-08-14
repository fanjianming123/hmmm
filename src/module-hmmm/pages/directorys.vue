<template>
  <div class="container">
    <el-card>
      <el-breadcrumb separator=">" class="el-card__header" v-if="$route?.query?.data?.id">
        <el-breadcrumb-item :to="{ path: '/subjects/list' }"
          ><span style="color:#000">学科管理</span></el-breadcrumb-item
        >
        <el-breadcrumb-item>{{$route.query.data.subjectName}}</el-breadcrumb-item>
        <el-breadcrumb-item>目录</el-breadcrumb-item>
      </el-breadcrumb>
      <subjectSearch
        :labelName="labelName"
        :isFromSubject="isFromSubject"
        @searchDirectory="searchDirectoryFn"
        @AddDirectory="AddDirectory"
      ></subjectSearch>
      <subjectTable
        v-bind.sync="tableData"
        :NavList="NavList"
        :loading="loading"
        :subjectID="baseParams.subjectID"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      >
        <template v-slot:default="{ data }">
          <el-button type="text" @click="changeState(data)">{{
            ['启用', '禁用'][data.state]
          }}</el-button>
          <el-button
            type="text"
            :disabled="data.state === 1"
            @click="editFn(data)"
            >修改</el-button
          >
          <el-button
            type="text"
            :disabled="data.state === 1"
            @click="removeFn(data)"
            >删除</el-button
          >
        </template>
      </subjectTable>
    </el-card>
    <directorysAdd
      :showAddDirectoryDialog="showAddDirectoryDialog"
      :isEdit="isEdit"
      :editItem="editItem"
      :subjectID="baseParams.subjectID"
      @closeAddDialog="showAddDirectoryDialog = false"
      @add-success="getSubjectList()"
    ></directorysAdd>
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/directorys'
import subjectSearch from '@/components/subject/search'
import subjectTable from '@/components/subject/table'
import directorysAdd from '../components/directorys-add.vue'
export default {
  name: 'Directory',
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
        state: null,
        subjectID: null
      },
      showAddDirectoryDialog: false,
      isEdit: false,
      editItem: {},
      isFromSubject: false,
      loading: false
    }
  },
  created() {
    this.baseParams.subjectID = this.$route?.query?.data?.id
    this.getSubjectList()
    console.log(this.$route?.query?.data);
  },

  components: { subjectSearch, subjectTable, directorysAdd },
  watch: {
    'baseParams.subjectID'(val) {
      if (val === undefined) {
        this.isFromSubject = false
      } else {
        this.isFromSubject = true
      }
    }
  },
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
    async changeState(val) {
      console.log(val)
      val.state = val.state === 0 ? 1 : 0
      await changeState({
        id: val.id,
        state: val.state
      })
      this.$message.success('修改成功')
      this.getSubjectList()
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
    },
    AddDirectory(val) {
      this.isEdit = false
      this.editItem = {}
      this.showAddDirectoryDialog = val
    },
    editFn(data) {
      this.isEdit = true
      this.editItem = data
      console.log(data)
      this.showAddDirectoryDialog = true
    },
    async removeFn(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await remove(val)
          this.getSubjectList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
}
</style>
