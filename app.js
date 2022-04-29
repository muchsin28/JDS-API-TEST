require('dotenv').config()
const favicon = require('serve-favicon')
const express = require('express')
const fs = require('fs')
const router = require('./src/router')

const app = express()
const port = process.env.PORT || 3000

app.use(favicon(__dirname + '/favicon.ico'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(router)
app.use((err, req, res, next) => {
  
  console.log(err)
  
  switch (err.status) {
    case 404:
      return res.status(404).json({
        code: 404,
        message: err.message,
        errors: err.errors
      })
      
    default:
      return res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message,
        errors: err.errors,
      })
  }
})

fs.writeFile(`${process.env.FILE_NAME||'data'}.json`,'[]',{ flag: 'wx' }, _err => {})
    
app.listen(port, ()=> console.log(`Listen to PORT: ${port} 🚀`))