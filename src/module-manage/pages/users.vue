<template>
  <el-card class="box-card">
    <el-row>
      <!-- 头部搜索 -->
      <el-col>
        <el-row type="flex">
          <el-col>
            <el-input
              v-model="userName"
              placeholder="根据用户名搜索"
              style="width: 200px; margin-right: 15px"
            ></el-input>
            <el-button size="small">清空</el-button>
            <el-button size="small" type="primary">搜索</el-button>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <el-button size="small" icon="el-icon-edit" type="success"
                >新增用户</el-button
              >
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <!-- 消息提示 -->
      <el-col style="margin: 20px 0"
        ><el-alert type="info" show-icon :closable="false">
          <template #title> 共{{ counts }}条记录 </template>
        </el-alert></el-col
      >
      <!-- 表单区域 -->
      <el-col>
        <template>
          <el-table :data="userData" style="width: 100%">
            <el-table-column prop="id" label="序号"> </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="phone" label="联系电话"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="permission_group_title" label="权限组名称">
            </el-table-column>
            <el-table-column prop="role" label="角色"> </el-table-column>
            <el-table-column label="操作">
              <template
                ><el-button
                  class="edit-btn"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button
                  class="delete-btn"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 分页 -->
        <div class="footer-page">
          <page></page>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import page from "../components/page-tool.vue";
import { list } from "@/api/base/users.js";
// import user from "../components/user-add.vue";
export default {
  name: "usersInfo",
  data() {
    return {
      userName: "",
      userData: [],
      counts: "",
      page: {
        page: 1,
        pagesize: 10,
      },
    };
  },
  components: {
    page, //分页
    // user, //新增弹层
  },
  created() {
    this.getuserInfo();
  },

  methods: {
    async getuserInfo() {
      const { data } = await list(this.page);
      this.userData = data.list;
      this.counts = data.counts;
    },
  },
};
</script>

<style scoped lang="less">
.edit-btn {
  background-color: #ecf5ff;
  color: #71a7ff;
  border: 1px solid #d3e8ff;
}
.delete-btn {
  background-color: #fef0f0;
  color: #f6827f;
  border: 1px solid #fcd5d5;
}
.footer-page {
  display: flex;
  justify-content: end;
  margin: 20px 0;
}
</style>
