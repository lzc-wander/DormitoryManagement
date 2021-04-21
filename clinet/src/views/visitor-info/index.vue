<template>
  <div class="record-container">
    <h1 class="main-title">访客列表</h1>
    <div class="handle-box">
      <div class="add">
        <el-button type="primary" icon="el-icon-plus" @click="open"
          >添加</el-button
        >
      </div>
      <div class="search-box">
        <el-input
          v-model="searchEntity"
          placeholder="请输入访客姓名"
          class="handle-input mr10"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          style="background-color:#42b983"
          @click="queryVisitor(searchEntity)"
          >搜索</el-button
        >
      </div>
    </div>
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
        <el-table-column prop="visitorname" label="访客姓名" width="80">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="100">
        </el-table-column>
        <el-table-column prop="IDcard" label="身份证号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="buildingName" label="到访宿舍楼">
        </el-table-column>
        <!-- <el-table-column prop="floorLayer" label="楼层" width="50"></el-table-column> -->
        <el-table-column prop="roomNumber" label="宿舍号"> </el-table-column>
        <el-table-column prop="name" label="受访人" width="80">
        </el-table-column>
        <el-table-column label="到访日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              scope.row.startTime | formatDate('YYYY-MM-DD')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="count"
        :page="current"
        @pagination="handlePagination"
        :hidden="tableData.length === 0"
      />
      <el-dialog
        :title="operateType === 'add' ? '新增访客信息' : '更改访客信息'"
        :visible.sync="dialogVisible"
      >
        <el-form class="form" ref="form" :model="formData">
          <el-form-item label="访客姓名" required prop="visitorname">
            <el-input
              v-model.trim="formData.visitorname"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" required prop="phone">
            <el-input
              v-model.trim="formData.phone"
              placeholder="请输入"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="访客身份证号码" required prop="IDcard">
            <el-input
              v-model.trim="formData.IDcard"
              placeholder="请输入"
              maxlength="18"
              onkeyup="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
          <!--  <el-form-item label="请选择宿舍" prop="roomId" :required="true">
        <room-selector v-model="formData.roomId"></room-selector>
      </el-form-item> -->
          <el-form-item label="受访人" required prop="name">
            <el-input
              v-model.trim="formData.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="到访宿舍" prop="roomId" :required="true">
          <room-selector v-model="formData.roomId"></room-selector>
        </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveVisitor()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RoomSelector from '@/components/RoomSelector/index'
import Pagination from '@/components/Pagination'
import { addVisitor } from '@/api/visitor'
import { getVisitors } from '@/api/visitor'
import { deleteVisitor } from '@/api/visitor'
import { updateVisitorInfo } from '@/api/visitor'
import { searchVisitor } from '@/api/visitor'
export default {
  name: 'Repair-record',
  components: {
    RoomSelector,
    Pagination
  },
  data() {
    return {
      tableData: [],
      searchEntity: '',
      formData: {
        visitorname: '',
        IDcard: '',
        name: '',
        phone: '',
        startTime: new Date().valueOf()
      },
      operateType: 'add',
      dialogVisible: false,
      current: 1,
      step: 5,
      count: 0,
      loading: false
    }
  },
  methods: {
    handlePagination({ page, limit }) {
      this.current = page
      this.step = limit
      this.fetchTableData()
    },
    //查询访客信息
    queryVisitor(searchEntity) {
      searchVisitor(searchEntity).then(res => {
        this.tableData = res.data.visitor
      })
    },
    changeSwitch(row) {
      console.log('aaa', row)
      updateRepairStatus(row).then(() => {
        this.$message.success('信息同步成功')
      })
    },
    //添加访客信息
    open() {
      this.dialogVisible = true
    },
    //关闭对话框
    close() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 修改访客信息
    handleEdit(row) {
      this.dialogVisible = true
      this.operateType = 'update'
      this.$nextTick(() => {
        this.formData = JSON.parse(JSON.stringify(row))
      })
    },
    //保存
    saveVisitor() {
      if (this.operateType == 'add') {
        // 添加访客信息
        this.$refs.form.validate(result => {
          if (result) {
            addVisitor(this.formData).then(() => {
              this.$message.success('上报维修信息成功')
              this.$refs.form.resetFields()
              this.getVisitors().then(() => {
                this.$message.success('数据已更新')
              })
            })
            this.dialogVisible = false
          } else {
            this.$message.error('请填充完整信息')
          }
        })
      } else {
        // 修改访客信息
        this.$refs.form.validate(result => {
          if (result) {
            updateVisitorInfo(this.formData).then(() => {
              this.$message.success('修改访客信息成功')
              this.$refs.form.resetFields()
              this.getVisitors().then(() => {
                this.$message.success('数据已更新')
              })
            })
            this.dialogVisible = false
          } else {
            this.$message.error('请填充完整信息')
          }
        })
      }
    },
    async getVisitors() {
      this.loading = true
      let params = {}
      params.step = this.step
      params.current = this.current
      // params.roomId = this.$store.getters.room.id
      await getVisitors(params).then(res => {
        this.tableData = res.data.visitors.rows
        this.count = res.data.visitors.count
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm(`确认要删除 “${row.visitorname}”的维修吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVisitor(row).then(res => {
          console.log(res)
          this.$message({ type: 'success', message: '删除成功！' })
          this.getVisitors().then(() => {
            this.$message.success('数据已更新')
          })
        })
      })
    }
  },
  mounted() {
    this.getVisitors()
  },
  watch: {
    searchEntity: function(val) {
      if (val == '') this.getVisitors()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 5px 20px !important;
}
/deep/.el-cascader {
  display: block;
}
.el-form-item {
  margin: 0;
}
.room-selector {
  padding: 10px 0px;
}
.record-container {
  padding: 50px 60px 0px;
  margin-bottom: 30px;
}
.handle-box {
  width: auto;
  display: flex;
  position: relative;
  margin: 10px 0px;
}
.search-box {
  // float: right;
  position: absolute;
  right: 0px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
/deep/.el-switch__label--left {
  position: relative;
  left: 70px;
  color: #fff;
  z-index: -1111;
  font-size: 12px;
}
/* /deep/.el-switch__core {
  width: 65px !important;
}
/deep/.el-switch__label--right{
  position: relative;
  right: 70px;
  color: #fff;
  z-index: -1111;
  font-size: 12px;
}
/deep/.el-switch__label--left.is-active{
  z-index: 1111;
  color: #000 !important;
}
/deep/.el-switch__label--right.is-active{
  z-index: 1111;
  color: #9c9c9c !important;
} */
/deep/ .el-switch__label {
  position: absolute;
  display: none;
  font-weight: normal;
}
/deep/ .el-switch__label * {
  font-size: 12px;
}
/deep/ .el-switch__label--left {
  z-index: 9;
  left: 22px;
  color: #fff;
}
/deep/ .el-switch__label--right {
  z-index: 9;
  color: #fff;
}
/deep/ .el-switch__label.is-active {
  display: block;
  height: 30px;
  line-height: 30px;
}
/deep/.el-switch__core {
  width: 70px !important;
}
/*  .el-switch,.el-switch__core{
        height:30px;
        line-height:30px;
    }
    .el-switch__core{
        border-radius:15px;
        &:after{
            width:20px;
            height:20px;
            top:4px;
            left:3px;
            z-index:10;
        }
    }
    .el-switch.is-checked .el-switch__core::after{
        margin-left:-23px;
    } */
</style>
