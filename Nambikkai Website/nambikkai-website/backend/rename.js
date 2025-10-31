const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

const files = fs.readdirSync(uploadsDir);

files.forEach(file => {
  if (!file.includes('.')) {
    const newName = file + '.jpg';
    const oldPath = path.join(uploadsDir, file);
    const newPath = path.join(uploadsDir, newName);
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${file} to ${newName}`);
    } catch (err) {
      console.error(`Error renaming ${file}:`, err);
    }
  }
});
