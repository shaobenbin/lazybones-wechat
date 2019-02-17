/**
 * Created by binbin on 8/30/16.
 */
"use strict";

var grunt = require('grunt')

module.exports = function(grunt) {
    grunt.initConfig({
        'create-windows-installer': {
          x64: {
            version: '1.0.7',
            authors: 'binbin',
            loadingGif: 'install-loadding.gif',
            title: '懒虫微信云客服',
            //iconUrl: 'sg.ico',
            setupIcon: 'sg.ico',
            appDirectory: '/Users/binbin/Devel/OutApp/shangguykf-win32-x64',
            outputDirectory: '/Users/binbin/Devel/OutApp/shangguykf-win32-x64-build',
            skipUpdateIcon : true,
            exe: 'shangguykf.exe'
          },
          x32: {
            version: '1.0.7',
            authors: 'binbin',
            loadingGif: 'install-loadding.gif',
            title: '懒虫微信云客服',
            //iconUrl: 'sg.ico',
            setupIcon: 'sg.ico',
            appDirectory: '/Users/binbin/Devel/OutApp/shangguykf-win32-ia32',
            outputDirectory: '/Users/binbin/Devel/OutApp/shangguykf-win32-ia32-build',
            skipUpdateIcon : true,
            exe: 'shangguykf.exe'
          }
        }
    });

    grunt.loadNpmTasks('grunt-electron-installer');
    grunt.task.registerTask('default', ['create-windows-installer']);
}
