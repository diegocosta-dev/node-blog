const multer = require('multer')
const path = require('path')
const {v4: uuidv4} = require('uuid')

const storage  = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
    filename: (res, file, cb) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = re.exec(file.originalname)[0];
        const fileName = `${uuidv4()}-image.${extension}`
        cb(null, fileName)
    }
})

module.exports = storage