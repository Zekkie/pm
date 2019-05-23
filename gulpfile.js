const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const gzip = require("gulp-gzip");

const jsfiles = "static/js/*.js";
const cssfiles = "static/css/*.css";

gulp.task('create-vendor-js', () => {
	return gulp.src(jsfiles)
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gzip())
		.pipe(gulp.dest('static/js'))
})

gulp.task('create-vendor-css', () => {
	return gulp.src(cssfiles)
		.pipe(concat('vendor.css'))
		.pipe(uglifycss())
		.pipe(gzip())
		.pipe(gulp.dest('static/css'))
})
