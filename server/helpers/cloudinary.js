const cloudinary = require("cloudinary").v2;

const multer = require("multer");

cloudinary.config({
    cloud_name: 'dpzvancdk',
    api_key: '885335619118759',
    api_secret: '3sAs1yHrurk-3K-TuReyiKFVFy8'
})

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    })
    return result;
}


const upload = multer({ storage })

module.exports = {
    //cloudinary,
    imageUploadUtil,
    upload
}

