const fs = require('fs');
const path = require('path');
const electron = require('electron')

const writeData = async (data) => {
  const jsonFilePath = path.join(electron.app.getPath('userData'), 'focusrock_data_002.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2))
}

const readData = async () => {
  const jsonFilePath = path.join(electron.app.getPath('userData'), 'focusrock_data_002.json');
  console.log("jsonFilePath", jsonFilePath)
  console.log("fs.existsSync(jsonFilePath)", fs.existsSync(jsonFilePath))
  
  if (!fs.existsSync(jsonFilePath)) {
    return {}
  }
  const data = fs.readFileSync(jsonFilePath, 'utf8')
  console.log("data:", data)
  return JSON.parse(data)
}

module.exports = {
  writeData,
  readData
}