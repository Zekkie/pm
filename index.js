#!/usr/bin/env nodejs
const express = require("express");
const app = express();
const request = require("request");
var expressStaticGzip = require("express-static-gzip");
const path = require("path");
const fs = require("fs")


app.set('view engine',"pug");
app.set("views", "./views");




app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
let sources = [];

//app.use('/', expressStaticGzip(path.join(__dirname,'static')));


app.get("*.js", (req, res, next) => {

    // only if file exists, the substr is to remove /assets in front
    if (!fs.existsSync(`./static/js/${req.url.substr(4)}.gz`)) {
        return next();
    }


    req.url = `${req.url}.gz`;
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/javascript");
    next();
});

app.get("*.css", (req, res, next) => {

    // only if file exists, the substr is to remove /assets in front
    if (!fs.existsSync(`./static/css/${req.url.substr(4)}.gz`)) {
        return next();
    }


    req.url = `${req.url}.gz`;
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "text/css");
    next();
});


app.use(express.static('static'));

const findDataArray = (object) => {
	const keys = Object.keys(object);
	for(let i = 0; i < keys.length;i++) {
		if(object[keys[i]].push) {
			return object[keys[i]];
			break;
		}
	}
}

const filter = (o) => {
	return {
		url:o.url,
		image: o.urlToImage ? o.urlToImage : "./img/no-img.png",
		title: o.title,
		content: o.content ? o.content.replace(/ *\[[^)]*\] */g,"") : null,
	}
}

const fetchSources = () => {
	request("https://newsapi.org/v2/sources?apiKey=0edf421b40a64d2fa263ad513a586ddc",(err,res,body) => {
		const data = JSON.parse(body);

		sources = findDataArray(data)

		app.listen(9000);
	})
}

fetchSources();

const homeHandler = (req,res) => {
	res.render("index",{data:sources})
}

const sourceHandler = (req,res) => {
	const id = req.params.id;

	let url = `https://newsapi.org/v2/everything?sources=${id}&apiKey=0edf421b40a64d2fa263ad513a586ddc`;

	request(url,(err,response,body) => {
		const data = JSON.parse(body);
		const news = findDataArray(data).map(filter);

		res.render("detail",{data:news})
	})

	
}


app.get("/", homeHandler)
app.get("/source/:id", sourceHandler)


