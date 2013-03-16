/**
 * lib/fileutils
 *
 * Contains all the file maniulation utilities
 */
var fs = require('fs')
  , path = require('path');

var exports = module.exports = {};


/**
 * Get the absolute path based on the path relative from the root
 *
 * @param relativePathFromAppRoot
 * @return Resolved absolute path
 */
exports.getFullPath = function(relativePathFromAppRoot) {

  // we start off going back one dir since we are in the /util dir
  var fullPath = path.join(__dirname, '..');

  // if the value passed in is an array, loop through the array
  if(relativePathFromAppRoot instanceof Array) {
    relativePathFromAppRoot.splice(0, 0, fullPath);

    fullPath = path.join.apply(this, relativePathFromAppRoot);
  }
  // else assume its a string and just append it
  else {
    fullPath = path.join(fullPath, relativePathFromAppRoot);
  }

  return fullPath;
};

/**
 * Convenience function to load a file using a relative path from the app root
 * @param relativePathFromAppRoot
 * @param throwOnError - Flag to optionally disable throwing FileNotFound errors
 * @return The module.exports in the target file
 */
exports.require = function(relativePathFromAppRoot, throwOnError) {
  if(throwOnError === undefined) {
    throwOnError = true;
  }
  
  var fullPath = this.getFullPath(relativePathFromAppRoot);

  if(fs.existsSync(fullPath)) {
    return require(fullPath);
  } else if (!throwOnError) {
    return null;
  }
};
