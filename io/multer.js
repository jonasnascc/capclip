const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, 'video.mp4')
});
const upload = multer({ storage });

module.exports = upload