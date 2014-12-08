var gulp        = require("gulp");
var jshint      = require('gulp-jshint');
var contribs    = require('gulp-contribs');
var sass        = require("gulp-sass");
var autoprefix  = require("gulp-autoprefixer");
var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var filter      = require('gulp-filter');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

/**
 * Lint all JS files
 */
gulp.task('lint', function () {
    return gulp.src(['test/client/specs/**/*.js', 'lib/js/scripts/*.js', 'index.js'])
        .pipe(jshint('test/.jshintrc'))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

/**
 * Update Contributors list
 */
gulp.task('contribs', function () {
    gulp.src('README.md')
        .pipe(contribs())
        .pipe(gulp.dest("./"));
});


/**
 * Build the app.
 */
gulp.task('browserify', function () {
    return gulp.src('lib/js/scripts/index.js')
        .pipe(browserify())
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./lib/js/dist"));
});

/**
 * Start BrowserSync
 */
gulp.task('browser-sync', function () {
    browserSync({
        proxy: "http://localhost:3001/",
        files: ["lib/*.html"]
    });
});
/**
 * Start BrowserSync
 */
gulp.task('browser-sync-dev', function () {
    //browserSync.use(require("bs-html-injector"), {files: "lib/*.html"});
    browserSync({
        server: "lib",
        startPath: "_server-info.html"
    });
});

/**
 * Compile CSS
 */
gulp.task('sass', function () {
    return gulp.src('lib/scss/**/*.scss')
        .pipe(sass())
        .on('error', function (err) { browserSync.notify(err.message); console.log(err.message) })
        .pipe(autoprefix())
        .pipe(gulp.dest('lib/css'))
        .pipe(filter("**/*.css"))
        .pipe(reload({stream:true}));
});

/**
 * Compile CSS
 */
gulp.task('bs-inject', function () {
    setTimeout(function () {
        browserSync.reload("core.css");
    }, 500);
});

/**
 * Build Front-end stuff
 */
gulp.task('dev-frontend', ["sass", "browser-sync-dev"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
});

gulp.task('watch-css', ["sass"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
});

gulp.task('default', ["lint"]);

gulp.task('build', ["browserify", "lint"]);

gulp.task('dev', ["browserify"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
    gulp.watch("lib/js/scripts/**/*.js", ["browserify"]);
});

