'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    smoosher = require('gulp-smoosher'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    svgmin = require('gulp-svgmin'),
    svgo = require('imagemin-svgo'),
    svgless = require('gulp-svg-less'),
    browserSync = require("browser-sync"),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    pump = require('pump'),
    include       = require("gulp-include"),
    reload = browserSync.reload;


var path = {
    build: {
        php: 'build/',
        html: 'build/',
        js: 'build/assets/js/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        font: 'build/assets/fonts/',
        inline: 'build/'
    },
    src: {
        php:  'src/*.php',
        html:  'src/*.html',
        js: 'src/assets/js/**/*.js',
        style: 'src/assets/styles/*.less',
        img: 'src/assets/img/**/*.*',
        font: 'src/assets/fonts/**/*.*',
        inline: 'build/*.html'
    },
    watch: {
        php: 'src/**/*.php',
        html: 'src/**/*.html',
        js: 'src/assets/js/**/*.js',
        style: 'src/assets/styles/**/*.less',
        img: 'src/assets/img/**/*.*',
        font: 'src/assets/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    open: true,
    host: 'localhost',
    port: 8028,
    logPrefix: "Frontend"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(include())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function (cb) {

    pump([
            gulp.src(path.src.js),
            rigger(),

            gulp.dest(path.build.js),
            reload({stream: true})
        ],
        cb
    );

});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(less())
        .pipe(prefixer())
        // .pipe(urlencode())
        .pipe(csso())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('image:build', function (cb) {
    pump([
        gulp.src(path.src.img, {cwd: process.cwd()}),
        imagemin([
            imagemin.svgo({
                plugins: [{
                    removeDoctype: false
                }, {
                    removeComments: false
                }, {
                    cleanupNumericValues: {
                        floatPrecision: 2
                    }
                }, {
                    convertColors: {
                        names2hex: false,
                        rgb2hex: false
                    }
                }]
            })
        ]),
        gulp.dest(path.build.img, {cwd: process.cwd()}),
        reload({stream: true})
    ], cb);

});


gulp.task('font:build', function () {
    gulp.src(path.src.font)
        .pipe(gulp.dest(path.build.font))
});
gulp.task('inline', function () {
    gulp.src(path.src.inline)
        .pipe(smoosher())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.inline))
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'font:build',
    'image:build'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');

    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.font], function (event, cb) {
        gulp.start('font:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('default', ['build', 'webserver', 'watch']);


