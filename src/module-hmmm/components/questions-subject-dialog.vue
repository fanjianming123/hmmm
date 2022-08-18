<template>
  <!-- 预览弹框 -->
  <el-dialog :visible="previewVisible" title="题目预览" @close="onclose">
    <el-row>
      <el-col :span="6">
        【题型】：
        {{ list.questionType | questionTypeFilter }}
      </el-col>
      <el-col :span="6">【编号】：{{ list.id }}</el-col>
      <el-col :span="6"
        >【难度】：{{ list.difficulty | difficultyFilter }}</el-col
      >
      <el-col :span="6">【标签】：{{ list.tags }}</el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="6">【学科】：{{ list.subjectName }}</el-col>
      <el-col :span="6"
        >【目录】：{{
          !!list.directoryName ? list.directoryName : '无'
        }}</el-col
      >
      <el-col :span="6">【方向】：{{ list.direction }}</el-col>
      <el-col :span="6"><div></div></el-col>
    </el-row>
    <el-divider></el-divider>
    <div>
      <div class="margin">【题干】：</div>
      <div class="margin" style="color: #4242ff" v-html="list.question"></div>
      <div class="margin">
        <div
          class="margin"
          v-if="list.questionType == 1 || list.questionType == 2"
        >
          <p>
            {{ list.questionType | difficultyFilter }}
            选项:（以下选中的选项为正确答案）
          </p>
          <!-- 单选 -->
          <el-radio-group v-model="radio" v-if="list.questionType == 1">
            <div v-for="item in list.options" :key="item.id">
              <el-radio :disabled="item.isRight == 0" :label="item.isRight">
                {{ item.title }}
              </el-radio>
            </div>
          </el-radio-group>
          <!-- 复选框组 -->
          <el-checkbox-group
            v-model="checkList"
            v-else-if="list.questionType == 2"
          >
            <div v-for="item in list.options" :key="item.id">
              <el-checkbox :label="item.isRight" :disabled="item.isRight == 0">
                {{ item.title }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <!-- 简答 -->
        <div v-else>
          {{ list.tags }}
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <p>
      【参考答案】：<el-button
        type="danger"
        size="small"
        @click="showVideo = true"
        >视频答案预览</el-button
      >
    </p>
    <video
      controls="controls"
      v-if="showVideo"
      :src="list.videoURL || 'https://v-cdn.zjol.com.cn/277004.mp4'"
      style="width: 900px"
    ></video>
    <el-divider></el-divider>
    <el-row class="aaa">
      <el-col :span="3">【答案解析】：</el-col>
      <el-col v-html="list.answer" :span="21">{{ list.answer }}</el-col>
    </el-row>
    <el-divider></el-divider>
    <p>【题目备注】：{{ list.remarks }}</p>
    <template #footer>
      <el-button type="primary" @click="onclose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import * as questions from '@/api/hmmm/questions.js'
export default {
  data() {
    return {
      showVideo: false,
      list: [],
      radio: 1,
      checkList: ['', 1]
    }
  },
  props: {
    previewVisible: {
      type: Boolean,
      required: true
    }
  },
  created() {},

  methods: {
    async getList(val) {
      // console.log(val)

      const res = await questions.detail({ id: val.id })
      // console.log(res)
      this.list = res.data
    },
    onclose() {
      this.$emit('update:previewVisible', false)
      this.showVideo = false
      this.list = []
    }
  }
}
</script>

<style scoped></style>
