
var express = require('express')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
mongoose.connect('mongodb://128.199.51.239:27017/robinj')

var Post = require('./posts/Post')

var app = express()

app.use(bodyParser.json())

app.get('/posts', function (request, response, next){
	Post.find({}, function (err, posts){
		response.send(posts)
	})

})
app.get('/posts/:id', function(req, res, next){
	var id = req.params.id

	Post.findOne({_id:id}, function(err, post){
		if(post){
			res.send(post)
		} else {
			res.send("Post not found")
		}
	})
})
app.post('/posts', function(req, res, next){
	Post.create(req.body, function(err, post){
		res.send(post)
	})
})
app.put('/posts/:id', function(req, res, next){
	var id = req.params.id

	Post.findOneAndUpdate({_id:id}, req.body, {}, function(err, success){
		res.send("Ok updated")
	})
})

app.delete('/posts/:id', function(req, res, next){
	var id = req.params.id

	Post.findOneAndRemove({_id:id}, {}, function(err, success){
		res.send("Ok deleted")
	})
})


app.listen(3000, function(){
	console.log("Server running on port 3000")
})