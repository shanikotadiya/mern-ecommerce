const fs = require('fs');
const path = require('path');

exports.localUpload = async (image, req) => {
  let imageUrl = '';
  let imageKey = '';

  if (image) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(image.originalname);
    const filename = `${uniqueSuffix}${extension}`;
    
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, image.buffer);
    
    // Construct the fully-qualified image URL
    if (req) {
      const protocol = req.protocol;
      const host = req.get('host');
      imageUrl = `${protocol}://${host}/uploads/${filename}`;
    } else {
      imageUrl = `/uploads/${filename}`;
    }
    imageKey = filename;
  }

  return { imageUrl, imageKey };
};
