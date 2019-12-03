const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const isValid = MIME_TYPE_MAP[file.mimetype];

        if(isValid) {
            callback(undefined, './backend/images');
        } else {
            callback(new Error('Invalid mine type'));
        }
    },
    filename(req, file, callback) {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

const extractFile = multer({ storage }).single('image');

module.exports = {
    extractFile
};