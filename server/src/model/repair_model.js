const { sequelize } = require("../db/index")
const { DataTypes, Model } = require("sequelize")

class Repair extends Model {
 /*  static async createEvaluate({ score, note = "", userId, roomId }) {
    return await Evaluate.create({ score, note, userId, roomId })
  } */
}

Repair.init(
  {
    goodsName: {
      type: DataTypes.STRING
    },
    type: {
      comment: "维修类型，普通为1，紧急为2",
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    checkTime: {
      comment: "报修时间",
      type: DataTypes.DATE
    },
    name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    detail: {
      comment: "详情",
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: "repair",
    paranoid: true
  }
)

module.exports = Repair
