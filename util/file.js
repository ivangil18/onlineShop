const file = require('fs');

exports.deleteFile = filePath => {
  file.unlink(filePath, err => {
    if (err) {
      throw (err);
    }
  });
};
