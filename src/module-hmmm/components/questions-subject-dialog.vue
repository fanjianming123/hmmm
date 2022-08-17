<template>
  <!-- 预览弹框 -->
  <el-dialog :visible="isShowDialog" title="题目预览" @close="close">
    <el-row>
      <el-col :span="6">【题型】：{{ questionType[view.questionType] }}</el-col>
      <el-col :span="6">【编号】：{{ view.id }}</el-col>
      <el-col :span="6">【难度】：{{ difficulty[view.difficulty] }}</el-col>
      <el-col :span="6">【标签】：{{ view.tags }}</el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="6">【学科】：{{ view.subjectName }}</el-col>
      <el-col :span="6">【目录】：{{ view.directoryName }}</el-col>
      <el-col :span="6">【方向】：{{ view.direction }}</el-col>
      <el-col :span="6"><div></div></el-col>
    </el-row>
    <el-divider></el-divider>
    <div>
      <div class="margin">【题干】：</div>
      <div class="margin" style="color: #4242ff" v-html="view.question"></div>
      <div class="margin">
        <div
          class="margin"
          v-if="view.questionType == 1 || view.questionType == 2"
        >
          <p>
            {{ questionType[view.questionType] }}
            选项:（以下选中的选项为正确答案）
          </p>
          <!-- 单选 -->
          <el-radio-group v-model="radio" v-if="view.questionType == 1">
            <div v-for="item in view.options" :key="item.id">
              <el-radio :disabled="item.isRight == 0" :label="item.isRight">{{
                item.code
              }}</el-radio>
            </div>
          </el-radio-group>
          <!-- 复选框组 -->
          <el-checkbox-group
            v-model="checkList"
            v-else-if="view.questionType == 2"
          >
            <el-checkbox
              :label="item.code"
              v-for="item in view.options"
              :key="item.id"
              >{{ item.code }}</el-checkbox
            >
          </el-checkbox-group>
        </div>

        <!-- 简答 -->
        <div v-else></div>
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
      :src="view.videoURL || 'https://v-cdn.zjol.com.cn/277004.mp4'"
    ></video>
    <el-divider></el-divider>
    <el-row
      ><el-col>【答案解析】：</el-col
      ><el-col v-html="view.answer">{{ view.answer }}</el-col></el-row
    >
    <el-divider></el-divider>
    <p>【题目备注】：{{ view.remarks }}</p>
    <template #footer>
      <el-button type="primary" @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  created() {},

  methods: {}
}
</script>

<style scoped></style>
