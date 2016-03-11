var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
	title: String,
	content: String,
	image_url: String
})

module.exports = mongoose.model('Post', PostSchema)

