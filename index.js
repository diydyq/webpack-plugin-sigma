/**
 * Used for NUOMI APP projects.
 * 1. Use relative path instead of absolute path to support file protocal access.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function WebpackPluginSigma(options){
  // Default options
  this.options = _.extend({
    relativePath:   true
  }, options);
}

WebpackPluginSigma.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('compilation', function(compilation) {

    var publicPath = compilation.options.output.publicPath;
    // 启用该功能才相对路径
    if(self.options.relativePath){
      // Convert to relative path for html page.
      compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) {

        var packData = htmlPluginData;
        var pagePath = packData.outputName;

        //console.info('WebpackPluginSigma-Before:', JSON.stringify(packData.head, null, 4), JSON.stringify(packData.body, null, 4), packData);
        packData.head.forEach(function (vItem) {
          self.calcPath(vItem, pagePath, publicPath);
        });
        packData.body.forEach(function (vItem) {
          self.calcPath(vItem, pagePath, publicPath);
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
WebpackPluginSigma.prototype.calcPath = function (vItem, pagePath, publicPath) {
  var attrKeyName = vItem.attributes.href ? 'href' : (vItem.attributes.src ? 'src' : '');
  var attrAbsPath = vItem.attributes[attrKeyName];
  // Convert to relative
  var attrRelPath = attrAbsPath.replace(publicPath, './');

  // Page Path: './page/searchlist/home/index.html'
  // Link Path: './page/lib/base.bundle.js?f517d7f222f4195b4b86'
  // Link Path: ./page/searchlist/home/index.bundle.js?86ffeac1892e810a4bab

  if(attrKeyName){
    vItem.attributes[attrKeyName] = path.relative(pagePath, attrRelPath).replace('..' + path.sep, '');
  }else{
    // Failed to find path.
    console.error('Webpack Plugin Sigma path relative failed: ', vItem.attributes);
  }
};

module.exports = WebpackPluginSigma;


function debugTest(){
  var p0 = './page/searchlist/home/index.html';
  var p1 = './page/searchlist/home/index.bundle.js?86ffeac1892e810a4bab';
  var p2 = './page/lib/base.bundle.js?86ffeac1892e810a4bab';

  console.info(path.relative(p0, p1));
  console.info(path.relative(p0, p2));
}