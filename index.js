/**
 * Used for NUOMI APP projects.
 * 1. Use relative path instead of absolute path to support file protocal access.
 */

'use strict';

var path = require('path');

function WebpackPluginSigma(){

}

WebpackPluginSigma.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('compilation', function(compilation) {

    var outputPath = compilation.options.output.publicPath;
    if(outputPath[0] === '/'){
      // Convert to relative path for html page.
      compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) {

        var packData = htmlPluginData;
        var pagePath = packData.outputName;

        //console.info('WebpackPluginSigma-Before:', JSON.stringify(packData.head, null, 4), JSON.stringify(packData.body, null, 4), packData);
        packData.head.forEach(function (vItem) {
          self.calcPath(vItem, pagePath);
        });
        packData.body.forEach(function (vItem) {
          self.calcPath(vItem, pagePath);
        });
        //console.info('WebpackPluginSigma-After:', JSON.stringify(packData.head, null, 4), JSON.stringify(packData.body, null, 4), packData);

        callback(null, htmlPluginData);
      });
    }else{
      // 以HTTP开头的Dest环境不改变为相对路径
    }
  });

};

/**
 * 绝对路径转换为相对路径
 * @param vItem
 * @param pagePath
 */
WebpackPluginSigma.prototype.calcPath = function (vItem, pagePath) {
  var attrKeyName = vItem.attributes.href ? 'href' : (vItem.attributes.src ? 'src' : '');
  var attrAbsPath = vItem.attributes[attrKeyName];
  // Convert to relative
  var attrRelPath = '.' + attrAbsPath;

  // Page Path: './page/carservicechannel/home/index.html'
  // Link Path: './page/lib/base.bundle.js?f517d7f222f4195b4b86'

  if(attrKeyName){
    vItem.attributes[attrKeyName] = path.relative(pagePath, attrRelPath).replace('..\\', '');
  }else{
    // Failed to find path.
    console.error('Webpack Plugin Sigma path relative failed: ', vItem.attributes);
  }
};

module.exports = WebpackPluginSigma;
