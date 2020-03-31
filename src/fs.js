var fs = require('fs');

// var checkTime = fileName => {
//   var stats = fs.statSync(fileName);
//   return stats.mtime;
// };
var checkTime = fileName => {
  var resTime = null;
  fs.stat(fileName, (err, stats) => {
    console.log(stats.mtime);
  });
  return resTime;
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
