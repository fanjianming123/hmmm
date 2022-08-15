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
        <Newmenu :Visible.sync="Visible" :text="text"></Newmenu>
      </el-col>
      <!-- 表单区域 -->
      <el-col>
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'childs', hasChildren: 'points' }"
        >
          <el-table-column label="标题" width="200">
            <template slot-scope="{ row }">
              <i
                class="el-icon-folder-opened"
                v-if="row.childs"
                @click="ad(row)"
              ></i>
              <i
                class="el-icon-document-remove"
                v-if="!row.childs && !row.points"
              ></i>
              <i class="el-icon-view" v-else></i>
              {{ row.title }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="权限点代码"> </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            show-overflow-tooltip
            width="120"
          >
            <template slot-scope="{ row }"
              ><el-button
                @click="permissionsMenus(row)"
                class="edit-btn"
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="removeCurrent(row)"
                class="delete-btn"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { list, remove } from "@/api/base/menus";
import Newmenu from "../components/menu-add.vue";
export default {
  data() {
    return {
      Visible: false,
      tableData: [],
      textTitle: false,
    };
  },
  components: {
    Newmenu,
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
      const res = await list();
      this.tableData = res.data;
      console.log(res);
    },
    //新增弹层
    addMenus() {
      this.Visible = true;
      this.textTitle = true;
    },
    //编辑弹层
    permissionsMenus(row) {
      this.Visible = true;
      this.textTitle = false;
    },
    //删除
    removeCurrent(row) {
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
          this.getMenusList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    ad(row) {
      console.log(row);
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
</style>
