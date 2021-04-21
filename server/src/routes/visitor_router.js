const Router = require("koa-router")
const ResBody = require("../struct/ResBody")
const { Repair, User, Visitor } = require("../model")
const router = new Router()
const { Op } = require("sequelize");
const moment = require("moment")
//新增访客信息
router.post("/addVisitor", async ctx => {
  let {
    visitorname,
    IDcard,
    name,
    phone,
    startTime } = ctx.request.body
    // console.log('',ctx.request.body);
    let user = await User.findOne({ where: { name: name } })
    if (user === null) {
      let e = new Error("400-受访人不存在")
      throw e
    }
   let visitor = await Visitor.create({
    visitorname,
    IDcard,
    startTime,
    name,
    phone,
    userId:user.id,
   }
    )
  ctx.body = new ResBody({ data: visitor })
})

// 获取访客信息
router.get("/getVisitors", async ctx => {
  let {step,current} = ctx.request.query
  current = current ? parseInt(current) : 1
  step = step ? parseInt(step) : 10
  let visitors = await Visitor.findAndCountAll({
    limit: step,
    offset: step * (current - 1),
    order: [["createdAt", "DESC"]]
  })
  // console.log('wa',visitors.rows);
  const getStudentInfo = require("../controller/user_controller").getStudentInfo
    let rows = []
    for (let user of visitors.rows) {
      user = user.toJSON()
      delete user.room
      const userInfo = await getStudentInfo(user.userId)
      user = Object.assign(userInfo, user)
      user.time = moment(user.startTime).format("HH:mm")
      rows.push(user)
    }
    visitors.rows = rows
  
  ctx.body = new ResBody({ data: { visitors, total: visitors.length } })
})

// 修改访客信息
router.post("/updateVisitorInfo", async ctx => {
  const resbody = ctx.request.body
  const username = resbody.name
  const IDcard = resbody.IDcard
  let user = await User.findOne({ where: { name: username } })
  const visitor = await Visitor.findOne({ where: { IDcard: IDcard } })
  for (let key in resbody) {
    if (visitor[key] !== undefined && resbody[key]) {
      visitor[key] = resbody[key]
    }
  }
  visitor.userId = user.id
  ctx.body = new ResBody({ data: await visitor.save() })
})


// 删除访客信息
router.delete("/deleteVisitor", async ctx => {
  const id  = ctx.request.query.id
  const visiotr = await Visitor.findOne({ where: { id: id } })
  const result = await visiotr.destroy()
  ctx.body = new ResBody({ data: { effectRows: result } })    
  })

  //搜索访客信息
  router.get("/searchVisitor", async ctx => {
    const { keywords } = ctx.request.query
    let visitor = []
    if (keywords.trim()) {
      visitor = await Visitor.findAll({
        where: {
          visitorname: { [Op.like]: `%${keywords}%` },
        } 
      })
      console.log('aa',visitor);
      const getStudentInfo = require("../controller/user_controller").getStudentInfo
      let rows = []
      for (let user of visitor) {
        user = user.toJSON()
        delete user.room
        const userInfo = await getStudentInfo(user.userId)
        user = Object.assign(userInfo, user)
        user.time = moment(user.startTime).format("HH:mm")
        rows.push(user)
      }
      visitor = rows
    } 
    ctx.body = new ResBody({ data: { visitor, total: visitor.length } })
  })
module.exports = router.routes()