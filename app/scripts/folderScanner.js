const electron = require('electron');
const fs = require('fs');
var walkSync = function(dir, filelist) {
        try {
            var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach(function(file) {
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    filelist = walkSync(dir + '/' + file, filelist);
                }
                else {
                    if(['png', 'jpg', 'jpeg'].indexOf(file.split('.').pop()) !== -1){
                    	filelist.push(dir + '/' + file);
                	}
                }
            });
        }catch(err) {
            console.log(err.message);
        }finally {
            return filelist;
        }
    };
var pathList = [];
pathList = walkSync(process.argv[2], pathList);
process.send({paths : pathList});