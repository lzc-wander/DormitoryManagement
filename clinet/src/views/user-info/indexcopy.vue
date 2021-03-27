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
      <!--   <el-row :gutter="20" class="top">
        <el-col :md="12">
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
              <label>注册日期:</label>
              <span>{{
                $moment(studentInfo.createdAt).format('YYYY-MM-DD')
              }}</span>
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <div class="roomInfo-card">
            <PanelGroup :userInfo="studentInfo" />
          </div>
        </el-col>
      </el-row> -->
      <div class="add">
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
      <!--  <div class="bottom main-card" style="margin-top: 20px">
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
      </div> -->
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
        <!-- <el-form-item label="宿舍楼"  prop="buildingName">
        <el-select v-model="groupData.buildingId" placeholder="请选择" clearable>
          <el-option
            v-for="item in buildingsData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
        </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="楼层"  prop="floorLayer">
        <el-select
        v-model="groupData.floorId"
        placeholder="请选择"
        :disabled="!groupData.buildingId"
        clearable
      >
          <el-option
            v-for="item in floorsData"
            :key="item.id"
            :label="item.layer"
            :value="item.id"
          >
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="房间号"  prop="roomNumber">
        <el-select
        v-model="groupData.roomId"
        placeholder="请选择"
        :disabled="!groupData.floorId"
        clearable
      >
          <el-option
            v-for="item in roomsData"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          >
        </el-option>
      </el-select>
      </el-form-item> -->
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
import RoomSelector from '@/components/RoomSelector/index'
import GroupSelector from '@/components/GroupSelector'
import StudentSearcher from './components/StudentSearcher'
import PanelGroup from './components/PanelGroup'
import { getStudents } from '@/api/user'
import { addStudent } from '@/api/user'
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
    RoomSelector
  },
  data() {
    return {
      selectorData: {
        buildingId: null,
        floorId: null,
        roomId: null,
        userId: null
      },
      groupData: {
        buildingId: null,
        floorId: null,
        roomId: null,
        userId: null
      },
      buildingsData: [],
      floorsData: [],
      roomsData: [],
      tableData: [],
      dialogVisible: false,
      formData: {
        name: '',
        account: '',
        password: '123456',
        phone: '',
        college: '',
        major: '',
        roomId: null
      },
      operateType: 'add',
      current: 1,
      step: 10,
      searchOption: {},
      searchContent: '',
      studentInfo: {}
    }
  },
  methods: {
    //级联搜索
    searchStudentInfo() {
      this.searchOption = this.selectorData
      this.searchOption.current = this.current
      this.searchOption.step = this.step
      getStudents(this.searchOption).then(res => {
        let result = res.data.users
        if (result instanceof Array) {
          this.tableData = result
        } else {
          this.tableData = [result]
        }
        console.log('wwww', this.tableData)
      })
    },
    fetchUserInfo(type, value) {
      getStudentInfoByIdOrAccount({ type, value }).then(res => {
        this.studentInfo = res.data
      })
    },
    open() {
      this.dialogVisible = true
      this.operateType = 'add'
    },
    //修改学生信息
    handleEdit(row) {
      this.operateType = 'update'
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(row))
      console.log('aa', row)
      this.groupData.floorId = row.floorId
      this.groupData.buildingId = row.buildingId
      this.groupData.roomId = row.roomId
      console.log('da', this.groupData.floorId)
      console.log('ssss', this.groupData)
    },
    // 删除学生
    handleDelete(row) {},
    close() {
      this.dialogVisible = false
      //重置表单
      this.$refs.form.resetFields()
    },
    saveStudent() {
      if (this.operateType == 'add') {
        this.$refs.form.validate(result => {
          if (result) {
            /*  console.log('aa',this.buildingsData);
          
          this.buildingsData.map(item => {
            if(item.id == this.groupData.buildingId)
            this.formData.buildingName = item.name
            return item
          })
          console.log('bb',this.floorsData);
          
          this.floorsData.map(item => {
          if(item.id == this.groupData.floorId)
          this.formData.floorLayer = item.layer
            return item
          })
          console.log('aaaa',this.roomsData);
          console.log('bbbb',this.groupData);
          this.roomsData.map(item => {
          if(item.id == this.groupData.roomId)
          this.formData.roomNumber = item.number
            return item
          }) */
            addStudent(this.formData).then(() => {
              this.$message.success('注册管理员成功')
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
            updateAdminInfo(this.formData).then(() => {
              this.$message.success('修改管理员成功')
              this.$refs.form.resetFields()
              this.fetchAdminTableData().then(() => {
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
    async fetchBuildingsData() {
      getManageBuildings().then(res => {
        this.buildingsData = res.data.buildings
      })
    },
    async fetchFloorsData() {
      getFloors({ buildingId: this.groupData.buildingId }).then(res => {
        this.floorsData = res.data.floors
      })
    },
    async fetchRoomsData() {
      getRooms({ floorId: this.groupData.floorId }).then(res => {
        this.roomsData = res.data.rooms
      })
    }
  },
  watch: {
    'groupData.buildingId': function() {
      this.groupData.floorId = null
      this.groupData.roomId = null
      this.groupData.userId = null
      this.fetchFloorsData()
    },
    'groupData.floorId': function() {
      this.groupData.roomId = null
      this.groupData.userId = null
      this.fetchRoomsData()
    },
    'groupData.roomId': function() {
      this.groupData.userId = null
    }
  },
  mounted() {
    if (this.$route.query.userId) {
      this.fetchUserInfo('id', this.$route.query.userId)
    }
    this.fetchBuildingsData()
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 40px 0;
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
  margin-top: 10px;
  .top {
    .roomInfo-card {
      background-color: #fff;
      padding: 30px;
    }
    .userInfo-card {
      background-color: #fff;
      padding: 30px;
      height: 223px;
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
