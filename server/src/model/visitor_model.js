const { sequelize } = require("../db/index")
const { DataTypes, Model } = require("sequelize")

class Visitor extends Model {
 /*  static async createEvaluate({ score, note = "", userId, roomId }) {
    return await Evaluate.create({ score, note, userId, roomId })
  } */
}

Visitor.init(
  {
    visitorname: {
      type: DataTypes.STRING
    },
    IDcard: {
      type: DataTypes.STRING
    },
    startTime: {
      comment: "到访时间",
      type: DataTypes.DATE
    },
    leaveTime: {
      comment: "离开时间",
      type: DataTypes.DATE
    },
    name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
  },
  {
    sequelize,
    modelName: "visitor",
    paranoid: true
  }
)

module.exports = Visitor
