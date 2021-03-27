import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getAllStudents({ current, step }) {
  const data = { current, step }
  console.log('aaaa', data)
  return request({
    url: '/user/getAllStudents',
    method: 'get',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateInfo({
  name = null,
  phone = null,
  college = null,
  major = null,
  roomId = null,
  checkTime = null,
  password = null
}) {
  const data = { name, phone, college, major, roomId, checkTime, password }
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data
  })
}
//修改学生信息
export function updateStudentInfo({
  name,
  account,
  phone,
  password,
  college,
  major,
  roomId
}) {
  const data = { name, account, phone, password, college, major, roomId }
  return request({
    url: '/user/updateAdminInfo',
    method: 'post',
    data
  })
}

export function updateAdminInfo({
  name = null,
  phone = null,
  account = null,
  role = null,
  password = null
}) {
  const data = { name, phone, account, role, password }
  return request({
    url: '/user/updateAdminInfo',
    method: 'post',
    data
  })
}
//删除管理员信息
export function deleteAdmin(params) {
  console.log(params)

  return request({
    url: '/user/deleteAdmin',
    method: 'delete',
    params: params
  })
}

//删除学生信息
export function deleteStudent(params) {
  return request({
    url: '/user/deleteStudent',
    method: 'delete',
    params: params
  })
}
/**
 * 获取学生用户，传递的 url query 分为以下情况：
  1. 空参数：获取系统内所有的学生用户
  2. ?buildingId=[]: 获取对应宿舍楼的学生用户
  3. ?floorId=[]: 获取对应楼层的学生用户
  4. ?roomId=[]: 获取对应房间的学生用户
 */
export function getStudents(params) {
  return request({
    url: '/user/getStudents',
    method: 'get',
    params
  })
}
// 级联搜索学生
export function getSearchStudents({
  current = undefined,
  step = undefined,
  buildingId = undefined,
  floorId = undefined,
  roomId = undefined,
  userId = undefined
  /*  startTime = undefined,
    endTime = undefined */
}) {
  return request({
    url: '/user/getSearchStudents',
    method: 'get',
    params: {
      current,
      step,
      buildingId,
      floorId,
      roomId,
      userId
      /*   startTime,
      endTime */
    }
  })
}

export function searchAdmin(keywords) {
  return request({
    url: '/user/searchAdmin',
    method: 'get',
    params: { keywords }
  })
}

export function searchUser(keywords) {
  return request({
    url: '/user/searchUser',
    method: 'get',
    params: { keywords }
  })
}
// 添加管理员
export function addAdmin({ name, account, phone, password, role }) {
  return request({
    url: '/user/addAdmin',
    method: 'post',
    data: { name, account, phone, password, role }
  })
}
// 添加学生
export function addStudent({
  name,
  account,
  phone,
  password,
  college,
  major,
  roomId,
  checkTime
}) {
  return request({
    url: '/user/addStudent',
    method: 'post',
    data: { name, account, phone, password, college, major, roomId, checkTime }
  })
}
export function getAdminTableData() {
  return request({
    url: '/user/getAdminTableData',
    method: 'get'
  })
}

export function getStudentInfoByIdOrAccount({ type = 'id', value }) {
  console.log('value: ', value)
  return request({
    url: '/user/getStudentInfoByIdOrAccount',
    method: 'get',
    params: { type, value }
  })
}

export function getStudentInfo(params) {
  return request({
    url: '/user/getStudentInfo',
    method: 'get',
    params
  })
}
