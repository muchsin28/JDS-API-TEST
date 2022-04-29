const fs = require('fs').promises
 /**
 * Generate random string  with requirement:
 * - contains alphabet (at least 1 lowercase [a-z] and 1 uppercase [A-Z])
 * - contains numeric [0-9]
 * - length 6 characters
 */
function randomString(string_length){
  let string = '';
  let has_lowercase = false
  let has_uppercase = false 
  let has_number = false

  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 1; i <= string_length; i++) {

    if(i===string_length){
      if(!has_lowercase || !has_uppercase || !has_number){
        return randomString(string_length)
      }
    }

    let index = Math.floor(Math.random() * str.length)
    let char = str.charAt(index)

    if(!isNaN(char)){
      has_number = true
    } else if(char === char.toUpperCase()){
      has_uppercase = true
    } else {
      has_lowercase = true
    }

    string += char
  }

  return string
}

async function saveData(data){
  try {
    const list = JSON.parse(await listData())
    const newList = [...list, data]

    return await fs.writeFile('data.json', JSON.stringify(newList,null,2), (err)=>{
      if(err) throw err
    })
  } catch (error) {
    return console.log(error);
  }
}

async function updateData(newData){
  try {
    const list = JSON.parse(await listData())
    const dataIndex = list.findIndex((data => data.id === Number(newData.id)));

    const updateList = list
    updateList[dataIndex] = newData

    return await fs.writeFile('data.json', JSON.stringify(updateList,null,2), (err)=>{
      if(err) throw err
    })
 
  } catch (error) {
    return console.log(error);
  }
}

async function getDataById(id){
  try {
    const list = JSON.parse(await listData())
    const data = list.find(data => data.id === Number(id))

    return data
    
  } catch (error) {
    return console.log(error);
  }

}
async function listData(){
  try {
    return await fs.readFile('data.json', 'utf8')
  } catch(error) {
    return console.log(error);
  }
}




module.exports = {
  randomString,
  saveData,
  updateData,
  getDataById,
  listData,
}