var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    cache         = require('gulp-cache'),
    concat        = require('gulp-concat'),
    Config        = require('./gulpfile.config'),
    del           = require('del'),
    express       = require('express'),
    imagemin      = require('gulp-imagemin'),
    inject        = require('gulp-inject'),
    jshint        = require('gulp-jshint'),
    livereload    = require('gulp-livereload'),
    minifycss     = require('gulp-minify-css'),
    ngAnnotate    = require('gulp-ng-annotate'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    sourcemaps    = require('gulp-sourcemaps'),
    uglify        = require('gulp-uglify');

var config = new Config();

var outputfolder = config.dist;

function startExpress() { 
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(config.dev));
  app.listen(config.expressPort);
}
function handleError(e){
  console.log(e);
  this.emit('end');
}

gulp.task('set-development', function (){
    outputfolder = config.dev;
});

gulp.task('moveIndex', function(){
  var index = gulp.src(config.dev + "index.html")
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest(outputfolder))
    .on('error', handleError);
});
gulp.task('moveLibs', function(){
  var index = gulp.src(config.dev + "libs/**")
    .pipe(gulp.dest(outputfolder + 'libs'))
    .on('error', handleError);
});
//Move templates into one folder
gulp.task('templates', function(){
  var templates = gulp.src(config.templateSource)
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest(outputfolder+'js/templates'))
    .on('error', handleError);
});

// Styles
gulp.task('styles', function() {
  var css = gulp.src(config.cssSource)
    // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(outputfolder +'css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(outputfolder+'css'))
    .on('error', handleError);
});
//Move CSS - themes into the correct folder (Usually after the styles task runs on startup)
gulp.task('themes', function(){
  //Semantic ui theme
  var themes = gulp.src(config.sassSource + 'themes/**')
    .pipe(gulp.dest(outputfolder +'css/themes'))
    .on('error', handleError);
  //Tiny mce theme
  var skin = gulp.src(config.sassSource+'mediablenders-tinymce-theme/**')
    .pipe(gulp.dest(outputfolder + 'css/mediablenders-tinymce-theme'))
    .on('error', handleError);
});

/**
 * Concat and minify all javascript
 */
gulp.task('scripts', function() {
  var jsResult = gulp.src(config.javaScriptSource)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js', {newLine:';'}))
    .pipe(sourcemaps.write()) // Added sourcemaps
    .pipe(gulp.dest(outputfolder + 'js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(ngAnnotate({add:true}))
    .pipe(uglify({mangle:true}))
    .pipe(gulp.dest(outputfolder+'js'));
});

// Same for test scripts
gulp.task('testscripts', function () {
  var jsTestsResult = gulp.src(config.javaScriptTestsSource)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .on('error', handleError);
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ 
      optimizationLevel: 3, 
      progressive: true, 
      interlaced: true 
    })))
    .pipe(gulp.dest(outputfolder+'images'))
    .on('error', handleError);
});
 
// Clean
gulp.task('clean', function(next) {
    del([config.dist + 'css', config.dist + 'js', config.dist + 'images'], next)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'templates', 'images', 'themes', 'moveIndex', 'moveLibs');
});

// Serve
gulp.task('serve', function () {
    livereload.listen(config.liveReloadPort);
    startExpress();
    gulp.start('set-development', 'styles', 'themes', 'images', 'scripts', 'templates', 'watch');
});

// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch(config.dev + '/**/*.css', ['set-development', 'styles']);
 
  // Watch .ts files
  gulp.watch([config.javaScriptSource], ['set-development', 'scripts']);
  gulp.watch([config.javaScriptTestsSource], ['set-development', 'testscripts']);
  gulp.watch([config.templateSource], ['set-development', 'templates']);
   // Watch any files in app/, reload on change
  gulp.watch(['app/css/**.css', 'app/js/**', 'app/**/*.html']).on('change', livereload.changed);
 
});