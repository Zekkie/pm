const express = require("express");
const app = express();
const request = require("request");


app.set('view engine',"pug");
app.set("voews", "./views");
app.use(express.static("static"));

let sources = [];

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


