<template>
  <div class="container">
    <el-dialog
      :title="isEdit ? '修改目录' : '新增目录'"
      :visible="showAddDirectoryDialog"
      width="400px"
      @close="onClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="所属学科"
          prop="subjectName"
          v-if="subjectID === null"
        >
          <el-select
            v-model="ruleForm.subjectID"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in simpleSubjectList"
              :key="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName" size="small">
          <el-input v-model="ruleForm.directoryName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSave">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { simple } from '@/api/hmmm/subjects'
import { add, update } from '@/api/hmmm/directorys'
export default {
  name: 'directoryAdd',
  data() {
    return {
      ruleForm: {
        subjectID: this.subjectID,
        directoryName: ''
      },
      rules: {
        directoryName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ]
      },
      simpleSubjectList: []
    }
  },
  props: {
    showAddDirectoryDialog: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    editItem: {
      type: Object,
      default: () => ({})
    },
    subjectID: {
      type: Number,
      default: null
    }
  },
  watch: {
    editItem: {
      immediate: true,
      handler(val) {
        if (val.id) {
          this.ruleForm.subjectID = this.editItem.id
          this.ruleForm.directoryName = this.editItem.directoryName
        }
      }
    }
  },
  created() {
    this.getSimpleSubject()
  },
  methods: {
    onClose() {
      this.$emit('closeAddDialog')
      this.$refs.ruleForm.resetFields()
    },
    async onSave() {
      await this.$refs.ruleForm.validate()
      if (this.isEdit) {
        await update({
          id: this.editItem.id,
          subjectID: this.ruleForm.subjectID,
          directoryName: this.ruleForm.directoryName
        })
        this.$message.success('修改成功')
      } else {
        await add(this.ruleForm)
        this.$message.success('添加成功')
      }
      this.$emit('add-success')
      this.onClose()
    },
    async getSimpleSubject() {
      const res = await simple()
      console.log(res)
      this.simpleSubjectList = res.data
    }
  }
}
</script>

<style scoped lang="less"></style>
