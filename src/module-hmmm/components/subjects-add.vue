<template>
  <div class="container">
    <el-dialog
      :title="isEdit ? '修改学科' : '新增学科'"
      :visible="showAddSubjectDialog"
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
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="ruleForm.subjectName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isFrontDisplay" size="small">
          <el-switch
            v-model="ruleForm.isFrontDisplay"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
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
import { add, update } from '@/api/hmmm/subjects'
export default {
  name: 'subjectAdd',
  data() {
    return {
      ruleForm: {
        subjectName: '',
        isFrontDisplay: 0
      },
      rules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    showAddSubjectDialog: {
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
    }
  },
  watch: {
    editItem: {
      immediate: true,
      handler(val) {
        console.log(val)
        if (val.id) {
          this.ruleForm.subjectName = this.editItem.subjectName
          this.ruleForm.isFrontDisplay = this.editItem.isFrontDisplay
        }
      }
    }
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
          subjectName: this.ruleForm.subjectName,
          isFrontDisplay: this.ruleForm.isFrontDisplay
        })
        this.$message.success('修改成功')
      } else {
        await add(this.ruleForm)
        this.$message.success('添加成功')
      }
      this.$emit('add-success')
      this.onClose()
    }
  }
}
</script>

<style scoped lang="less"></style>
