<template>
  <div id="admin-manage" class="page-wrapper">
    <!-- 添加管理员 -->
    <!-- <h1 class="main-title">添加管理员</h1>
    <div class="wrapper top-wrapper">
      <div class="main-card left">
        <div class="title-wrapper">总数：{{ this.total }}</div>
        <div class="content-wrapper">
          <div class="admin admin-card">
            <i class="el-icon-user"></i>
            普通管理员: {{ adminCount }}
          </div>
          <div class="superAdmin admin-card">
            <i class="el-icon-user"></i>
            超级管理员: {{ superAdminCount }}
          </div>
        </div>
      </div>
      <div class="main-card right">
        <AddAdminForm />
      </div>
    </div> -->
    <!-- 添加管理员 -->

    <!-- 表格 -->
    <h1 class="main-title">已有管理员列表</h1>
    <div class="handle-box">
      <div class="add">
        <el-button type="primary" icon="el-icon-plus" @click="addadmin"
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
          @click="queryAdmin(searchEntity)"
          >搜索</el-button
        >
      </div>
    </div>
    <el-dialog
      :title="operateType === 'add' ? '新增管理员' : '更改管理员'"
      :visible.sync="dialogVisible"
    >
      <el-form class="form" ref="form" :model="formData">
        <el-form-item label="管理员名" required prop="name">
          <el-input
            v-model.trim="formData.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="学工号" required prop="account">
          <el-input
            v-model.trim="formData.account"
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
        <el-form-item label="密码" required prop="password">
          <el-input
            v-model.trim="formData.password"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择身份" required>
          <el-radio v-model="formData.role" label="admin">普通管理员</el-radio>
          <el-radio v-model="formData.role" label="superAdmin"
            >超级管理员</el-radio
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="saveAdmin">确 定</el-button>
      </span>
    </el-dialog>
    <div class="wrapper main-card">
      <AdminTable
        :table-data="adminsTableData"
        @edit="editAdmin"
        @del="delAdmin"
      />
    </div>
    <!-- 表格 -->
  </div>
</template>

<script>
import AddAdminForm from './components/AddAdminForm'
import AdminTable from './components/AdminTable'
import { addAdmin } from '@/api/user'
import { updateAdminInfo } from '@/api/user'
import { getAdminTableData } from '@/api/user'
import { searchAdmin } from '@/api/user'
import { deleteAdmin } from '@/api/user'
export default {
  name: 'adminManage',
  components: {
    AddAdminForm,
    AdminTable
  },
  data() {
    return {
      operateType: 'add',
      adminsTableData: [],
      total: 0,
      superAdminCount: 0,
      adminCount: 0,
      searchEntity: '',
      dialogVisible: false,
      formData: {
        name: '',
        account: '',
        phone: '',
        password: '',
        role: 'admin'
      }
    }
  },
  mounted() {
    this.fetchAdminTableData()
  },
  methods: {
    close() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    async fetchAdminTableData() {
      await getAdminTableData().then(res => {
        this.adminsTableData = res.data.admins
        this.total = res.data.total
        this.superAdminCount = res.data.admins.filter(
          item => item.role === 'superAdmin'
        ).length
        this.adminCount = this.total - this.superAdminCount
      })
    },
    addadmin() {
      this.dialogVisible = true
    },
    saveAdmin() {
      if (this.operateType == 'add') {
        this.$refs.form.validate(result => {
          if (result) {
            addAdmin(this.formData).then(() => {
              this.$message.success('注册管理员成功')
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
    //搜索管理员
    queryAdmin(queryString) {
      searchAdmin(queryString).then(res => {
        this.adminsTableData = res.data.admins
      })
    },
    //修改管理员
    editAdmin(row) {
      this.operateType = 'edit'
      this.dialogVisible = true
      console.log('dsdsdsd', row)
      this.formData.name = row.name
      this.formData.account = row.account
      this.formData.phone = row.phone
      this.formData.role = row.role
      this.formData.password = ''
    },
    //删除管理员
    delAdmin(row) {
      this.$confirm(`确认要删除 “${row.name}” 管理员吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row).then(res => {
          console.log(res)
          this.fetchAdminTableData()
          this.$message({ type: 'success', message: '删除成功！' })
        })
      })
    }
  },
  watch: {
    searchEntity: function(val) {
      if (val == '') this.fetchAdminTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  // margin: 40px 0;
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
// .add {
//   float: left;
// }
.handle-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
.top-wrapper {
  display: flex;
  > .left {
    margin-right: 20px;
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title-wrapper {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .admin-card {
      padding: 20px;
      border-radius: 5px;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      color: #ffffff;
    }
    .admin {
      margin-bottom: 20px;
      background-color: $color-primary;
    }
    .superAdmin {
      background-color: $color-origin;
    }
  }
  > .right {
    width: 100%;
    overflow: visible;
  }
}
</style>
