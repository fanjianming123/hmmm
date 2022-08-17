<template>
  <el-card class="box-card">
    <el-row>
      <el-col style="margin-bottom: 20px">
        <el-row type="flex" justify="end">
          <el-button
            size="small"
            icon="el-icon-edit"
            type="success"
            @click="addMenus"
            >新增权限组</el-button
          >
        </el-row>
        <!-- 新增弹出层 -->
        <Newmenu
          ref="menus"
          :Visible.sync="Visible"
          :text="text"
          :PointDataList="treeList"
          @newDataes="getMenusList"
        ></Newmenu>
      </el-col>
      <!-- 表单区域 -->
      <el-col>
        <TreeTable
          :data="treeList"
          :columns="columns"
          :treeStructure="true"
          :defaultExpandAll="true"
          :listLoading="MenusLoading"
          @removeUser="removeUser"
          @handleUpdate="handleUpdate"
        ></TreeTable>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { list, remove } from "@/api/base/menus";
import Newmenu from "../components/menu-add.vue";
import TreeTable from "@/components/TreeTable";
export default {
  name: "menus",
  data() {
    return {
      Visible: false,
      treeList: [],
      textTitle: false,
      MenusLoading: false,
      columns: [
        { text: "标题", prop: "title", value: "title", width: 220 },
        { text: "权限点代码", prop: "code", value: "code" },
      ],
    };
  },
  components: {
    Newmenu, // 新增弹出层
    TreeTable, // 表格组件
  },
  created() {
    this.getMenusList();
  },
  computed: {
    text() {
      return this.textTitle ? "创建菜单" : "编辑菜单";
    },
  },
  methods: {
    async getMenusList() {
      this.MenusLoading = true;
      const res = await list();
      this.treeList = res.data;
      this.MenusLoading = false;
      // console.log(res);
    },
    //新增弹层
    addMenus() {
      this.Visible = true;
      this.textTitle = true;
      this.$refs.menus.handleResetForm(); //进入前重置表单清空
    },
    //编辑弹层
    handleUpdate(row) {
      //点击编辑触发刚刚那个方法，把id传过去即可
      this.Visible = true; //弹层显示
      this.textTitle = false; //标题名
      console.log(row);
      // this.$refs.menus.formMenu = row;
      const f = row.childs || row.points ? "menu" : "points";
      this.$refs.menus.changeType(f);
      this.$refs.menus.hanldeEditForm(row.id); //ref是弹出框的ref，拿到他身上的这个方法hanldeEditForm
    },
    //删除
    removeUser(row) {
      // console.log(row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getMenusList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
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
.delete-btn {
  background-color: #fef0f0;
  color: #f6827f;
  border: 1px solid #fcd5d5;
}
.edit-btn:hover {
  background-color: #409eff;
  color: #fff;
}
.delete-btn:hover {
  background-color: #f56c6c;
  color: #fff;
}
i {
  font-size: 16px;
}
</style>
