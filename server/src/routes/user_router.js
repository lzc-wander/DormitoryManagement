const Router = require("koa-router")
const { Op } = require("sequelize")
const ResBody = require("../struct/ResBody")
const bcypt = require("../utils/bcypt")
const { sysConfig } = require("../config")
const { User, Token, Building,GetupRecord,
  CleanRecord,
  BackRecord,
  Room, } = require("../model")
const {
  UserController,
  RoomController,
  FloorController,
  BuildingController
} = require("../controller")
const utils = require("../utils")

const router = new Router()

router.post("/register", async ctx => {
  let { account, password } = ctx.request.body
  if ((await User.findByAccount(account)) !== null) {
    const e = new Error("400-该学号/职工号已被注册")
    throw e
  }
  let user = await User.createUser(account, password)
  ctx.body = new ResBody({ data: user })
})
//登录接口数据
router.post("/login", async ctx => {
  let { account, password } = ctx.request.body
  let user = await User.findByAccount(account)
  if (user === null) {
    let e = new Error("400-用户名错误")
    throw e
  }
  let result = bcypt.verify(password, user.password)
  if (result) {
    const token = await Token.createToken(user.id)
    ctx.body = new ResBody({ data: { token } })
  } else {
    ctx.body = new ResBody({ success: false, msg: "密码错误" })
  }
})

router.get("/info", async ctx => {
  let token = ctx.req.headers.authorization
  const { tokenId, userId, exp, role } = ctx.state.user
  // 1. 检查距离Token的过期时间
  const current = parseInt(String(new Date().valueOf() / 1000))
  if (exp - current < sysConfig.tokenExp / 2) {
    // 2. 如果相差超过一半时间，就创建一个新Token并返回
    Token.deleteById(tokenId)
    token = await Token.createToken(userId)
  }
  // 获取用户信息，前端在拿到用户信息后必须重新 set token，保证 token 为最新的
  let user = await User.findOne({ where: { id: userId } })
  if (role === "student" && user.roomId) {
    const room = await user.getRoom()
    const floor = await room.getFloor()
    const building = await floor.getBuilding()
    user = user.toJSON()
    user.room = room
    user.floor = floor
    user.building = building
  }
  if (user !== null) {
    user.token = token
    ctx.body = new ResBody({ data: user })
  } else {
    let e = new Error("未找到相关用户信息")
    throw e
  }
})
// 更新用户信息
router.post("/updateInfo", async ctx => {
  const { userId } = ctx.state.user
  const resbody = ctx.request.body
  const user = await User.findOne({ where: { id: userId } })
  for (let key in resbody) {
    if (user[key] !== undefined && resbody[key]) {
      user[key] = resbody[key]
    }
  }
  if (resbody.password) {
    user.password = bcypt.hash(resbody.password)
  }
  ctx.body = new ResBody({ data: await user.save() })
})
// 更新管理员信息
router.post("/updateAdminInfo", async ctx => {
  // const { userId } = ctx.state.user
  const resbody = ctx.request.body
  const user = await User.findOne({ where: { account: resbody.account } })
  for (let key in resbody) {
    if (user[key] !== undefined && resbody[key]) {
      user[key] = resbody[key]
    }
  }
  if (resbody.password) {
    user.password = bcypt.hash(resbody.password)
  }
  ctx.body = new ResBody({ data: await user.save() })
})
// 更新学生信息
router.post("/updateStudentInfo", async ctx => {
  // const { userId } = ctx.state.user
  const resbody = ctx.request.body
  const user = await User.findOne({ where: { account: resbody.account } })
  for (let key in resbody) {
    if (user[key] !== undefined && resbody[key]) {
      user[key] = resbody[key]
    }
  }
  if (resbody.password) {
    user.password = bcypt.hash(resbody.password)
  }
  ctx.body = new ResBody({ data: await user.save() })
})
// 删除管理员
// router.delete("/deleteAdmin", async ctx => {
//   const resbody = ctx.request.body
//   const user = await User.findOne({ where: { account:resbody.account } })
//   if (user.role == 'superAdmim') {
//     throw new Error("无权限删除")
//   } else {
//     const result = await user.destroy()
//     ctx.body = new ResBody({ data: { effectRows: result } })
//   }
// })
//删除管理员
router.delete("/deleteAdmin", async ctx => {
  const id  = ctx.request.query.id
  const user = await User.findOne({ where: { id: id } })
  if (user.role == 'superAdmin') {
        throw new Error("无权限删除")
      } else {
        const result = await user.destroy()
        ctx.body = new ResBody({ data: { effectRows: result } })
      }
    })
//删除学生
router.delete("/deleteStudent", async ctx => {
  const id  = ctx.request.query.id
  const user = await User.findOne({ where: { id: id } })
  const result = await user.destroy()
  ctx.body = new ResBody({ data: { effectRows: result } })    
  })
router.get("/getStudents", async ctx => {
  const { buildingId, floorId, roomId,userId } = ctx.request.query
  let users = []
  if(userId) {
    users = await UserController.getStudentInfo(userId)
  }
  else if (roomId) {
    users = await RoomController.getStudents(roomId)
  } else if (floorId) {
    users = await FloorController.getStudents(floorId)
  } else if (buildingId) {
    users = await BuildingController.getStudents(buildingId)
  } else {
    users = await User.findAll({ where: { role: "student" } })
    users = await UserController.getStudentsInfo(users)
  }
  ctx.body = new ResBody({
    data: { users }
  })
})
// 级联搜索学生
router.get("/getSearchStudents", async ctx => {
  let { buildingId, floorId, roomId,userId,current,step} = ctx.request.query
  // 开始分情况获取数据
  current = current ? parseInt(current) : 1
  step = step ? parseInt(step) : 10
  let result
  if (userId) {
    result = await User.findAndCountAll({
      where: {
        id: userId,
      },
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]]
    })
  } else if (roomId) {
    result = await User.findAndCountAll({
      where: {
        roomId: roomId,
      },
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]]
    })
  } else if (floorId) {
    result = await User.findAndCountAll({
    /*   where: {
        
      }, */
      include: [
        {
          model: Room,
          where: { floorId }
        }
      ],
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]]
    })
  } else if (buildingId) {
    result = await User.findAndCountAll({
     /*  where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime
        }
      }, */
      include: [
        {
          model: Room,
          where: { buildingId }
        }
      ],
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]]
    })
  } else {
    result = await User.findAndCountAll({
      where: {
        role:'student'
      },
      limit: step,
      offset: step * (current - 1),
      order: [["createdAt", "DESC"]],
    })
  }
  const getStudentInfo = require("../controller/user_controller").getStudentInfo
  let rows = []
  for (let user of result.rows) {
    user = user.toJSON()
    delete user.room
    const userInfo = await getStudentInfo(user.id)
    user = Object.assign(userInfo, user)
    rows.push(user)
  }
  result.rows = rows
  ctx.body = new ResBody({
    data: { result }
  })
})
router.get("/searchAdmin", async ctx => {
  const { keywords } = ctx.request.query
  let admins = []
  if (keywords.trim()) {
    admins = await User.findAll({
      where: {
        role: "admin",
        [Op.or]: {
          name: { [Op.like]: `%${keywords}%` },
          account: { [Op.like]: `%${keywords}%` }
        }
      }
    })
  }
  ctx.body = new ResBody({ data: { admins, total: admins.length } })
})
// 获取所有学生信息
router.get("/getAllStudents", async ctx => {
  let {step,current} = ctx.request.query
  current = current ? parseInt(current) : 1
  step = step ? parseInt(step) : 10
  let result = await User.findAndCountAll({
        where: {
          role: "student",
        },
        limit: step,
        offset: step * (current - 1),
        order: [["createdAt", "DESC"]]
    })
    const getStudentInfo = require("../controller/user_controller").getStudentInfo
    let rows = []
    for (let user of result.rows) {
      user = user.toJSON()
      delete user.room
      const userInfo = await getStudentInfo(user.id)
      user = Object.assign(userInfo, user)
      rows.push(user)
    }
    result.rows = rows
    ctx.body = new ResBody({
      data: { result }
    })
})
router.get("/searchUser", async ctx => {
  const { keywords } = ctx.request.query
  let students = []
  if (keywords.trim()) {
    students = await User.findAll({
      where: {
        role: "student",
        [Op.or]: {
          name: { [Op.like]: `%${keywords}%` },
          account: { [Op.like]: `%${keywords}%` }
        }
      }
    })
  }
  ctx.body = new ResBody({ data: { students, total: students.length } })
})
//添加管理员接口
router.post("/addAdmin", async ctx => {
  const currentUserRole = ctx.state.user.role
  if (currentUserRole !== "superAdmin") {
    throw new Error("403-拒绝访问API")
  }
  let { name, account, phone, password, role } = ctx.request.body
  utils.checkParams({ name, account, phone, password, role })
  if ((await User.findByAccount(account)) !== null) {
    const e = new Error("400-该学号/职工号已被注册")
    throw e
  }
  let user = await User.create({
    name,
    phone,
    account,
    password: bcypt.hash(password),
    role
  })
  ctx.body = new ResBody({ data: user })
})

// 添加学生接口
router.post("/addStudent", async ctx => {
  let {name,account,phone,password,college,major,roomId,checkTime} = ctx.request.body
  if ((await User.findByAccount(account)) !== null) {
    const e = new Error("400-该学号/职工号已被注册")
    throw e
  }
  let user = await User.create({
      name,
      account,
      phone,
      password:bcypt.hash(password),
      college,
      major,
      roomId,
      checkTime
    })
  ctx.body = new ResBody({ data: user })
})
router.get("/getAdminTableData", async ctx => {
  const admins = await User.findAll({
    where: {
      role: { [Op.or]: ["admin", "superAdmin"] }
    },
    include: [{ model: Building }]
  })
  ctx.body = new ResBody({ data: { admins, total: admins.length } })
})

router.get("/getStudentInfoByIdOrAccount", async ctx => {
  const { type, value } = ctx.request.query
  let userId = value
  if (type !== "id") {
    const user = await User.findOne({ where: { account: value } })
    if (!user) {
      throw new Error("无法找到该用户")
    }
    userId = user.id
  }
  const userInfo = await UserController.getStudentInfo(userId)
  ctx.body = new ResBody({ data: userInfo })
})

/* router.get("/getStudentInfo",async ctx => {
  const params = ctx.request.body
  let result
    if (params.userId) {
      result = await User.findAndCountAll({
        where: {
          userId: userId,
        },
        limit: params.step,
        offset: params.step * (params.current - 1),
        // order: [["createdAt", "DESC"]]
      })
    } else if (params.roomId) {
      result = await User.findAndCountAll({
        where: {
          roomId: roomId,
        },
        limit: params.step,
        offset: params.step * (params.current - 1),
        // order: [["createdAt", "DESC"]]
      })
    } else if (params.floorId) {
      result = await User.findAndCountAll({
        where: {
          floorId: floorId
        },
        include: [
          {
            model: Room,
            where: { floorId }
          }
        ],
        limit: params.step,
        offset: params.step * (params.current - 1),
        // order: [["createdAt", "DESC"]]
      })
    } else if (params.buildingId) {
      result = await User.findAndCountAll({
        where: {
          buildingId: buildingId
        },
        include: [
          {
            model: Room,
            where: { buildingId }
          }
        ],
        limit: params.step,
        offset: params.step * (params.current - 1),
        // order: [["createdAt", "DESC"]]
      })
    } else {
      result = await User.findAndCountAll({
        limit: params.step,
        offset: params.step * (params.current - 1),
        // order: [["createdAt", "DESC"]]
      })
    }
    ctx.body = new ResBody({ data: result })
}) */
module.exports = router.routes()
