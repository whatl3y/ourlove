var gulp = require('gulp')
var babel = require('gulp-babel')
var plumber = require('gulp-plumber')
// var replace = require('gulp-replace')
// var sourcemaps = require('gulp-sourcemaps')
// var uglify = require('gulp-uglify')

gulp.task('config', function() {
  return gulp.src("./src/config.js")
    .pipe(gulp.dest("./"))
})

gulp.task('libs-dev', function() {
  return gulp.src("./src/libs/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./libs"))
})

gulp.task('libs-prod', function() {
  return gulp.src("./src/libs/**/*.js")
    // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    // .pipe(uglify().on('error', console.log))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("./libs"))
})

gulp.task('bin-dev', function() {
  return gulp.src("./src/bin/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./bin"))
})

gulp.task('bin-prod', function() {
  return gulp.src("./src/bin/*.js")
    // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    // .pipe(uglify().on('error', console.log))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("./bin"))
})

gulp.task('passport-dev', function () {
  return gulp.src("./src/passport_strategies/*.js")
    .pipe(babel())
    // .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./passport_strategies"))
})

gulp.task('passport-prod', function () {
  return gulp.src("./src/passport_strategies/*.js")
    // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    // .pipe(uglify().on('error', console.log))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("./passport_strategies"))
})

gulp.task('routes-dev', function() {
  return gulp.src("./src/routes/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./routes"))
})

gulp.task('routes-prod', function() {
  return gulp.src("./src/routes/**/*.js")
    // .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    // .pipe(uglify().on('error', console.log))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest("./routes"))
})

gulp.task('prep-dev', ['config', 'libs-dev', 'bin-dev', 'passport-dev', 'routes-dev'], function() {})
gulp.task('prep-prod', ['config', 'libs-prod', 'bin-prod', 'passport-prod', 'routes-prod'], function() {})
