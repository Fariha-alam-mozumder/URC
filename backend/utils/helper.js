import { supportedMimes } from "../config/filesystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate only PDFs (maxSize in MB)
export const fileValidator = (maxSize, mimeType) => {
  if (mimeType !== 'application/pdf') {
    throw new Error('Only PDF files are allowed')
  }
  // For express-fileupload, size is in bytes
  return (file) => {
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSize) {
      throw new Error(`File size must be less than ${maxSize}MB`)
    }
  }
}

// FIXED: Upload PDF file to the correct directory that will be served by Express
export const uploadFile = async (file, isFile = true, type = 'pdf') => {
  const ext = path.extname(file.name || '')
  const filename = `${uuidv4()}${ext}`
  
  // CHANGED: Upload PDFs to public/documents instead of public/files
  // This way they can be accessed via /documents/ URL
  const uploadDir = type === 'pdf' ? 'public/documents' : 'public/images'

  // Ensure directory exists
  await fs.promises.mkdir(uploadDir, { recursive: true })

  const uploadPath = path.join(uploadDir, filename)

  if (isFile) {
    await file.mv(uploadPath) // express-fileupload method
  } else {
    await fs.promises.writeFile(uploadPath, file.data)
  }

  // IMPORTANT: Return path that will work with static file serving
  // Since Express serves public/ as static, we return the path relative to public/
  return type === 'pdf' ? `documents/${filename}` : `images/${filename}`
}

export const imageValidator = (size, mime) => {
  if (byteToMb(size) > 2) {
    return "Image size must be less than 2MB";
  } else if (!supportedMimes.includes(mime)) {
    return "IMAGE must be type of png, jpg, gif, jpeg, webp, svg...";
  }
  return null;
};

export const byteToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNum = () => {
  return uuidv4();
};

// Get document URL (for PDFs)
export const getDocumentUrl = (docPath) => {
  if (!docPath) {
    return null;
  }
  // Since Express serves public/ as static files, and docPath is relative to public/
  return `${process.env.APP_URL}/${docPath}`;
};

export const getImageUrl = (imgName) => {
  if (!imgName) {
    return `${process.env.APP_URL}/images/default.png`;
  }
  return `${process.env.APP_URL}/images/${imgName}`;
};

// Remove document file
export const removeDocument = (docPath) => {
  if (!docPath) return;
  
  const fullPath = path.join(process.cwd(), "public", docPath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const removeImage = (imageName) => {
  const path = process.cwd() + "/public/images/" + imageName;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export const uploadImage = (image) => {
  const imgExt = image?.name.split(".");
  const imageName = generateRandomNum() + "." + imgExt[1];
  const uploadPath = process.cwd() + "/public/images/" + imageName;

  image.mv(uploadPath, (err) => {
    if (err) throw err;
  });

  return imageName;
};