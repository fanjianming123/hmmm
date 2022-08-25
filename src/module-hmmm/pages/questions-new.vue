<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <!-- 主体内容 -->
      <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="学科：" prop="subjectID">
            <el-select
              v-model="form.subjectID"
              placeholder="范建明"
              style="width: 400px"
              @change="onSubject"
            >
              <el-option
                :label="item.label"
                v-for="item in simple"
                :key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录：" prop="catalogID">
            <el-select
              v-model="form.catalogID"
              placeholder="请选择"
              style="width: 400px"
            >
              <el-option
                v-for="item in catalogID"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业：" prop="enterpriseID">
            <el-select
              v-model="form.enterpriseID"
              placeholder="请选择"
              style="width: 400px"
            >
              <el-option
                v-for="item in CompanysList"
                :key="item.id"
                :label="item.company"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市：" prop="province">
            <el-select
              v-model="form.province"
              placeholder="请选择"
              style="width: 198px"
              @change="form.city = ''"
            >
              <el-option
                v-for="(item, index) in provinces()"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>

            <el-select
              v-model="form.city"
              placeholder="请选择"
              style="width: 198px; margin-left: 4px"
            >
              <el-option
                v-for="(item, index) in citys(form.province)"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方向：" prop="direction">
            <el-select
              v-model="form.direction"
              placeholder="请选择"
              style="width: 400px"
            >
              <el-option
                v-for="(item, index) in direction"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型：" prop="questionType">
            <el-radio-group v-model="form.questionType" @change="radioChange">
              <el-radio
                :label="item.value"
                v-for="item in questionType"
                :key="item.value"
                >{{ item.label }}</el-radio
              >
              <!-- <el-radio :label="2">多选</el-radio>
              <el-radio :label="3">简答</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度：" prop="difficulty">
            <el-radio-group v-model="form.difficulty">
              <el-radio
                v-for="item in difficulty"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="题干：" prop="question">
            <quill-editor
              ref="mwQuillEditor"
              v-model="form.question"
              :options="editorOption"
              @blur="contentRule"
            />
            <input
              type="file"
              hidden
              accept=".jpg,.png"
              ref="fileBtn"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="选择：" v-if="form.questionType !== 3">
            <!-- 单选 -->
            <div v-if="form.questionType === 1">
              <div v-for="(item, index) in form.options" :key="index">
                <el-radio-group v-model="optionsRadio">
                  <div class="optins_item">
                    <el-radio :label="index" style="width: 18px">{{
                      item.code + ':'
                    }}</el-radio>
                    <el-input
                      v-model="item.title"
                      style="width: 240px"
                    ></el-input>
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :on-change="onChange"
                      :http-request="
                        (file) => {
                          onRequest(file, index)
                        }
                      "
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <span class="uploadSpan">上传图片</span>
                      <img v-if="item.img" :src="item.img" class="avatar" />
                      <i
                        @click.stop="onRemove(index)"
                        class="el-icon-circle-close"
                      ></i>
                    </el-upload>
                  </div>
                </el-radio-group>
              </div>
              <!-- <el-button type="danger" size="small" :disabled="true"
                >+增加选项与答案</el-button
              > -->
            </div>
            <!-- 多选 -->
            <div v-if="form.questionType === 2">
              <!-- <el-radio-group v-model="form.resource"> -->
              <div
                class="optins_item"
                v-for="(item, index) in form.options"
                :key="index"
              >
                <el-checkbox v-model="item.isRight" style="width: 48px">{{
                  item.code + ':'
                }}</el-checkbox>
                <el-input v-model="item.title" style="width: 240px"></el-input>
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :http-request="
                    (file) => {
                      onRequest(file, index)
                    }
                  "
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <span class="uploadSpan" v-if="item.img === ''"
                    >上传图片</span
                  >
                  <img v-if="item.img" :src="item.img" class="avatar" />
                  <i
                    @click.stop="onRemove(index)"
                    class="el-icon-circle-close"
                  ></i>
                </el-upload>
              </div>
              <!-- </el-radio-group> -->
              <!-- <el-button @click="addOptions" type="danger" size="small"
                >+增加选项与答案</el-button
              > -->
            </div>
            <el-button
              @click="addOptions"
              type="danger"
              size="small"
              :disabled="form.questionType == 2 ? false : true"
              >+增加选项与答案</el-button
            >
            <!-- 简答 -->
            <!-- <div v-if="form.questionType === 3"></div> -->
          </el-form-item>
          <el-form-item label="解析视频：">
            <el-input v-model="form.videoURL" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="答案解析：" prop="answer">
            <quill-editor
              ref="mwQuillEditors"
              v-model="form.answer"
              :options="editorOption"
              @blur="contentAnswer"
            />
            <input
              type="file"
              hidden
              accept=".jpg,.png"
              ref="fileBtns"
              @change="handleChanges"
            />
          </el-form-item>
          <el-form-item label="题目备注：">
            <el-input
              type="textarea"
              v-model="form.remarks"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="试题标签：">
            <el-select
              v-model="form.tags"
              filterable
              multiple
              placeholder="请选择试题标签"
              style="width: 400px"
            >
              <el-option
                v-for="item in tagsList"
                :key="item.id"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
// 工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  ['blockquote'], // 引用  代码块-----['blockquote', 'code-block']
  ['code-block', 'image', 'link'] // 链接、图片、视频-----['link', 'image', 'video']
]
// id AKID74nHWWHn34qNfiY9VdYEfv775uX0Tq21
// key pQo14uXw8AKQL2WlnaCaljU1SggS0KQH
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKID74nHWWHn34qNfiY9VdYEfv775uX0Tq21',
  SecretKey: 'pQo14uXw8AKQL2WlnaCaljU1SggS0KQH'
})
import { simple } from '@/api/hmmm/subjects.js' // 学科
import { simple as directorysSimple } from '@/api/hmmm/directorys.js' //目录
import { questionType, difficulty, direction } from '@/api/hmmm/constants.js' // 题型 难度 方向 数据
import { provinces, citys } from '@/api/hmmm/citys' // 省市 地区
import { list } from '@/api/hmmm/companys.js' // 企业列表
import { simple as tagsSimple } from '@/api/hmmm/tags.js'
import { add, detail } from '@/api/hmmm/questions.js'
export default {
  name: 'New',
  data() {
    return {
      form: {
        subjectID: '', //学科
        catalogID: '', // 目录
        enterpriseID: '', //企业
        province: '', // 城市
        city: '', // 地区
        direction: '', //方向
        questionType: 1, //题型
        difficulty: 1, //难度
        question: '', //题干
        options: [
          //选项
          {
            code: 'A', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'B', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'C', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'D', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          }
        ],
        videoURL: '', //解析视频
        answer: '', //答案解析
        remarks: '', //题目备注
        tags: [] //试题标签
      },
      optionsRadio: '', //选项控制
      arr: [], //26字母数组
      questionType, // 题型
      difficulty, //难度
      /* g规则 */
      rules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        province: [
          {
            required: true,
            validator: (rules, value, cb) => {
              let { city } = this.form

              if (!value || !city) {
                return cb(new Error('城市不能为空!'))
              }
              return cb()
            },
            trigger: 'change'
          }
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        questionType: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择困难程度', trigger: 'change' }
        ],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案解析', trigger: 'blur' }]
      },
      simple: [], //学科列表
      catalogID: [], //目录列表
      CompanysList: [], //企业列表
      provinces, //省市
      citys, //  地区
      direction, // 方向
      tagsList: [], //标签列表
      // 配置项
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // image: this.handleImgUpload,
            }
          },
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
            }
          }
        }
      },
      queryId: '',
      checkList: [] //多选框选中框
    }
  },
  created() {
    this.getWord() //生成26字母
    this.getSimpleList() //获取学科列表
    this.getListCompanys() //获取企业列表
    this.detail() //回显数据
  },
  mounted() {
    // 题干富文本
    if (this.$refs.mwQuillEditor) {
      //myQuillEditor改成自己的
      this.$refs.mwQuillEditor.quill
        .getModule('toolbar')
        .addHandler('image', this.imgHandler)
    }
    if (this.$refs.mwQuillEditors) {
      //myQuillEditor改成自己的
      this.$refs.mwQuillEditors.quill
        .getModule('toolbar')
        .addHandler('image', this.imgHandlers)
    }
  },
  components: {
    quillEditor
  },
  methods: {
    // 提交表单
    onSubmit() {
      if (this.form.questionType === 1) {
        if (this.optionsRadio === '')
          return this.$message.error('请正确配置选项！')
        this.form.options[this.optionsRadio].isRight = true
      }
      if (this.form.questionType === 2) {
        const res = this.form.options.findIndex((item) => item.isRight === true)
        if (res === -1) {
          return this.$message.error('请正确配置选项！')
        }
      }
      if (this.form.tags === '') {
        return this.$message.error('请添加试题标签在进行提交！')
      }
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.form.options[this.optionsRadio].isRight = true
        this.form.tags = this.form.tags.join(', ')
        this.form.questionType = this.form.questionType.toString()
        this.form.difficulty = this.form.difficulty.toString()
        await add(this.form)
        this.$message.success('创建成功！')
        this.$router.push('/questions/list')
      })
    },
    // handleImgUpload() {
    // const { quill } = this.$refs.mwQuillEditor;
    // SelectImages({
    //   visible: true,
    //   multi: true,
    //   showButton: true,
    //   maxMulti: 18,
    //   success: (data, filPath) => {
    //     for (const item of data) {
    //       const length = quill.getSelection(true).index;
    //       // 获取光标所在位置
    //       // 插入图片，res为服务器返回的图片链接地址
    //       quill.insertEmbed(length, "image", filPath + item);
    //       // 调整光标到最后
    //       quill.setSelection(length + 1);
    //     }
    //   },
    // });
    // },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    // 上传图片
    onRequest({ file }, index) {
      cos.putObject(
        {
          Bucket: 'hmhr-31-1313341619' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: file.name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          // console.log(err || data)
          if (err || data.statusCode != 200) {
            return this.$message.error('上传失败，刷新重试')
          }
          this.form.options[index].img = 'https://' + data.Location
        }
      )
    },
    /* 获取a-z 字母 */
    getWord() {
      for (var i = 65; i <= 90; i++) {
        if (i > 90 && i < 97) {
          continue
        }
        // 接受一个指定的 Unicode 值，然后返回一个字符串
        this.arr.push(String.fromCharCode(i))
      }
    },
    // 判断多选是否能继续添加
    addOptions() {
      if (this.form.options[this.form.options.length - 1].code === 'Z') {
        return this.$message.error('不能继续添加了')
      } else {
        console.log(this.arr[this.form.options.length])
        this.form.options.push({
          code: this.arr[this.form.options.length],
          img: '',
          title: '',
          iaRight: false
        })
      }
    },
    // 变更为单选 返回给初始数据
    radioChange(val) {
      this.optionsRadio = ''
      if (val === 1) {
        this.form.options = [
          {
            code: 'A', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'B', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'C', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          },
          {
            code: 'D', //代码
            title: '', //标题
            img: '', //图片url
            isRight: false //是否正确答案
          }
        ]
      }
    },
    // 富文本校验
    contentRule() {
      this.$refs.form.validateField('question')
    },
    contentAnswer() {
      this.$refs.form.validateField('answer')
    },
    // 选项 图片清空
    onRemove(index) {
      this.form.options[index].img = ''
    },
    onChange(file, fileList) {
      // console.log(file);
      // console.log(fileList);
    },
    // 获取学科简单列表
    async getSimpleList() {
      const { data } = await simple()
      this.simple = data
    },
    // 选择学科，发送请求
    onSubject() {
      this.form.catalogID = ''
      this.form.tags = ''
      this.directorysSimple()
      this.tagsSimple()
    },
    // 获取目录
    async directorysSimple() {
      const { data } = await directorysSimple({
        page: 1,
        pagesize: 99999,
        subjectID: this.form.subjectID
      })
      this.catalogID = data
    },
    // 获取标签列表
    async tagsSimple() {
      const { data } = await tagsSimple({
        subjectID: this.form.subjectID
      })
      this.tagsList = data
    },
    // 企业列表
    async getListCompanys() {
      const { data } = await list({
        pagesize: 99999
      })
      this.CompanysList = data.items
    },
    // 题干富文本
    imgHandler(state) {
      if (state) {
        //触发input的单击 ，fileBtn换成自己的
        this.$refs.fileBtn.click()
      }
    },
    // 题干富文本
    handleChange(e) {
      const files = Array.prototype.slice.call(e.target.files)
      if (!files) {
        return
      }
      console.log(files)

      cos.putObject(
        {
          Bucket: 'hmhr-31-1313341619' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: files[0]
            .name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: 'STANDARD',
          Body: files[0], // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          // console.log(err || data)
          if (err || data.statusCode != 200) {
            return this.$message.error('上传失败，刷新重试')
          }
          this.form.question = `<img src='https://${data.Location}'/>`
        }
      )
    },
    // 答案解析富文本
    imgHandlers(state) {
      if (state) {
        //触发input的单击 ，fileBtn换成自己的
        this.$refs.fileBtns.click()
      }
    },
    // 答案解析富文本
    handleChanges(e) {
      const files = Array.prototype.slice.call(e.target.files)
      if (!files) {
        return
      }
      console.log(files)

      cos.putObject(
        {
          Bucket: 'hmhr-31-1313341619' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Key: files[0].name,
          StorageClass: 'STANDARD',
          Body: files[0], // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          if (err || data.statusCode != 200) {
            return this.$message.error('上传失败，刷新重试')
          }
          this.form.answer = `<img src='https://${data.Location}'/>`
        }
      )
    },
    //精选题库修改
    async detail() {
      this.queryId = this.$route.query.id
      if (this.$route.query.id == undefined) return
      const { data } = await detail({ id: this.queryId })
      data.difficulty = Number(data.difficulty)
      data.questionType = Number(data.questionType)
      data.tags = data.tags.split(',')
      this.form = data
    }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
.quill-editor {
  line-height: normal;
  .ql-container.ql-snow {
    line-height: normal !important;
  }
  /deep/.ql-editor {
    height: 200px !important;
  }
}

// UPLOADIMG
.avatar-uploader {
  margin-left: 5px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.optins_item {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
}
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 60px;
  line-height: 60px;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.uploadSpan {
  font-size: 14px;
}
/deep/.el-textarea__inner {
  height: 96px;
  line-height: 1.5;
}

.el-icon-circle-close {
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transform: translate(50%, -50%);
  transform: translate(50%, -50%);
  background: transparent;

  font-size: 18px;
  color: #999;
  // z-index: 999;
}
</style>
