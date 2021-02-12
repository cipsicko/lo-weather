'use-strict'

import gulp from 'gulp';
import config from './gulpconfig.json';
import merge from 'merge-stream';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import exorcist from 'exorcist';
import { stream } from 'browser-sync';

// production mode (see build task)
let isProduction = false;

const { src, dest, watch, parallel, series } = require("gulp");

const sync = require("browser-sync").create();

const fs = require('fs');
const packageData = JSON.parse(fs.readFileSync('./package.json'));
const assetBasePath = packageData.assetsPath;
const assetVersion = packageData.version;

//include plugin
let plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// copy file from bower folder into the app vendor folder
let vendor = () => {
    plugins.util.log(plugins.util.colors.inverse(' Copying vendor assets..'));

    let jsFilter = plugins.filter('**/*.js', {
        restore: true
    });

    let cssFilter = plugins.filter('**/*.css', {
        restore: true
    });

    let vendorSource = require('./vendor.json');

    let stream = src(vendorSource, {base: 'bower_components'})
        .pipe(jsFilter)
        .pipe(plugins.concat('vendors.js'))
        .pipe(plugins.rename({
            suffix : "_v=" + assetVersion
        }))
        .pipe(dest(config.output.vendor.scripts))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.concat('vendors.css'))
        .pipe(plugins.rename({
            suffix : "_v=" + assetVersion
        }))
        .pipe(plugins.cssnano())
        .pipe(dest(config.output.vendor.styles))
        .pipe(cssFilter.restore);

    return stream;
};

let styles = () => {

    plugins.util.log(plugins.util.colors.inverse(' Starting building styles...'));

    let sassStream,
        cssStream,
        cssnanoOpts = {
            safe: true,
            discardUnused: false, // no remove @font-face
            reduceIdents: false, // no change on @keyframes names
            zindex: false // no change z-index
        };

    sassStream = src(config.input.sass)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        //.pipe(plugins.autoprefixer())
        .pipe(plugins.if(isProduction, plugins.cssnano(cssnanoOpts)))
        .pipe(plugins.sourcemaps.write('./maps'))
        .pipe(dest(config.output.styles));

    cssStream = src(config.input.styles)
        .pipe(plugins.if(isProduction, plugins.cssnano(cssnanoOpts)));

    let stream = merge(cssStream, sassStream)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(plugins.if(isProduction, plugins.rename('main.min.css')))
        .pipe(plugins.rename({
            suffix : "_v=" + assetVersion
        }))
        .pipe(dest(config.output.styles))
        .pipe(sync.stream());// Compile sass into CSS & auto-inject into browsers

    return stream;
};

let scripts = () => {

    plugins.util.log(plugins.util.colors.inverse(' Starting building scripts...'));

    return browserify({
            entries: config.input.scripts,
            debug: true
        })
        .transform('babelify', {
            presets: ['env']
        })
        .bundle().on('error', function(error){
            plugins.util.log(plugins.util.colors.red('[Build Error]', error.message));
            this.emit('end');
        })
        .pipe(exorcist(config.output.scripts + 'main.js.map'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(plugins.if(isProduction, plugins.rename('main.min.js')))
        .pipe(plugins.rename({
            suffix : "_v=" + assetVersion
        }))
        .pipe(dest(config.output.scripts));
};

let views = () => {

    plugins.util.log(plugins.util.colors.inverse(' Starting building views...'));

    let jadeOps = {
        pretty  :   true,
        locals : {
            isProduction : isProduction,
            assetBasePath : isProduction ? assetBasePath.prod : assetBasePath.dev,
            assetsVersion : assetVersion
        }
    };

	let stream = src(config.input.views)
		.pipe(plugins.jade(jadeOps))
        /*.pipe(plugins.rename(function(path){
            path.extname = ".php"
        }))*/
		.pipe(dest(config.output.views))

    return stream;
};

let webserver = (done) => {
    plugins.util.log(plugins.util.colors.inverse(' Starting web server... '));

    sync.init({
        //notify: false,
        server: {
            baseDir: './build/'
        },
        //port:8080
    });
    done();
};

let watcher = () => {
    watch([config.input.viewsParts, config.input.views], series(views))
    watch([config.input.styles, config.input.sass], series(styles));
    watch(config.input.scriptsPath, series(scripts));

    watch(config.output.views).on('change', sync.reload);
    watch(config.output.scripts).on('change', sync.reload);

    plugins.util.log(plugins.util.colors.inverse(' You can start edit now... '));

}

let imageCompress = () => {
    plugins.util.log(plugins.util.colors.inverse(' Starting optimize images... '));
    let stream = src(config.input.images)
        .pipe(plugins.if(isProduction, plugins.image({
            concurrent: 10,
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            mozjpeg: ['-optimize', '-progressive'],
        })))
        .pipe(dest(config.output.images));

    return stream;
};

let clean = () => {
    plugins.util.log(plugins.util.colors.inverse(' Starting cleaning build folder...'));
    let stream = src('.');
    fs.access(config.output.base, (err) => {
        if(err){
            stream = src('.');
        } else {
            stream = src(config.output.base, {read:false})
                            .pipe(plugins.clean());
        }
    })
    return stream;
};

exports.clean = clean;
exports.vendor = vendor;
exports.styles = styles;
exports.scripts = scripts;
exports.views = views;
exports.image = imageCompress;
exports.web = webserver;
exports.watch = watcher;

exports.dev = series(clean, vendor, styles, scripts, views, imageCompress, webserver, watcher);

