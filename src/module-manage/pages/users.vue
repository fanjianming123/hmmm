<template>
  <el-card
    class="box-card"
    v-loading="UserLoading"
    element-loading-text="给我一点时间"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row>
      <!-- 头部搜索 -->
      <el-col>
        <el-row type="flex">
          <el-col>
            <el-input
              v-model="RoleName"
              @keyup.enter.native="enterName"
              placeholder="根据用户名搜索"
              style="width: 200px; margin-right: 15px"
            ></el-input>
            <el-button size="small" @click="deleteInput">清空</el-button>
            <el-button size="small" type="primary" @click="serachName"
              >搜索</el-button
            ><span>冉新</span>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <el-button
                size="small"
                icon="el-icon-edit"
                type="success"
                @click="addIshow"
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
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }"
                ><el-button
                  @click="isShowedit(row)"
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
                  @click="deleteEdit(row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 分页 -->
        <div class="footer-page">
          <page
            :total="counts"
            :paginationPage="paginationPage"
            :paginationPagesize="paginationPagesize"
            @pageChange="pageChange"
            @pageSizeChange="pageSizeChange"
          ></page>
        </div>
      </el-col>
    </el-row>
    <!-- 新增弹层 -->
    <!-- :pageTitle="pageTitle" -->
    <userFrom
      :formBase="formBase"
      :ruleInline="ruleInline"
      :Visible.sync="Visible"
      :text="isEdit"
      :PermissionGroupsList="list"
      @newDataes="getuserInfo"
    ></userFrom>
  </el-card>
</template>

<script>
import page from "../components/page-tool.vue";
import { list, remove } from "@/api/base/users.js";
import { simple } from "@/api/base/permissions.js";
import userFrom from "../components/user-add.vue";
export default {
  name: "usersInfo",
  data() {
    return {
      RoleName: "",
      UserLoading: false,
      userData: [],
      counts: "", //总条数
      pages: {
        page: 1,
        pagesize: 10,
      },
      paginationPage: "", //当前页数
      paginationPagesize: "", //每页显示条目个数，支持 .sync 修饰符
      isEdit: false,
      pageTitle: "#409eff",
      Visible: false,
      list: [], //权限组
      formBase: {
        username: "",
        email: "",
        password: "",
        role: "",
        permission_group_id: "",
        phone: "",
        sex: 1,
        introduction: "",
      }, // 新增表单数据
      ruleInline: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        role: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
      },
    };
  },
  components: {
    page, //分页
    userFrom, //新增弹层
  },
  created() {
    this.getuserInfo(this.pages);
  },

  methods: {
    //获取用户列表
    async getuserInfo(data) {
      this.UserLoading = true;
      const res = await list(data);
      // console.log(res)
      this.userData = res.data.list;
      this.counts = res.data.counts;
      this.paginationPage = res.pages;
      this.paginationPagesize = res.pagesize;
      this.UserLoading = false;
    },
    //确定搜索按钮
    serachName() {
      const data = {
        page: this.pages.page,
        pagesize: this.pages.pagesize,
        username: this.RoleName,
      };
      this.getuserInfo(data);
    },
    //取消搜索按钮
    deleteInput() {
      this.RoleName = "";
      this.getuserInfo(this.pages);
    },
    // 回车
    enterName() {
      this.serachName();
    },
    //新增
    async addIshow() {
      this.Visible = true;
      this.isEdit = false;
      const { data } = await simple();
      this.list = data; //权限组
    },
    //编辑
    isShowedit(val) {
      const newVal = {
        avatar: val.avatar,
        username: val.username,
        email: val.email,
        password: val.password,
        role: val.role,
        permission_group_id: val.permission_group_id,
        phone: val.phone,
        introduction: val.introduction,
        id: val.id,
      };
      // console.log(newVal);
      this.formBase = newVal;
      this.Visible = true;
      this.isEdit = true;
    },
    //点击进入某一页
    pageChange(val) {
      this.pages.page = val;
      this.getuserInfo(this.pages);
    },
    // 每页显示条数
    pageSizeChange(val) {
      this.pages.pagesize = val;
      this.getuserInfo(this.pages);
    },
    //删除
    async deleteEdit(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getuserInfo(this.pages);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
.edit-btn:hover {
  background-color: #409eff;
  color: #fff;
}
.delete-btn:hover {
  background-color: #f56c6c;
  color: #fff;
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
