<template>
  <div class="record-container">
    <h1 class="main-title">报修列表</h1>
    <div class="handle-box">
      <div class="add">
        <el-button type="primary" icon="el-icon-plus" @click="open"
          >添加</el-button
        >
      </div>
      <div class="search-box">
        <el-input
          v-model="searchEntity"
          placeholder="请输入姓名或者工号"
          class="handle-input mr10"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          style="background-color:#42b983"
          @click="queryRepair(searchEntity)"
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
        <el-table-column prop="goodsName" label="物品名称" width="100">
        </el-table-column>
        <el-table-column prop="detail" label="报修详情" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="type" label="维修类型" width="80">
        </el-table-column>
        <!-- <el-table-column prop="roomId" label="宿舍号"> </el-table-column> -->
        <el-table-column prop="name" label="报修人" width="80">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="100">
        </el-table-column>
        <el-table-column label="报修时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              scope.row.checkTime | formatDate('YYYY-MM-DD')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
        </el-table-column>
        <el-table-column label="操作">
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

      <el-dialog
        :title="operateType === 'add' ? '新增维修信息' : '更改维修信息'"
        :visible.sync="dialogVisible"
      >
        <el-form class="form" ref="form" :model="formData">
          <el-form-item label="物品名称" required prop="goodsName">
            <el-input
              v-model.trim="formData.goodsName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="报修详情" required prop="detail">
            <el-input
              v-model.trim="formData.detail"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <!--  <el-form-item label="请选择宿舍" prop="roomId" :required="true">
        <room-selector v-model="formData.roomId"></room-selector>
      </el-form-item> -->
          <el-form-item label="报修人" required prop="name">
            <el-input
              v-model.trim="formData.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" required prop="phone">
            <el-input
              v-model.trim="formData.phone"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <!--  <el-form-item label="报修时间" required prop="time">
        <el-input v-model.trim="formData.time" placeholder="请输入"></el-input>
      </el-form-item> -->
          <el-form-item label="维修类型" required prop="type">
            <el-radio v-model="formData.type" :label="1">普通维修</el-radio>
            <el-radio v-model="formData.type" :label="2">紧急维修</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveRepair()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RoomSelector from '@/components/RoomSelector/index'
import { addRepair } from '@/api/repair'
import { getRepairsByRoom } from '@/api/repair'
import { deleteRepair } from '@/api/repair'
import { updateRepairInfo } from '@/api/repair'
import { searchRepair } from '@/api/repair'
export default {
  name: 'Repair-record',
  components: {
    RoomSelector
  },
  data() {
    return {
      tableData: [],
      searchEntity: '',
      formData: {
        goodsName: '',
        detail: '',
        roomId: null,
        name: '',
        phone: '',
        userId: null,
        checkTime: new Date().valueOf(),
        type: 1,
        id: null
      },
      operateType: 'add',
      dialogVisible: false,
      current: 1,
      step: 5,
      loading: false
    }
  },
  methods: {
    //查询维修信息
    queryRepair(searchEntity) {
      searchRepair(searchEntity).then(res => {
        this.tableData = res.data.repairs
      })
    },
    //添加报修信息
    open() {
      this.dialogVisible = true
    },
    //关闭对话框
    close() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 修改报修信息
    handleEdit(row) {
      this.dialogVisible = true
      this.operateType = 'update'
      this.$nextTick(() => {
        this.formData = JSON.parse(JSON.stringify(row))
        if (this.formData.type == '普通维修') {
          this.formData.type = 1
        } else {
          this.formData.type = 2
        }
      })
    },
    //保存
    saveRepair() {
      if (this.operateType == 'add') {
        this.$refs.form.validate(result => {
          if (result) {
            this.formData.roomId = this.$store.getters.room.id
            this.formData.userId = this.$store.getters.allUserInfo.id
            addRepair(this.formData).then(() => {
              this.$message.success('上报维修信息成功')
              this.$refs.form.resetFields()
              this.getRepairsByRoom().then(() => {
                this.$message.success('数据已更新')
              })
            })
            this.dialogVisible = false
          } else {
            this.$message.error('请填充完整信息')
          }
        })
      } else {
        this.$refs.form.validate(result => {
          if (result) {
            this.formData.roomId = this.$store.getters.room.id
            this.formData.userId = this.$store.getters.allUserInfo.id
            updateRepairInfo(this.formData).then(() => {
              this.$message.success('修改维修信息成功')
              this.$refs.form.resetFields()
              this.getRepairsByRoom().then(() => {
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
    async getRepairsByRoom() {
      this.loading = true
      let params = {}
      params.step = this.step
      params.current = this.current
      params.roomId = this.$store.getters.room.id
      await getRepairsByRoom(params).then(res => {
        this.tableData = res.data.repairs.rows
        this.tableData.map(item => {
          if (item.type == 1) {
            item.type = '普通维修'
          } else {
            item.type = '紧急维修'
          }
          if (item.status == 1) {
            item.status = '待处理'
          } else {
            item.status = '已完成'
          }
          return item
        })
        this.count = res.data.repairs.count
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm(`确认要删除 “${row.goodsName}”的维修吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRepair(row).then(res => {
          console.log(res)
          this.$message({ type: 'success', message: '删除成功！' })
          this.getRepairsByRoom().then(() => {
            this.$message.success('数据已更新')
          })
        })
      })
    }
  },
  mounted() {
    this.getRepairsByRoom()
  },
  watch: {
    searchEntity: function(val) {
      if (val == '') this.getRepairsByRoom()
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
</style>
