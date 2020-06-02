const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, uniqueId)=>{
    //var pathName = './'+dataDir+'/'+uniqueId;

    fs.writeFile(path.join(exports.dataDir, uniqueId +'.txt'), text, (err) => {
      if (err) {
        throw ('error creating todo');
      } else {
        callback(null, {id: uniqueId, text: text});
      }
    });
  });
};

exports.readAll = (callback) => {
  //var array = [];
  fs.readdir(exports.dataDir, (err, files) => {
    //return { id, text };
    //array.push(files);

    //console.log("file :", array);
    // return file.id;
    var newFiles = [];
    files.forEach((file) => {
      var obj = {id: file.slice(0,file.length-4), text: file.slice(0,file.length-4)}; //need to read the text of the file, fs.readFile(file,()=>{})}
      newFiles.push(obj);
    });
    callback(null, newFiles);
  });
  //callback(null, data);
};

exports.readOne = (id, callback) => {


  fs.readFile(path.join(exports.dataDir, id +'.txt'), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  //var item = items[id];

  fs.readFile(path.join(exports.dataDir, id +'.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id +'.txt'), text, (err) => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  fs.unlink(path.join(exports.dataDir, id +'.txt'), (err) => {
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
