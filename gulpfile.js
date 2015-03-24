// ============================================================>
// GULP MODULES
// ============================================================>

var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    minify          = require('gulp-minify-css'),
    plumber         = require('gulp-plumber'),
    watch           = require('gulp-watch'),
    sass            = require('gulp-sass'),
    compass         = require('gulp-compass'),
    uglify          = require('gulp-uglify'),
    notify          = require('gulp-notify'),
    sourcemap       = require('gulp-sourcemaps'),
    imagemin        = require('gulp-imagemin'),
    jshint          = require('gulp-jshint'),
    watch           = require('gulp-watch'),
    pngquant        = require('imagemin-pngquant'),
    browserSync     = require('browser-sync');

// ============================================================>
// SETTINGS
// ============================================================>


var src = {
    sass:   ['src/**/*.scss','src/**/*.sass'],
    sass2:  'src',
    css:    'src/css',
    js:     ['src/**/*.js'],
    img:    'src/img/*'
};

var output = {
    js:             'output/js',
    css:            'output/css',
    img:            'output/img/',
    html:           'output/**/*.html',
    min_css:        'app.min.css',
    min_js:         'app.min.js'
};

var dist_css        = 'dist/css',
    dist_js         = 'dist/js',
    dist_img        = 'dist/img',
    src_sass        = ['src/**/*.sass','src/**/*.scss'],
    src_sass_b      = 'src',
    src_css         = 'src/css',
    src_img         = 'src/img/*',
    src_js          = 'src/**/*.js';

// ============================================================>
// TASKS :: SASS WITH COMPASS
// ============================================================>

gulp.task('sass', function() {
    gulp.src(src.sass)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(compass({
            css: src.css,
            sass: src.sass2
        }))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: true
        }))
        .pipe(sourcemap.init())
        .pipe(concat(output.min_css))
        .pipe(minify())
        .pipe(sourcemap.write())
        .pipe(gulp.dest(output.css))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify('End SASS process'));
});

// ============================================================>
// TASKS :: JS
// ============================================================>

gulp.task('js', function() {
    gulp.src(src.js)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat(output.min_js))
        .pipe(sourcemap.init())
        .pipe(sourcemap.write())
        .pipe(gulp.dest(output.js))
        .pipe(notify('End JS process'));
});

// ============================================================>
// TASKS :: IMAGES
// ============================================================>

gulp.task('img', function() {
    return gulp.src(src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugin: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(output.img))
        .pipe(notify('End IMG process'));
});

// ============================================================>
// TASKS :: WATCHER
// ============================================================>

gulp.task('watch', function() {
    browserSync.init({
        server: './output'
    });
    gulp.watch(src.js, ['js']);
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.img, ['img']);
    gulp.watch(output.html).on('change', browserSync.reload);
});


// ============================================================>
// TASKS :: DEFAULT
// ============================================================>

gulp.task('default', ['sass','js','img','watch']);