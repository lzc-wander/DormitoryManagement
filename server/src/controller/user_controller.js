const { User } = require("../model")
const _ = require("lodash")
const RecordController = require("./record_controller")

module.exports = {
  /**
   * 获取学生用户的完整信息
   * @param {Number} userId
   */
  async getStudentInfo(userId) {
    // console.log('131231',userId,typeof(userId));
    const student = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password", "deletedAt"] }
    })
    const room = await student.getRoom()
    // console.log('aaa',room);
    
    const floor = await room.getFloor()
    const building = await floor.getBuilding()
    const getupProb = await RecordController.getUserProbability("getup", userId)
    const backProb = await RecordController.getUserProbability("back", userId)
    const cleanProb = await RecordController.getUserProbability("clean", userId)
    const info = Object.assign(student.dataValues, {
      roomNumber: room.number,
      floorId: floor.id,
      floorLayer: floor.layer,
      buildingId: building.id,
      buildingName: building.name,
      getupProb,
      backProb,
      cleanProb
    })
    return info
  },

  /**
   * 获取学生用户们的完整信息
   * @param {Array} users
   */
  async getStudentsInfo(users) {
    const cloneUsers = _.cloneDeep(users) //借助lodash深拷贝users,防止删除了真实标的内容
    for (let user of cloneUsers) {
      delete user.dataValues.password
      delete user.dataValues.deletedAt
      const room = await user.getRoom()  //获取room表的数据
      const floor = await room.getFloor() //获取floor表的数据
      const building = await floor.getBuilding() //获取building表的数据
      Object.assign(user.dataValues, {
        roomNumber: room.number,
        floorId: floor.id,
        floorLayer: floor.layer,
        buildingId: building.id,
        buildingName: building.name
      })
    }
    return cloneUsers
  },

  async setStudentRoomNull(id) {
    const student = await User.findOne({ where: { id, role: "student" } })
    const result = await student.update({ roomId: null })
    return result
  }
}
