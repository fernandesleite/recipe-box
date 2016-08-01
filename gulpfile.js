var gulp		= require("gulp");
var browserSync = require("browser-sync").create();
var reload 		= browserSync.reload;
var sass 		= require("gulp-sass");
var webpack 	= require("webpack-stream");

// watch html, css, scss and js for changes and reload the page
gulp.task("serve", ["sass"], function(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	// gulp.watch("js/*.js").on("change", reload);	// any js
	gulp.watch("main.js").on("change", reload);		// react
	gulp.watch("src/scss/*.scss", ["sass"]);
	gulp.watch("*.html").on("change", reload);
});

// convert scss to css
gulp.task("sass", function(){
	gulp.src("./src/scss/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("./css"))
		.pipe(browserSync.stream());
});

gulp.task("webpack", function(){
	return gulp.src("src/js/app.jsx")
		.pipe(
		webpack({
			watch: true,
			output:{
				filename: "main.js" //  	>> name of the file, if omitted name will be random
			},
			module:{
				loaders: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: "babel",
					query: {
						presets: ["es2015", "react"]
					}
				}]
			}})
			.on("error", function(error){ // webpack resume watching if encounters an error	
				this.emit("end");        // modify index.js to a better error handling
			}))

		.pipe(gulp.dest("./"));
});

gulp.task("default", ["serve"]); // Default Dev Env
gulp.task("react", ["serve", "webpack"]); // React Dev Env
