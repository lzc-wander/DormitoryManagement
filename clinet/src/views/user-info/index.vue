<template>
  <div id="UserInfo" class="page-wrapper">
    <!-- 选择器 -->
    <h1 class="main-title">选择学生</h1>
    <div class="wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="级联选择">
          <GroupSelector :selectorData="selectorData" />
          <!-- <el-button
            type="primary"
            @click="fetchUserInfo('id', selectorData.userId)"
            >搜索</el-button
          > -->
          <el-button type="primary" @click="searchStudentInfo()"
            >搜索</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="按学号搜索">
          <StudentSearcher v-model="searchContent" />
          <el-button
            type="primary"
            @click="fetchUserInfo('account', searchContent)"
            >搜索</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 选择器 -->

    <h1 class="main-title">详细信息</h1>
    <div class="wrapper userInfo-wrapper">
      <div class="roomInfo-card" v-if="person">
        <PanelGroup :userInfo="studentInfo" />
      </div>
      <el-row :gutter="20" class="top" v-if="person">
        <el-col :md="24">
          <div class="userInfo-card">
            <div class="title">用户信息</div>
            <hr />
            <div class="info-item">
              <label>姓名:</label>
              <span>{{ studentInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>学号:</label>
              <span>{{ studentInfo.account }}</span>
            </div>
            <div class="info-item">
              <label>手机号:</label>
              <span>{{ studentInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label>学院:</label>
              <span>{{ studentInfo.college }}</span>
            </div>
            <div class="info-item">
              <label>班级:</label>
              <span>{{ studentInfo.major }}</span>
            </div>
            <div class="info-item">
              <label>注册日期:</label>
              <span>{{
                $moment(studentInfo.createdAt).format('YYYY-MM-DD')
              }}</span>
            </div>
          </div>
        </el-col>
        <!-- <el-col :md="12"> -->

        <!-- </el-col> -->
      </el-row>
      <div class="add" v-if="all">
        <el-button type="primary" icon="el-icon-plus" @click="open"
          >添加</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :stripe="true"
        :header-cell-style="{
          'background-color': '#eee',
          color: '#000',
          'font-weight': '400'
        }"
        border
        v-loading="loading"
        v-if="all"
      >
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column
          prop="account"
          label="学号"
          width="110"
        ></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column
          prop="college"
          label="学院"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="班级"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          prop="buildingName"
          label="宿舍楼"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="floorLayer"
          label="楼层"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="roomNumber"
          label="房间号"
          width="70"
        ></el-table-column>
        <!-- <el-table-column label="入住时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            scope.row.checkTime | formatDate('YYYY-MM-DD')
          }}</span>
        </template>
      </el-table-column> -->
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
      <Pagination
        :total="count"
        :page="current"
        @pagination="handlePagination"
        :hidden="tableData.length === 0"
        v-if="all"
      />
      <div class="bottom main-card" style="margin-top: 20px" v-if="person">
        <div class="process-item">
          <span>早起概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.getupProb * 100).toFixed(2))"
          ></el-progress>
        </div>
        <div class="process-item">
          <span>早归概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.backProb * 100).toFixed(2))"
            status="success"
          ></el-progress>
        </div>
        <div class="process-item">
          <span>打扫概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.cleanProb * 100).toFixed(2))"
            status="warning"
          ></el-progress>
        </div>
      </div>
    </div>
    <el-dialog
      :title="operateType === 'add' ? '新增学生' : '更改学生信息'"
      :visible.sync="dialogVisible"
    >
      <el-form class="form" ref="form" :model="formData">
        <el-form-item label="姓名" required prop="name">
          <el-input
            v-model.trim="formData.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号" required prop="account">
          <el-input
            v-model.trim="formData.account"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" required prop="password">
          <el-input
            v-model.trim="formData.password"
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
        <el-form-item label="学院" required prop="college">
          <el-input
            v-model.trim="formData.college"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级" required prop="major">
          <el-input
            v-model.trim="formData.major"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择想要入住的宿舍" prop="roomId" :required="true">
          <room-selector v-model="formData.roomId"></room-selector>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="saveStudent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div class="no-data-tips main-card wrapper" >请选择用户</div> -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import RoomSelector from '@/components/RoomSelector/index'
import GroupSelector from '@/components/GroupSelector'
import StudentSearcher from './components/StudentSearcher'
import PanelGroup from './components/PanelGroup'
import { getStudents } from '@/api/user'
import { addStudent } from '@/api/user'
import { updateStudentInfo } from '@/api/user'
import { deleteStudent } from '@/api/user'
import { getAllStudents } from '@/api/user'
import { getSearchStudents } from '@/api/user'
import { getManageBuildings } from '@/api/building'
import { getFloors } from '@/api/floor'
import { getRooms } from '@/api/room'
import { getStudentInfoByIdOrAccount } from '@/api/user'
export default {
  name: 'UserInfo',
  components: {
    GroupSelector,
    StudentSearcher,
    PanelGroup,
    RoomSelector,
    Pagination
  },
  data() {
    return {
      selectorData: {
        buildingId: null,
        floorId: null,
        roomId: null,
        userId: null
      },
      loading: false,
      all: true,
      person: false,
      buildingsData: [],
      floorsData: [],
      roomsData: [],
      tableData: [],
      dialogVisible: false,
      formData: {
        name: '',
        account: '',
        password: '',
        phone: '',
        college: '',
        major: '',
        roomId: null,
        checkTime: new Date().valueOf()
      },
      operateType: 'add',
      current: 1,
      count: 0,
      step: 5,
      searchOption: {},
      searchContent: '',
      studentInfo: {}
    }
  },
  methods: {
    //分页
    handlePagination({ page, limit }) {
      this.current = page
      this.step = limit
      this.searchStudentInfo()
    },
    async getAllStudents() {
      this.loading = true
      let params = {}
      params.step = this.step
      params.current = this.current
      console.log('', params)
      await getAllStudents(params).then(res => {
        this.tableData = res.data.result.rows
        this.count = res.data.result.count
        this.loading = false
      })
    },
    //级联搜索
    async searchStudentInfo() {
      this.all = true
      this.person = false
      this.loading = true
      this.searchOption = this.selectorData
      this.searchOption.current = this.current
      this.searchOption.step = this.step
      getSearchStudents(this.searchOption).then(res => {
        let result = res.data.result.rows
        this.count = res.data.result.count
        if (result instanceof Array) {
          this.tableData = result
        } else {
          this.tableData = [result]
        }
        this.loading = false
      })
    },
    // 按学号或者姓名精确搜索
    fetchUserInfo(type, value) {
      getStudentInfoByIdOrAccount({ type, value }).then(res => {
        this.person = true
        this.all = false
        this.studentInfo = res.data
      })
    },
    open() {
      this.dialogVisible = true
      this.operateType = 'add'
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    //修改学生信息
    handleEdit(row) {
      this.operateType = 'update'
      this.dialogVisible = true
      console.log('wwww', row)
      this.$nextTick(() => {
        this.formData = JSON.parse(JSON.stringify(row))
        this.formData.password = ''
      })
      this.formData.roomId = row.roomId
      console.log('', this.formData.roomId)
    },
    // 删除学生
    handleDelete(row) {
      this.$confirm(`确认要删除 “${row.name}” 学生吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStudent(row).then(res => {
          console.log(res)
          this.$message({ type: 'success', message: '删除成功！' })
          this.searchStudentInfo().then(() => {
            this.$message.success('数据已更新')
          })
        })
      })
    },
    close() {
      //重置表单
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    saveStudent() {
      if (this.operateType == 'add') {
        this.$refs.form.validate(result => {
          if (result) {
            addStudent(this.formData).then(() => {
              this.$message.success('新增学生成功')
              this.$refs.form.resetFields()
              this.searchStudentInfo().then(() => {
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
            updateStudentInfo(this.formData).then(() => {
              this.$message.success('修改学生成功')
              this.$refs.form.resetFields()
              this.searchStudentInfo().then(() => {
                this.$message.success('数据已更新')
              })
            })
            this.dialogVisible = false
          } else {
            this.$message.error('请填充完整信息')
          }
        })
      }
    }
  },
  mounted() {
    if (this.$route.query.userId) {
      this.fetchUserInfo('id', this.$route.query.userId)
    }
    this.getAllStudents()
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 40px 0;
}
/deep/.el-cascader {
  display: block;
}
.add {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-form-item {
  margin: 0;
}
/deep/.el-dialog__body {
  padding: 5px 20px !important;
}
.el-tab-pane {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
>>> .el-tabs__content {
  padding: 40px 20px;
  width: 100%;
}

.userInfo-wrapper {
  margin-bottom: 30px;
  margin-top: 20px;
  .top {
    .roomInfo-card {
      background-color: #fff;
      padding: 30px;
    }
    .userInfo-card {
      background-color: #fff;
      padding: 30px;
      height: 280px;
      box-sizing: content-box;
      .title {
        font-weight: bold;
        color: $color-primary;
        font-size: 22px;
        margin-bottom: 20px;
      }
      .info-item {
        margin: 20px 0;
      }
      :nth-child(3) {
        margin-top: 40px;
      }
    }
  }
  .bottom {
    .process-item {
      span {
        display: block;
        margin: 10px 0;
      }
    }
    :first-child span {
      margin-top: 0px;
    }
  }
}
</style>
