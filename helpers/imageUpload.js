const multer = require('multer')
const path = require('path')
const {v4: uuidv4} = require('uuid')

const storage  = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
    filename: (res, file, cb) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = re.exec(file.originalname)[0];
        const fileName = `${uuidv4()}-image${extension}`
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage, fileFilter })

function fileFilter (req, file, cb) {
 
    const minitypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (minitypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = upload