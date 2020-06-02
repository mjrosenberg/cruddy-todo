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
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
