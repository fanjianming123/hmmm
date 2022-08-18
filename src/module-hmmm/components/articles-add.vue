<template>
  <div class="container">
    <el-dialog
      :title="title"
      :visible="showAddTagDialog"
      width="800px"
      @close="onClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleBody">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="form.articleBody"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="视频地址" prop="videoURL">
          <el-input v-model="form.videoURL"></el-input>
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
// import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { add, update } from '@/api/hmmm/articles.js'
export default {
  name: 'articalsAdd',
  data() {  
    return {
      // form: {
      //   id: '',
      //   title: '',
      //   articleBody: '',
      //   videoURL: ''
      // },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        articleBody: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        videoURL: [
          { required: true, message: '请输入视频地址', trigger: 'blur' }
        ]
      },
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'simple' //  'default'or'simple'
    }
  },
  computed: {
    title() {
      return this.editItem.id ? '修改文章' : '新增文章'
    },
    form(){
      return this.editItem
    }
  },
  components: { Editor, Toolbar },
  props: {
    showAddTagDialog: {
      type: Boolean,
      default: false
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
  created() {},
  methods: {
    onClose() {
      this.$emit('closeAddDialog')
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    async onSave() {
      console.log(this.editItem);   
      await this.$refs.form.validate()
      if (this.editItem.id) {
        await update({
          id: this.editItem.id,
          title: this.form.title,
          articleBody: this.form.articleBody,
          videoURL: this.form.videoURL
        })
        this.$message.success('修改成功')

        this.onClose()
      } else {
        await add(this.form)
        this.$message.success('添加成功')
        this.onClose()
        this.$refs.form.resetFields()
      }
    }
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped lang="scss"></style>
