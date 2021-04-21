import request from '@/utils/request'

//新增维修信息
export function addRepair({
  goodsName,
  detail,
  roomId,
  name,
  phone,
  checkTime,
  type,
  userId,
  id
}) {
  return request({
    url: '/repair/addRepair',
    method: 'post',
    data: {
      goodsName,
      detail,
      roomId,
      name,
      phone,
      checkTime,
      type,
      userId,
      id
    }
  })
}

// 获取维修信息
export function getRepairsByRoom({ current, step, roomId }) {
  const data = { current, step, roomId }
  console.log('aaaa', data)
  return request({
    url: '/repair/getRepairs',
    method: 'get',
    params: data
  })
}

//修改维修信息
export function updateRepairInfo({
  goodsName,
  detail,
  roomId,
  name,
  phone,
  checkTime,
  type,
  userId,
  id
}) {
  return request({
    url: '/repair/updateRepairInfo',
    method: 'post',
    data: {
      goodsName,
      detail,
      roomId,
      name,
      phone,
      checkTime,
      type,
      userId,
      id
    }
  })
}

//删除维修信息
export function deleteRepair(params) {
  return request({
    url: '/repair/deleteRepair',
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
export function searchRepair(keywords) {
  return request({
    url: '/repair/searchRepair',
    method: 'get',
    params: { keywords }
  })
}
