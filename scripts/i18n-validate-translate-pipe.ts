import glob from 'glob';
import fs from 'fs';

const errors = [];

function validateFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  if (data.includes('| translate')) {
    errors.push(filePath);
  }
}

const getDirectories =  (src, callback) =>  {
    glob(src + '/**/*.html', callback);
  };
getDirectories('./src', (err, res) => {
    if (err) {
      console.log('Error', err);
    } else {
      res.forEach(filePath => validateFile(filePath))
      if (errors.length) {
        throw new Error('There are files using translate pipe')
      }
    }
  });


