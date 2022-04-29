
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes')
const { randomString, listData, saveData, updateData, getDataById } = require('./helper');

class Controller{
  static async list(req, res, next){
    try {

      const list = JSON.parse(await listData())

      const data = list.map(data =>{
        return{
          id: data?.id,
          username: data?.username,
          role: data?.role
        }
      })

      return res.json({data})
      
    } catch (error) {
      next(error)
    }
  }

  static async register(req, res, next){
    try {
      const { username, role } = req.body

      let list = JSON.parse(await listData())
      
      let id

      if(list.length){
        id = list[list.length-1].id + 1
      } else{
        id = 1
      }

      const password = randomString(6)

      const user = {
        id,
        username,
        role,
        password : await bcrypt.hash(password, 10)
      }

      await saveData(user)

      return res.json({
        data:{
          username: user.username,
          role: user.role,
          password: password,
        }
      })
      
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next){
    try {
      const { username, password } = req.body

      const userList = JSON.parse(await listData())
      let users = userList.filter(user => user.username.indexOf(username) !== -1)

      if(!users.length){
        throw createHttpError(StatusCodes.NOT_FOUND, 'anda belum terdaftar')
      }

      let user = users.reduce((result , user) =>{
        const match = bcrypt.compareSync(password, user.password)
        if(match){
          result.push(user)
        }
        return result
      },[])[0]

      if(!user){
        throw createHttpError(StatusCodes.UNAUTHORIZED, 'username/password tidak sesuai')
      }
        
      const id = user.id
      user.token = jwt.sign({ id, username }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE_IN_HOUR+'h' })

      await updateData(user)

      return res.json({
        data: {
          id: user.id,
          username: user.username,
          token: user?.token
        }
      })
      
    } catch (error) {
      next(error)
    }
  }

  static async getById(req, res, next){
    try {

      const { id } = req.params
      const data = await getDataById(id)

      if(!data){
        throw createHttpError(StatusCodes.NOT_FOUND, 'Data Not Found')
      }

      return res.json({
        data: {
          id: data?.id,
          username: data?.username,
          role: data?.role
        }
      })
      
    } catch (error) {
      next(error)
    }
  }

  static async validateToken(req,res,next){
    try {
      const {id} = req.params

      const data = await getDataById(id)

      if(!data?.token){
        throw createHttpError(StatusCodes.NOT_FOUND, 'Token Not Found')
      }

      const validate = jwt.verify(data?.token, process.env.SECRET, (err, decoded) => {
        if(err){
          return err
        }
        return decoded
      })

      const dataJson = {}

      if(validate.exp){
        dataJson.is_valid = true
        dataJson.expired_at = new Date(validate.exp*1000)
      } else {
        dataJson.is_valid = false
        dataJson.expired_at = validate.name ==="TokenExpiredError" && validate.expiredAt
      }

      dataJson.username = data?.username
     
      return res.json({
        data:dataJson
      })
      
    } catch (error) {
       next(error)
    }

  }
}

module.exports = Controller

