const fileuploads = require('express-fileupload');

const fileUpload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file; 
    const uploadPath = __dirname + '/img/' + file.name;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        res.status(400).json({
            success: false,
            message: 'Invalid file type. Only JPG, PNG, and GIF files are allowed.'
        });
        throw new Error('Invalid file type');
    }
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
        res.status(400).json({
            success: false,
            message: 'File size exceeds the limit of 5MB'
        });
        throw new Error('File size exceeds the limit of 5MB');
    }
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        return res.status(200).send('File uploaded successfully!');
    });
}

const fileSizeFormatter = (bytes,decimal)=>{
    if(bytes === 0)
    {
        return "0 bytes"
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes)/Math.log(1000));

    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
      );
};


module.exports = {fileSizeFormatter,fileUpload}

