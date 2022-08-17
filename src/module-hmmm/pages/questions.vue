<template>
  <el-card class="box-card">
    <SearchTop @SearchSubjectList="SearchSubjectList"></SearchTop>
    <SubjuctList
      :tableData="tableData"
      :tableDataHeade="tableDataHeade"
      :page.sync="page"
      :total="total"
      :pageSize.sync="pageSize"
      @updataList="updataList"
    >
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            title="预览"
            icon="el-icon-view"
            circle
            type="primary"
            plain
            size="small"
            @click="previewFn(scope.row)"
          ></el-button>
          <el-button
            title="修改"
            icon="el-icon-edit"
            circle
            type="success"
            plain
            size="small"
            @click="modify(scope.row)"
          ></el-button>
          <el-button
            title="删除"
            icon="el-icon-delete"
            circle
            type="danger"
            plain
            size="small"
            @click="remove(scope.row)"
          ></el-button>
          <el-button
            title="加入精选"
            icon="el-icon-check"
            circle
            type="warning"
            plain
            size="small"
            @click="choiceAdd(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </SubjuctList>

  </el-card>
</template>

<script>
import SearchTop from '../components/questions-subject-search.vue'
import SubjuctList from '../components/questions-subject-list.vue'
import * as questions from '@/api/hmmm/questions.js'
export default {
  data() {
    return {
      tableDataHeade: [
        { label: '试题编号', value: 'number' },
        { label: '学科', value: 'subject' },
        { label: '目录', value: 'catalog' },
        { label: '题型', value: 'questionType' },
        { label: '题干', value: 'question' },
        { label: '录入时间', value: 'addDate' },
        { label: '难度', value: 'difficulty' },
        { label: '录入人', value: 'creator' }
      ],
      tableData: [],
      page: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false
    }
  },
  components: {
    SearchTop,
    SubjuctList
  },
  created() {
    this.getQuestionsList({
      page: this.page,
      pagesize: this.pageSize
    })
  },
  methods: {
    async getQuestionsList(val) {
      const { data } = await questions.list(val)
      // console.log(data)
      this.tableData = data.items
      this.total = data.counts
    },
    previewFn() {},
    SearchSubjectList(val) {
      this.page = 1
      const data = { ...val, page: this.page, pagesize: this.pageSize }
      // console.log(data)
      this.getQuestionsList(data)
    },
    updataList() {
      this.getQuestionsList({
        page: this.page,
        pagesize: this.pageSize
      })
    },
    modify(val) {
      console.log(val)
      this.$router.push({
        path: '/questions/new',
        query: {
          id: val.id
        }
      })
    },
    remove(val) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await questions.remove(val)
            this.$message.success('删除成功')
            this.getQuestionsList({
              page: this.page,
              pagesize: this.pageSize
            })
          } catch (error) {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {})
    },
    choiceAdd(val) {
      // console.log(val)
      // this.dialogVisible = true
      this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(async () => {
          try {
            await questions.choiceAdd({ id: val.id, choiceState: 1 })
            this.$message.success('加入精选成功')
            this.getQuestionsList({
              page: this.page,
              pagesize: this.pageSize
            })
          } catch (error) {
            this.$message.error('加入精选失败')
          }
        })
        .catch(() => {})
      //
    }
  }
}
</script>

<style scoped lang="less"></style>
