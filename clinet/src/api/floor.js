import request from '@/utils/request'

export function getFloors(params) {
  return request({
    url: '/floor/getFloors',
    method: 'get',
    params
  })
}
//获取所有的楼层信息
export function getAllFloors() {
  return request({
    url: '/floor/getAllFloors',
    method: 'get'
  })
}
export function getFloorsDetail(buildingId) {
  return request({
    url: '/floor/getFloorsDetail',
    method: 'get',
    params: { buildingId }
  })
}

export function addCleanerToFloor(floorId, cleanerId) {
  return request({
    url: '/floor/addCleanerToFloor',
    method: 'post',
    data: { floorId, cleanerId }
  })
}
