# PERFORMANCE MATTERS

## SEVERSIDE RENDERED PAGE VS SPA(SINGLE PAGE APP)

### SINGLE PAGE PERFORMANCE

![SPA](https://i.gyazo.com/90bacb168a46d6f1bce303170eedf302.png)

### SERVER RENDERED PAGE

![SEVERSIDE](https://i.gyazo.com/52738735ed9e30ae70de0db71fc32e2f.png)

### CONCLUSION

As you can see, the serverside rendered page was finished loading three times faster than the SPA. But the serverside rendered page also had alot less requests than the SPA. That is the benefit of having serverside rendered pages. Routing and rendering handled by a server and not the client.

## LETS BLOAT THIS BADBOY

Since the application is small and boring to do some performance improvements, I'll bloat the website so we will have something to work with.

![BLOATED](https://i.gyazo.com/ae20a9209efa51f964f7c38e409f7ad1.png)

A loadtime of 41.59s, Pretty awefull if you ask me. A good starting point though. 

### JS FILE'S

Well, every modern framework is pretty big. So it is not a surprise that angular is 1.3mb. But there are an awefull lot of comments inside the Angular file that will not be read anyways. And the same goes for jQuery. Let's remove those and minify the files. And as bonus,concat all js files.

![SMALLER](https://i.gyazo.com/3a82b49135f10e64e2236ab3ea6bfef0.png)

Alright, 530kb. Still a big file, but considering they were two files before and almost 2mb combined. This is not too bad. We brought down the loading time from 41.59s to 19.20s. Not bad if you ask me.

### CSS FILES

Lets see if we can do the same for the css files

![SMALLER CSS](https://gyazo.com/1f58dc4277de5bd93575a199c28f5463)

Hmm, the css is probably too small to have any effect on the loading time. 19.17s is a too small of an improvement.

### LETS THROW SOME GZIP AT IT

![GZIP](https://i.gyazo.com/6efcb5a073aaff73174e0ab5419d49b7.png)

After compressing, minifying and concatenating all the files. We have a loadtime of 10.74s. Which is reasonable for getting here from 41.59s. I don't know what to do more to get the loadtime even smaller. 

### GULP

For generating static gzip files, minifying and concatenating the files, I've used a gulp file that looks like this.

```javascript
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

```
As you can see, the gulp task creates a static gzip file. That is beeing served to the client with the code below:

```javascript
app.get("*.js", (req, res, next) => {

    // only if file exists, the substr is to remove /assets in front
    if (!fs.existsSync(`./static/js/${req.url.substr(4)}.gz`)) {
    	console.log(req.url.substr(4))
        return next();
    }

    console.log(`${req.url} -> ${req.url}.gz`);

    req.url = `${req.url}.gz`;
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/javascript");
    next();
});

app.get("*.css", (req, res, next) => {

    // only if file exists, the substr is to remove /assets in front
    if (!fs.existsSync(`./static/css/${req.url.substr(4)}.gz`)) {
    	console.log(req.url.substr(4))
        return next();
    }

    console.log(`${req.url} -> ${req.url}.gz`);

    req.url = `${req.url}.gz`;
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/css");
    next();
});
```


to run this, I've created a npm script

```
npm run-script build
```

