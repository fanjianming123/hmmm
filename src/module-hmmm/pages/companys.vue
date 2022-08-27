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
                      size="small"
                      style="width: 330px"
                      v-model="form.tags"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="城市">
                    <el-select
                      size="small"
                      v-model="form.province"
                      placeholder="请选择"
                      style="width: 330px"
                      @change="cityChange"
                    >
                      <el-option
                        :value="item"
                        v-for="(item, index) in provincesList"
                        :key="index"
                        >{{ item }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="地区">
                    <el-select
                      size="small"
                      v-model="form.city"
                      style="width: 330px"
                      placeholder="请选择"
                    >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) in cityList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="企业简称">
                    <el-input
                      size="small"
                      v-model="form.shortName"
                      style="width: 330px"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: -20px">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="状态">
                    <el-select
                      size="small"
                      v-model="form.state"
                      style="width: 330px"
                      placeholder="请选择活动区域"
                    >
                      <el-option
                        :label="item.value"
                        :value="item.id"
                        v-for="item in statusOptionsList"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6" style="padding-left: 40px">
                <div class="grid-content bg-purple">
                  <el-button @click="clear" size="small">清除</el-button>
                  <el-button type="primary" size="small" @click="search"
                    >搜索</el-button
                  >
                </div>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <div class="grid-content bg-purple">
                  <el-button
                    type="success"
                    size="small"
                    @click="dialogVisible = true"
                  >
                    <i class="el-icon-edit"></i>
                    <span>新增用户</span>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <!-- Alert 警告 -->
          <el-alert
            :closable="false"
            type="info"
            show-icon
            :title="'共' + total + '条记录'"
          />

          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column class="grid" label="序号" prop="id" width="160">
            </el-table-column>
            <el-table-column class="grid" prop="number" label="企业编号">
            </el-table-column>
            <el-table-column class="grid" prop="shortName" label="企业简称">
            </el-table-column>
            <el-table-column class="grid" prop="tags" label="标签">
            </el-table-column>
            <el-table-column class="grid" prop="creatorID" label="创建者">
            </el-table-column>
            <el-table-column
              class="grid"
              label="创建日期"
              width="200"
              :formatter="formatterTime"
            >
              <template v-slot="{ row }">
                {{ row.addDate | parseTimeByString }}
              </template>
            </el-table-column>
            <el-table-column
              class="grid"
              prop="remarks"
              label="备注"
              width="200"
            >
            </el-table-column>
            <el-table-column class="grid" label="状态">
              <template v-slot="{ row }">{{
                row.state == 1 ? '启用' : '禁用'
              }}</template>
            </el-table-column>
            <el-table-column class="grid" label="操作" width="200">
              <template v-slot="{ row }">
                <!-- 按钮一 -->
                <el-button
                  @click="edit(row)"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  circle
                >
                </el-button>
                <!-- 按钮二 -->
                <el-tooltip
                  placement="top"
                  :content="row.state === 1 ? '禁用' : '启用'"
                >
                  <el-button
                    plain
                    :type="row.state == 1 ? 'warning' : 'success'"
                    :icon="row.state == 1 ? 'el-icon-close' : 'el-icon-check'"
                    circle
                    @click="changeState(row)"
                  ></el-button>
                </el-tooltip>
                <!-- 按钮三 -->
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  circle
                  @click="remove(row)"
                ></el-button>
              </template>
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
    <!-- 新增/编辑弹框 -->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="951px"
      @close="Close"
    >
      <!-- form表单 -->
      <el-form
        ref="formData"
        :rules="rules"
        :model="formDialog"
        label-width="80px"
      >
        <el-form-item label="企业名称" prop="shortName">
          <el-input v-model="formDialog.shortName"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company">
          <el-input v-model="formDialog.company"></el-input>
        </el-form-item>
        <span class="webaddress"
          >https://www.tianyancha.com （在此可查询所属公司全称及简称）</span
        >
        <el-form-item label="城市地区" prop="province">
          <el-col :span="12">
            <el-select
              class="area"
              v-model="formDialog.province"
              placeholder="请选择"
              style="width: 100%"
              @change="selectChange"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="(item, index) in provincesList"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select
              v-model="formDialog.city"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="(item, index) in cityList"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="方向（企业标签）" prop="tags">
          <el-input v-model="formDialog.tags"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="formDialog.remarks"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-row justify="center" type="flex">
          <el-button @click="Close">取 消</el-button>
          <el-button type="primary" @click="goodid">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import {
  list,
  disabled,
  remove,
  add,
  detail,
  update
} from '@/api/hmmm/companys'
import { provinces, citys } from '@/api/hmmm/citys'
import dayjs from 'dayjs'
import baseApi from '@/api/base/baseApi'
export default {
  data() {
    return {
      form: {
        tags: '',
        shortName: '',
        state: '',
        city: '',
        province: ''
      },
      formDialog: {
        city: '',
        company: '',
        id: '',
        province: '',
        remarks: '',
        shortName: '',
        tags: '',
        isFamous: true
      },
      rules: {
        shortName: [
          {
            required: true,
            message: '企业简称不能为空'
          }
        ],
        company: [
          {
            required: true,
            message: '所属公司不能为空'
          }
        ],
        province: [
          {
            required: true,
            message: '请选择省份',
            trigger: 'Change'
          }
        ],
        tags: [
          {
            required: true,
            message: '请输入标签'
          }
        ],
        remarks: [
          {
            required: true,
            message: '备注不能为空'
          }
        ]
      },
      pages: {
        page: 1, //当前页数
        pagesize: 10 //页尺寸
        // tags: "", //标签名称
        // province: "", //企业所在地省份
        // city: "", //企业所在城市
        // shortName: "", //企业简称
        // state:"", //状态  1 启用 0 禁用
      },
      // 表格
      tableData: [],
      total: 0,
      id: '',
      dialogVisible: false,
      provincesList: [], //省
      cityList: [], //市
      statusOptionsList: baseApi.status
    }
  },

  created() {
    this.tableList()
    this.provinces()
  },

  computed: {
    title() {
      return this.formDialog.id ? '编辑用户' : '创建用户'
    }
  },
  // 用来监视城市，如果有值，则地区选择默认选中地区数组中的第一个值
  watch: {
    'form.province': {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.form.city = this.cityList[0]
        }
      }
    }
  },

  methods: {
    // 企业管理列表
    async tableList() {
      const { data } = await list(this.pages)
      console.log(data)
      this.tableData = data.items
      this.total = data.counts
    },

    // 表单
    cityChange(val) {
      this.form.province = val
      this.cityList = citys(val)
      this.form.city = []
    },
    // 添加/编辑(根据有无id)
    async goodid() {
      // 校验表单
      await this.$refs.formData.validate()
      // console.log(this.formDialog.isFamous);
      if (this.formDialog.id) {
        if (this.formDialog.isFamous === 1) {
          this.formDialog.isFamous = true
        } else {
          this.formDialog.isFamous = false
        }
        await update(this.formDialog)
      } else {
        await add(this.formDialog)
      }
      this.dialogVisible = false
      this.tableList()
    },
    // 清除
    clear() {
      this.form = {}
      this.tableList()
    },
    // 分页
    changeChange(val) {
      this.pages.page = val
      this.tableList()
    },
    // 分页(每页多少条)
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 企业管理设置状态
    async changeState(val) {
      // console.log(val);
      await this.$confirm(
        `已成功${val.state === 1 ? '禁用' : '启用'}是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await disabled(
        {
          id: val.id,
          state: val.state === 1 ? 0 : 1
        },
        this.$message.success(`已成功${val.state === 1 ? '禁用' : '启用'}`)
      )
      this.tableList()
    },
    // 删除
    remove(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (this.pages.page > 1 && this.tableData.length === 1) {
            await remove(val)
            this.pages.page -= 1
            this.tableList()
          } else {
            await remove(val)
            this.tableList()
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑
    async edit(val) {
      this.dialogVisible = true
      const res = await detail(val)
      console.log(res)
      this.formDialog = res.data
    },
    // 关闭弹框
    Close() {
      this.dialogVisible = false
      this.$refs.formData.resetFields()
      this.formDialog = {}
    },
    // 省
    provinces() {
      const res = provinces()
      // console.log(res);
      this.provincesList = res
    },
    // 市
    selectChange(val) {
      this.formDialog.province = val
      const res = citys(val)
      // console.log(res);
      this.cityList = res
    },
    // 搜索
    async search() {
      const res = await list({
        tags: this.form.tags,
        shortName: this.form.shortName,
        state: this.form.state,
        city: this.form.city,
        province: this.form.province
      })
      console.log(res)
      this.tableData = res.data.items
    },
    // 格式化事件
    formatterTime(row, column, cellValue, index) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="less">
.app-main {
  position: relative;
  top: 75px;
}
.app-container {
  margin: -20px;
}
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
}
.el-alert--info.is-light {
  background-color: #f4f4f5;
  color: #909399;
  height: 35px;
  margin-bottom: 20px;
}
:deep(.area) {
  padding-right: 10px;
}
.webaddress {
  display: inline-block;
  margin-left: 82px;
  margin-bottom: 32px;
}
</style>
