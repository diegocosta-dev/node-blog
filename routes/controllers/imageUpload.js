const multer = require('multer')
const path = require('path')
const {v4: uuidv4} = require('uuid')

const storage  = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
    filename: (res, file, cb) => {
        const typeOfFile = file.originalname.split('.')
        const fileName = `${uuidv4()}-image.${typeOfFile[1]}`
        cb(null, fileName)
    },
})

module.exports = storage