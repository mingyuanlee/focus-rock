const fs = require('fs');
const path = require('path');
const electron = require('electron')

const writeData = async (data) => {
  const jsonFilePath = path.join(electron.app.getPath('userData'), 'data.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2))
}

const readData = async () => {
  const jsonFilePath = path.join(electron.app.getPath('userData'), 'data.json');
  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify([]));
  }

  const data = fs.readFileSync(jsonFilePath, 'utf8')
  return JSON.parse(data)
}

module.exports = {
  writeData,
  readData
}