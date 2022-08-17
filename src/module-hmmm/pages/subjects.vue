<template>
  <div class="container">
    <el-card>
      <subjectSearch
        :labelName="labelName"
        @searchSubject="searchSubjectFn"
        @AddSubject="AddSubjectFn"
      ></subjectSearch>
      <subjectTable
        v-bind.sync="tableData"
        :NavList="NavList"
        :loading="loading"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      >
        <template v-slot:default="data">
          <el-button type="text" @click="subjectClassificationFn(data)"
            >学科分类</el-button
          >
          <el-button type="text" @click="subjectTagFn(data)">学科标签</el-button>
          <el-button type="text" @click="editFn(data)">修改</el-button>
          <el-button type="text" @click="deleteFn(data)">删除</el-button>
        </template>
      </subjectTable>
    </el-card>
    <subjectAdd
      :showAddSubjectDialog.sync="showAddSubjectDialog"
      @closeAddDialog="showAddSubjectDialog = false"
      :editItem="editItem"
      :isEdit="isEdit"
      @add-success="getSubjectList()"
    ></subjectAdd>
  </div>
</template>

<script>
import { list, remove } from '@/api/hmmm/subjects'
import subjectSearch from '@/components/subject/search'
import subjectTable from '@/components/subject/table'
import subjectAdd from '../components/subjects-add.vue'
export default {
  name: 'Subject',
  data() {
    return {
      labelName: '学科',
      tableData: {},
      NavList: [
        { label: '学科名称', value: 'subjectName' },
        { label: '创建者', value: 'username' },
        { label: '创建日期', value: 'addDate' },
        { label: '前台是否显示', value: 'isFrontDisplay' },
        { label: '二级目录', value: 'twoLevelDirectory' },
        { label: '标签', value: 'tags' },
        { label: '题目数量', value: 'totals' }
      ],
      baseParams: {
        page: 1,
        pagesize: 10,
        subjectName: ''
      },
      showAddSubjectDialog: false, // 新增弹层
      editItem: {},
      isEdit: false
    }
  },
  created() {
    this.getSubjectList()
  },

  components: { subjectSearch, subjectTable, subjectAdd },

  methods: {
    async getSubjectList() {
      this.loading = true
      const { data } = await list(this.baseParams)
      data.page = +data.page
      data.pagesize = +data.pagesize
      this.tableData = data
      // console.log(this.tableData)
    },
    pageChange(val) {
      this.baseParams.page = +val
      this.getSubjectList()
    },
    sizeChange(val) {
      this.baseParams.pagesize = +val
      this.getSubjectList()
    },
    searchSubjectFn(val) {
      this.baseParams.subjectName = val
      this.baseParams.page = 1
      this.baseParams.pagesize = 10
      this.getSubjectList()
    },
    AddSubjectFn() {
      this.isEdit = false
      this.editItem = {}
      this.showAddSubjectDialog = true
    },
    subjectClassificationFn(val) {
      console.log(val)
      this.$router.push({
        path: '/subjects/directorys',
        query: val
      })
    },
     subjectTagFn(val) {
      console.log(val)
      this.$router.push({
        path: '/subjects/tags',
        query: val
      })
    },
    editFn({ data }) {
      this.isEdit = true
      this.editItem = data
      console.log(data)
      this.showAddSubjectDialog = true
    },
    deleteFn({ data }) {
      console.log(data)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await remove(data)
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

<style scoped lang="less"></style>
