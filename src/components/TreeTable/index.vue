<template>
  <el-table
    :data="formatData"
    :row-class-name="rowClassStatus"
    v-loading="listLoading"
    element-loading-text="给我一点时间"
    fit
    highlight-current-row
    style="width: 100%"
    default-expand-all
    :tree-props="{ children: 'childs', hasChildren: 'points' }"
  >
    <el-table-column
      v-for="(column, index) in columns"
      :key="column.prop"
      :width="column.width"
      :prop="column.prop"
      :label="column.text"
    >
      <template slot-scope="scope">
        <expand
          v-if="column.render"
          :render="column.render"
          :row="scope.row"
          :index="index"
          :column="column"
        >
        </expand>
        <span v-else>
          <template v-if="column.value == 'title'">
            <i
              class="el-icon-folder-opened"
              style="margin-left: 20px"
              v-if="scope.row._level === 0"
            />
            <i
              class="el-icon-document-remove"
              style="margin-left: 40px"
              v-if="
                (scope.row._level === 1 || scope.row._level === 2) &&
                !scope.row.is_point
              "
            />
            <i
              class="el-icon-view"
              style="margin-left: 60px"
              v-if="scope.row.is_point"
            />
            {{ scope.row[column.value] }}
          </template>
          <template v-if="column.value == 'code'">
            {{ scope.row[column.value] }}
          </template>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="260" align="center">
      <template slot-scope="{ row }"
        ><el-button
          @click="handleUpdate(row)"
          class="edit-btn"
          type="primary"
          icon="el-icon-edit"
          circle
        ></el-button>
        <el-button
          @click="handleDelete(row)"
          class="delete-btn"
          type="danger"
          icon="el-icon-delete"
          circle
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Utils from "./utils/dataTranslate.js";
import expand from "./utils/expand";
export default {
  name: "treeTable",
  components: { expand },
  props: {
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    listLoading: {
      type: Boolean,
      default: false,
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
  },
  computed: {
    // 格式化数据源
    formatData: function () {
      const me = this;
      if (me.treeStructure) {
        const data = Utils.treeToArray(
          me.data,
          null,
          null,
          me.defaultExpandAll
        );
        return data;
      }
      return me.data;
    },
  },
  methods: {
    rowClassStatus: function () {
      this.$emit("rowClassStatus");
    },
    handleUpdate(row) {
      this.$emit("handleUpdate", row);
    },
    handleDelete(row) {
      this.$emit("removeUser", row);
    },
  },
};
</script>
<style rel="stylesheet/css">
.ivu-icon-ios-folder-outline {
  content: "\F434";
}
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
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
