var fs = require('fs');

// var checkTime = fileName => {
//   var stats = fs.statSync(fileName);
//   return stats.mtime;
// };
var checkTime = fileName => {
  return new Promise((resolve, reject) => {
    fs.stat(fileName, (err, stats) => {
      resolve(stats.mtime);
    });
  });
};
exports.lastModifiedDate = checkTime;

exports.writeToLocalCache = (jsonData, fileName) => {
  var jsonContent = JSON.stringify(jsonData);
  fs.writeFile(fileName, jsonContent, 'utf8', () => {
    console.log('Data written to file');
  });
};

exports.readLoadCache = (fileName, callback) => {
  fs.readFile(fileName, (err, jsonData) => {
    if (err) console.log(err);
    callback(jsonData);
  });
};
