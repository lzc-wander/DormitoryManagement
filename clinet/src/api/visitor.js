import request from '@/utils/request'

//新增维修信息
export function addVisitor({ visitorname, IDcard, name, phone, startTime }) {
  return request({
    url: '/visitor/addVisitor',
    method: 'post',
    data: {
      visitorname,
      IDcard,
      name,
      phone,
      startTime
    }
  })
}
// 获取维修信息
export function getVisitors({ current, step }) {
  const data = { current, step }
  return request({
    url: '/visitor/getVisitors',
    method: 'get',
    params: data
  })
}

//修改访客信息
export function updateVisitorInfo({
  visitorname,
  IDcard,
  name,
  phone,
  startTime
}) {
  return request({
    url: '/visitor/updateVisitorInfo',
    method: 'post',
    data: {
      visitorname,
      IDcard,
      name,
      phone,
      startTime
    }
  })
}

//删除维修信息
export function deleteVisitor(params) {
  return request({
    url: '/visitor/deleteVisitor',
    method: 'delete',
    params: params
  })
}
//管理员修改维修状态
export function updateRepairStatus(params) {
  return request({
    url: '/repair/updateRepairStatus',
    method: 'post',
    data: params
  })
}
//查询维修信息
export function searchVisitor(keywords) {
  return request({
    url: '/visitor/searchVisitor',
    method: 'get',
    params: { keywords }
  })
}
