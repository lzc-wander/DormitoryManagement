<template>
  <el-table :data="studentsData" style="width: 100%" :stripe="true">
    <el-table-column prop="name" label="姓名" width="80"></el-table-column>
    <el-table-column prop="account" label="学号"></el-table-column>
    <el-table-column prop="phone" label="电话号"></el-table-column>
    <el-table-column prop="college" label="学院"></el-table-column>
    <el-table-column
      prop="major"
      label="专业"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column prop="floorLayer" label="宿舍楼层"></el-table-column>
    <el-table-column
      prop="roomNumber"
      label="房间号"
      width="80"
    ></el-table-column>
    <el-table-column label="入住时间" show-overflow-tooltip>
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{
          scope.row.checkTime | formatDate('YYYY-MM-DD')
        }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'StudentList',
  data() {
    return {}
  },
  props: {
    studentsData: {
      type: Array,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
