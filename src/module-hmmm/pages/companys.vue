<template>
  <section>
    <div class="dashboard-container">
      <div class="app-container">
        <el-card>
          <!-- 表单  企业管理 -->
          <el-form ref="form" :model="form" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="标签名称">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="城市">
                    <el-select
                      v-model="form.region"
                      placeholder="请选择"
                      style="width: 368px"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="地区">
                    <el-select
                      v-model="form.region"
                      style="width: 368px"
                      placeholder="请选择"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="企业简称">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="状态">
                    <el-select
                      v-model="form.region"
                      style="width: 368px"
                      placeholder="请选择活动区域"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="6" style="padding-left: 40px">
                <div class="grid-content bg-purple">
                  <el-button>清除</el-button>
                  <el-button type="primary">搜索</el-button>
                </div>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <div class="grid-content bg-purple">
                  <el-button type="success">
                    <i class="el-icon-edit"></i>
                    <span>新增用户</span>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <!-- Alert 警告 -->
          <el-alert :closable="false" type="info" show-icon>
            <template>
              <p class="writing">
                共<i>{{ total }}</i
                >条记录
              </p>
            </template>
          </el-alert>
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column class="grid" type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column
              class="grid"
              prop="number"
              label="企业编号"
              width="180"
            >
            </el-table-column>
            <el-table-column
              class="grid"
              prop="shortName"
              label="企业简称"
              width="150"
            >
            </el-table-column>
            <el-table-column class="grid" prop="tags" label="标签" width="230">
            </el-table-column>
            <el-table-column
              class="grid"
              prop="creatorID"
              label="创建者"
              width="180"
            >
            </el-table-column>
            <el-table-column
              class="grid"
              prop="addDate"
              label="创建日期"
              width="180"
            >
            </el-table-column>
            <el-table-column
              class="grid"
              prop="remarks"
              label="备注"
              width="180"
            >
            </el-table-column>
            <el-table-column class="grid" label="状态" width="180">
              <template slot-scope="{ row }">{{
                row.state == 1 ? "启用" : "禁用"
              }}</template>
            </el-table-column>
            <el-table-column class="grid" label="操作">
              <el-button
                type="primary"
                plain
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                type="success"
                plain
                icon="el-icon-check"
                circle
              ></el-button>
              <el-button
                type="warning"
                plain
                icon="el-icon-close"
                circle
              ></el-button>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="end" align="middle" style="height: 60px">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="changeChange"
              :current-page="pages.page"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pages.size"
              layout="sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-row>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import { list } from "../../api/hmmm/companys";
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      pages: {
        page: 1,
        pagesize: 5,
      },
      // 表格
      tableData: [],
      total: 0,
    };
  },

  created() {
    this.tableList();
  },

  methods: {
    async tableList() {
      const { data } = await list(this.pages);
      console.log(data);
      this.tableData = data.items;
      this.total = data.counts;
    },
    changeChange(val) {
      this.pages.page = val;
      this.tableList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
  },
};
</script>

<style scoped lang="less">
.app-main {
  position: relative;
  top: 75px;
}
// .app-container {
//   padding: 20px;
// }
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
:deep(.alert) {
  margin-bottom: 20px;
}
:deep(.el-table__cell) {
  padding: 17px 20px;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
:deep(.grid) {
  padding-left: 20px;
}
.writing {
  font-size: 13px;
  line-height: 18px;
}
</style>
