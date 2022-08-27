<template>
  <el-card class="box-card">
    <SearchTop @SearchSubjectList="SearchSubjectList"></SearchTop>
    <el-tabs v-model="chkStateName" type="card" @tab-click="changeChkState">
      <el-tab-pane label="全部" name="all">
        <SubjuctList
          fixed="right"
          width="200"
          :tableData="tableData"
          :tableDataHeade="tableDataHeade"
          :page.sync="page"
          :total="total"
          :pageSize.sync="pageSize"
          @updataList="updataList"
        >
          <el-table-column fixed="right" label="操作" width="190">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="previewFn(scope.row)"
                >预览
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isChecked(scope.row)"
                @click="Checked(scope.row)"
                >审核
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isModify(scope.row)"
                @click="modify(scope.row)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="changePublish(scope.row)"
              >
                {{ scope.row.publishState | publishFilter }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isRemove(scope.row)"
                @click="remove(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </SubjuctList>
      </el-tab-pane>
      <el-tab-pane label="待审核" name="Waiting">
        <SubjuctList
          fixed="right"
          width="200"
          :tableData="tableData"
          :tableDataHeade="tableDataHeade"
          :page.sync="page"
          :total="total"
          :pageSize.sync="pageSize"
          @updataList="updataList"
        >
          <el-table-column fixed="right" label="操作" width="190">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="previewFn(scope.row)"
                >预览
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isChecked(scope.row)"
                @click="Checked(scope.row)"
                >审核
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isModify(scope.row)"
                @click="modify(scope.row)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="changePublish(scope.row)"
              >
                {{ scope.row.publishState | publishFilter }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isRemove(scope.row)"
                @click="remove(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </SubjuctList>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="checked">
        <SubjuctList
          fixed="right"
          width="200"
          :tableData="tableData"
          :tableDataHeade="tableDataHeade"
          :page.sync="page"
          :total="total"
          :pageSize.sync="pageSize"
          @updataList="updataList"
        >
          <el-table-column fixed="right" label="操作" width="190">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="previewFn(scope.row)"
                >预览
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isChecked(scope.row)"
                @click="Checked(scope.row)"
                >审核
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isModify(scope.row)"
                @click="modify(scope.row)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="changePublish(scope.row)"
              >
                {{ scope.row.publishState | publishFilter }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isRemove(scope.row)"
                @click="remove(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </SubjuctList>
      </el-tab-pane>
      <el-tab-pane label="已拒绝" name="Refused">
        <SubjuctList
          fixed="right"
          width="200"
          :tableData="tableData"
          :tableDataHeade="tableDataHeade"
          :page.sync="page"
          :total="total"
          :pageSize.sync="pageSize"
          @updataList="updataList"
        >
          <el-table-column fixed="right" label="操作" width="190">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="previewFn(scope.row)"
                >预览
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isChecked(scope.row)"
                @click="Checked(scope.row)"
                >审核
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isModify(scope.row)"
                @click="modify(scope.row)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="changePublish(scope.row)"
              >
                {{ scope.row.publishState | publishFilter }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="isRemove(scope.row)"
                @click="remove(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </SubjuctList>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="提示" :visible.sync="Visible" width="21%">
      <el-radio v-model="radio" label="1">通过</el-radio>
      <el-radio v-model="radio" label="2">拒绝</el-radio>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入审核意见"
        v-model.trim="textarea"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <previewDialog
      ref="previewDialog"
      :previewVisible.sync="previewVisible"
    ></previewDialog>
  </el-card>
</template>

<script>
import SearchTop from '../components/questions-subject-search.vue'
import SubjuctList from '../components/questions-subject-list.vue'
import previewDialog from '../components/questions-subject-dialog.vue'
import * as questions from '@/api/hmmm/questions.js'
import { chkState } from '@/api/hmmm/constants.js'
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
        { label: '录入人', value: 'creator' },
        { label: '审核状态', value: 'chkState' },
        { label: '审核意见', value: 'chkRemarks' },
        { label: '审核人', value: 'chkUser' },
        { label: '发布状态', value: 'publishState' }
      ],
      tableData: [],
      page: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      chkStateName: 'all',
      chkState: '',
      Visible: false,
      radio: '1',
      textarea: '',
      id: '',
      previewVisible: false
    }
  },
  components: {
    SearchTop,
    SubjuctList,
    previewDialog
  },
  computed: {
    isChecked() {
      return function (val) {
        if (val.chkState === 0) {
          return false
        } else {
          return true
        }
      }
    },
    isModify() {
      return function (val) {
        if (val.publishState === 1) {
          return false
        } else {
          return true
        }
      }
    },
    isRemove() {
      return function (val) {
        if (val.publishState === 1) {
          return false
        } else {
          return true
        }
      }
    }
  },
  created() {
    this.getQuestionsList({
      page: this.page,
      pagesize: this.pageSize,
      chkState: this.chkState
    })
  },
  methods: {
    async getQuestionsList(val) {
      const { data } = await questions.choice(val)
      // console.log(data)
      this.tableData = data.items
      this.total = data.counts
    },
    changeChkState(tab, event) {
      this.chkStateName = tab.name
      const item = chkState.find((item) => item.label === tab.label)
      this.chkState = item ? item.value : ''
      this.getQuestionsList({
        page: this.page,
        pagesize: this.pageSize,
        chkState: this.chkState
      })
      // console.log(this.chkState)
      // console.log(tab, event)
    },
    async previewFn(val) {
      // console.log(val)
      await this.$refs.previewDialog.getList(val)
      this.previewVisible = true
    },
    Checked(val) {
      // console.log(val)
      this.Visible = true
      this.id = val.id
    },
    onConfirm() {
      // console.log(this.textarea)
      if (this.textarea === '') {
        return this.$message({
          message: '请输入审核意见',
          type: 'warning'
        })
      }
      try {
        questions.choiceCheck({
          id: this.id,
          chkState: +this.radio,
          chkRemarks: this.textarea
        })
        this.$message.success('操作成功')
      } catch (error) {
        this.$message.fail('操作失败')
      }
      this.Visible = false
    },
    SearchSubjectList(val) {
      this.page = 1
      const data = {
        ...val,
        page: this.page,
        pagesize: this.pageSize,
        chkState: this.chkState
      }
      // console.log(data)
      this.getQuestionsList(data)
    },
    updataList() {
      this.getQuestionsList({
        page: this.page,
        pagesize: this.pageSize,
        chkState: this.chkState
      })
    },
    modify(val) {
      // console.log(val)
      this.$router.push({
        path: '/questions/new',
        query: {
          id: val.id
        }
      })
    },
    changePublish(val) {
      // console.log(val)
      const publish = val.publishState ? '上架' : '下架'
      this.$confirm(`您确认${publish}这道题目吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await questions.choicePublish({
              id: val.id,
              publishState: val.publishState ? '0' : '1'
            })
            this.$message.success('操作成功')
            this.getQuestionsList({
              page: this.page,
              pagesize: this.pageSize,
              chkState: this.chkState
            })
            // console.log(111)
          } catch (error) {
            this.$message.error('操作失败')
          }
        })
        .catch(() => {})
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
            if (this.pagesize !== 0) {
              this.getQuestionsList({
                page: this.page,
                pagesize: this.pageSize,
                chkState: this.chkState
              })
            } else {
              if (this.page !== 1) {
                this.page--
                this.getQuestionsList({
                  page: this.page,
                  pagesize: this.pageSize,
                  chkState: this.chkState
                })
              } else {
                this.getQuestionsList({
                  page: this.page,
                  pagesize: this.pageSize,
                  chkState: this.chkState
                })
              }
            }
          } catch (error) {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.el-textarea {
  margin: 22px 0;
}
</style>
