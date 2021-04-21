const Router = require("koa-router")
const ResBody = require("../struct/ResBody")
const { Repair } = require("../model")
const router = new Router()
const { Op } = require("sequelize");
//新增报修信息
router.post("/addRepair", async ctx => {
  let {goodsName, detail, roomId, name, phone, checkTime, type,userId} = ctx.request.body
  let repair = await Repair.create({goodsName, detail, roomId, name, phone, checkTime, type,userId})
  ctx.body = new ResBody({ data: repair })
})

// 获取维修信息
router.get("/getRepairs", async ctx => {
  let {step,current,roomId} = ctx.request.query
  current = current ? parseInt(current) : 1
  step = step ? parseInt(step) : 10
  let repairs
  if(roomId) {
    repairs = await Repair.findAndCountAll({
      where: {
        roomId:roomId
      },
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]]
    })
  } else {
    repairs = await Repair.findAndCountAll({
    limit: step,
    offset: step * (current - 1),
    order: [["createdAt", "DESC"]]
  })
  // console.log('wa',repairs.rows);
  const getStudentInfo = require("../controller/user_controller").getStudentInfo
    let rows = []
    for (let user of repairs.rows) {
      user = user.toJSON()
      delete user.room
      const userInfo = await getStudentInfo(user.userId)
      user = Object.assign(userInfo, user)
      rows.push(user)
    }
    repairs.rows = rows
  }
  ctx.body = new ResBody({ data: { repairs, total: repairs.length } })
})

// 修改维修信息
router.post("/updateRepairInfo", async ctx => {
  const resbody = ctx.request.body
  const id = resbody.id
  const repair = await Repair.findOne({ where: { id: id } })
  for (let key in resbody) {
    if (repair[key] !== undefined && resbody[key]) {
      repair[key] = resbody[key]
    }
  }
  ctx.body = new ResBody({ data: await repair.save() })
})

// 管理员修改维修状态
router.post("/updateRepairStatus", async ctx => {
  const resbody = ctx.request.body
  const id = resbody.id
  const repair = await Repair.findOne({ where: { id: id } })
  repair.status = resbody.status
   ctx.body = new ResBody({ data: await repair.save() })
})

// 删除维修信息
router.delete("/deleteRepair", async ctx => {
  const id  = ctx.request.query.id
  const repair = await Repair.findOne({ where: { id: id } })
  const result = await repair.destroy()
  ctx.body = new ResBody({ data: { effectRows: result } })    
  })

  //搜索维修信息
  router.get("/searchRepair", async ctx => {
    const { keywords } = ctx.request.query
    let repairs = []
    if (keywords.trim()) {
      repairs = await Repair.findAll({
        where: {
          name: { [Op.like]: `%${keywords}%` },
        }
      })
      const getStudentInfo = require("../controller/user_controller").getStudentInfo
      let rows = []
      for (let user of repairs) {
        user = user.toJSON()
        delete user.room
        const userInfo = await getStudentInfo(user.userId)
        user = Object.assign(userInfo, user)
        rows.push(user)
      }
      repairs = rows
    } 
    ctx.body = new ResBody({ data: { repairs, total: repairs.length } })
  })
module.exports = router.routes()