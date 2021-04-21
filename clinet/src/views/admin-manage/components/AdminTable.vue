<template>
  <div calss="AdminTable">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{
        'background-color': '#eee',
        color: '#000',
        'font-weight': '400'
      }"
    >
      <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
      <el-table-column prop="account" label="工号"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <span class="admin" v-if="scope.row.role === 'admin'">{{
            scope.row.role.toUpperCase()
          }}</span>
          <span class="superAdmin" v-if="scope.row.role === 'superAdmin'">{{
            scope.row.role.toUpperCase()
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理宿舍楼">
        <template slot-scope="scope">
          <div class="room-wrap" v-if="scope.row.role === 'admin'">
            <span v-for="building in scope.row.buildings" :key="building.id">
              {{ building.name }}
            </span>
          </div>
          <div class="all-room" v-else>
            所有宿舍
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AdminTable',
  data() {
    return {}
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    //把row的值传给父组件
    handleEdit(row) {
      this.$emit('edit', row)
    },
    handleDelete(row) {
      this.$emit('del', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.admin {
  color: $color-primary;
}
.superAdmin {
  color: $color-origin;
}
.room-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  span {
    display: block;
    margin: 5px 10px;
  }
}

.all-room {
  color: rgba($color: #000000, $alpha: 0.3);
}
</style>
