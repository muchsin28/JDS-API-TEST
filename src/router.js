const router = require('express').Router()
const { version } = require('../package.json')
const { list, register, login, getById, validateToken } = require('./controller')

router.get('/users/:id/validate-token', (req, res, next)=> validateToken(req,res,next))
router.get('/users/:id', (req, res, next)=>getById(req,res,next))
router.get('/users', (req, res, next)=> list(req,res,next))
router.post('/register', (req, res, next)=>register(req,res,next))
router.post('/login', (req, res, next)=>login(req,res,next))

router.get('/', (req,res)=> res.send(`JDS-API TEST v${version}`))

module.exports = router