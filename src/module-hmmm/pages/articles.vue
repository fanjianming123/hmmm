<template>
  <div class="container">
    <el-card>
      <!-- 头部 -->
      <div>
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-form :model="searchData">
              <el-row :gutter="20">
                <el-col :span="9">
                  <el-form-item label="关键字" label-width="80px">
                    <el-input
                      style="width: 100"
                      v-model="searchData.keyword"
                      placeholder="根据文章标题搜索"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="状态" label-width="80px">
                    <el-select v-model="searchData.state" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-row>
                    <el-button :span="12" @click="clear">清除</el-button>
                    <el-button :span="12" type="primary" @click="search"
                      >搜索</el-button
                    >
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="3">
            <el-button type="success" icon="el-icon-edit" @click="isShow = true"
              >新增技巧</el-button
            >
          </el-col>
        </el-row>
        <el-alert type="info" show-icon :closable="false">
          <template #title
            >数据一共<span>{{ counts }}</span
            >条</template
          >
        </el-alert>
      </div>
      <!-- 内容 -->
      <el-table :data="lists" style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="title" label="文章标题">
          <template v-slot="{ row }">
            {{ row.title }}
            <i
              class="el-icon-film vidoo"
              @click="video(row)"
              v-show="row.videoURL ? true : false"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="visits" label="阅读数"> </el-table-column>
        <el-table-column prop="username" label="录入人"> </el-table-column>
        <el-table-column prop="createTime" label="录入时间">
          <template v-slot="{ row }">
            {{ row.createTime | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template v-slot="{ row }">
            {{ row.state === 0 ? '已禁用' : '已启用' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot="{ row }">
            <el-row type="flex" justify="space-around">
              <el-button type="text" @click="titleShow(row)">预览</el-button>
              <el-button type="text" @click="off(row)">{{
                row.state === 0 ? '启用' : '禁用'
              }}</el-button>
              <el-button
                type="text"
                :disabled="row.state === 1"
                @click="edit(row)"
                >修改</el-button
              >
              <el-button
                type="text"
                :disabled="row.state === 1"
                @click="del(row.id)"
                >删除</el-button
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-row type="flex" justify="end">
        <el-pagination
          style="margin-top: 20px"
          hide-on-single-page
          background
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          :current-page="queryInfo.page"
          layout="prev, pager, next, sizes, jumper"
          :total="counts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 视频播放弹层 -->
    <div class="video-preview" v-show="isvideo">
      <el-button
        class="btn"
        @click="isvideo = false"
        icon="el-icon-close"
      ></el-button>
      <videos :src="videourl"></videos>
    </div>
    <!-- 预览弹层 -->
    <el-dialog
      title="预览文章"
      width="800px"
      :visible.sync="isTitle"
      @close="isTitle = false"
    >
      <div>
        <h2>{{ titleList.title }}</h2>
        <p class="pinfo">
          <span>{{ titleList.createTime | parseTimeByString }}</span>
          <span>{{ titleList.username }}</span>
          <span><i class="el-icon-view"></i> {{ titleList.visits }}</span>
        </p>
        <div class="count" v-html="titleList.articleBody"></div>
      </div>
    </el-dialog>
    <!-- 添加弹层 -->
    <el-dialog
      :title="itemid ? '修改文章' : '新增文章'"
      :visible.sync="isShow"
      width="850px"
      @close="close"
    >
      <el-form :rules="simpleRule" :model="addFormData" ref="addref">
        <el-form-item label="文章标题" prop="title" label-width="20%">
          <el-input
            placeholder="请输入文章标签"
            v-model="addFormData.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleBody" label-width="20%">
          <editor :count.sync="addFormData.articleBody"></editor>
        </el-form-item>
        <el-form-item label="视频地址" label-width="20%">
          <el-input
            placeholder="请输入视频地址"
            v-model="addFormData.videoURL"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import videos from '../components/video.vue'
import editor from '../components/editor.vue'
import { list, changeState, remove, update, add } from '@/api/hmmm/articles'
import { simple } from '@/api/hmmm/subjects'
export default {
  name: 'articles',
  components: { editor, videos },
  data() {
    return {
      videourl: 'https://v-cdn.zjol.com.cn/277003.mp4',
      isvideo: false,
      titleList: {}, // 预览数据
      isTitle: false, // 预览弹层
      // 搜索数据
      searchData: {
        keyword: '',
        state: '',
        page: 1,
        pagesize: 10
      },
      // 新增数据
      addFormData: {
        articleBody: '',
        title: '',
        videoURL: ''
      },
      statuss: '',
      value: '',
      // 搜索状态
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      // 页码
      queryInfo: {
        page: 1,
        pagesize: 10
      },
      // 添加规则
      simpleRule: {
        articleBody: [
          { required: true, trigger: 'blur', message: '请输入文章内容' }
        ],
        title: [{ required: true, trigger: 'blur', message: '请输入文章标题' }]
      },
      itemid: '', // 数据id
      counts: 0, // 总条数
      lists: [], // 数据列表
      simpleList: [], // 学科列表
      isShow: false, // 弹层状态
      isget: false // 获取列表状态
    }
  },
  created() {
    this.list(this.queryInfo)
    this.simple()
  },
  methods: {
    video(row) {
      // console.log(row);
      this.videourl = row.videoURL
      this.isvideo = true
    },
    // 预览
    titleShow(row) {
      this.isTitle = true
      this.titleList = row
    },
    // 修改
    async edit(row) {
      this.isShow = true
      console.log(row)
      this.addFormData = {
        articleBody: row.articleBody,
        title: row.title,
        videoURL: row.videoURL
      }
      this.itemid = row.id
    },
    // 搜索
    async search() {
      if (this.searchData.keyword === '' && this.searchData.state === '') {
        this.list(this.queryInfo)
        return
      }
      this.isget = true
      this.list(this.searchData)
    },
    // 清除
    clear() {
      this.isget = false
      this.searchData = {
        keyword: '',
        page: 1,
        pagesize: 10
      }
    },
    // 获取目录名称
    async simple() {
      const res = await simple()
      this.simpleList = res.data
    },
    // 添加目录
    async btnOk() {
      await this.$refs.addref.validate()
      if (this.itemid) {
        await update({ ...this.addFormData, id: this.itemid })
        this.$message.success('修改成功')
      } else {
        await add(this.addFormData)
        this.$message.success('添加成功')
      }
      this.list(this.queryInfo)
      this.close()
    },
    // 删除数据
    async del(id) {
      const len = this.lists.length
      try {
        await this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await remove({ id })
        this.$message.success('删除成功')
        if (len === 1 && this.queryInfo.page > 1) {
          this.queryInfo.page--
        }
        this.list(this.queryInfo)
      } catch (error) {}
    },
    // 关弹层
    close() {
      this.isShow = false
      this.itemid = ''
      this.addFormData = {
        articleBody: '',
        title: '',
        videoURL: ''
      }
      this.$refs.addref.resetFields()
    },
    // 条数改变
    handleSizeChange(val) {
      if (this.isget) {
        this.list(this.searchData)
        this.searchData.pagesize = val
      } else {
        this.list(this.queryInfo)
        this.queryInfo.pagesize = val
      }
    },
    // 页码改变
    handleCurrentChange(val) {
      if (this.isget) {
        this.list(this.searchData)
        this.searchData.page = val
      } else {
        this.list(this.queryInfo)
        this.queryInfo.page = val
      }
    },
    // 获取列表
    async list(info) {
      const res = await list(info)
      console.log(res)
      this.lists = res.data.items
      this.queryInfo.page = Number(res.data.page)
      this.queryInfo.pagesize = Number(res.data.pagesize)
      this.counts = res.data.counts
    },
    // 改状态
    off(row) {
      const state = row.state === 0 ? 1 : 0
      changeState({
        id: row.id,
        state
      })
      row.state = state
      this.$message.success('修改状态成功')
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table th {
  border-bottom: 2px solid #e8e8e8 !important;
  background-color: #fafafa !important;
}

.vidoo {
  font-size: 18px;
  color: #0000ff;

  &:hover {
    cursor: pointer;
  }
}

.pinfo {
  span {
    margin: 0 10px;

    i {
      margin-right: 8px;
    }
  }
}

.count {
  background-color: #f5f5f5;
  padding: 20px 10px 30px;
  border-top: 1px dashed #d1d1d1;
  border-bottom: 1px dashed #d1d1d1;
}

.video-preview {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 9999;
  .btn {
    font-size: 25px;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 5px rgb(0 0 0 / 40%);
    border-radius: 50%;
    text-align: center;
    // line-height: 50px;
    padding: 0;
    color: #fff;
    border: none;
  }
}
</style>
