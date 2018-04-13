var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var moment = require("moment");

var app = express();

app.use(bodyParser.urlencoded({extended: true})); // don't need this for Angular
app.use(bodyParser.json());
app.use(express.static(__dirname + '/AngularApp/dist'));
console.log(__dirname + '/AngularApp/dist');

mongoose.connect("mongodb://localhost/task_api");

var TaskSchema = new mongoose.Schema({
	title: {type: String},
	description: {type: String, default: ""},
	completed: {type: Boolean, default: false},
	updated_at: {type: Date, default: Date.now},
	created_at: {type: Date, default: Date.now}
}, {versionKey: false});

mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

mongoose.Promise = global.Promise;

// ********************* ROUTES *********************

// CREATE A TASK
app.post("/create", function(req, res){
	var task = new Task(req.body);
  	task.save(function(err, task){
		if(err){
			console.log("ERROR: ", err);
		}
		else{
			console.log('You successfully created a task.', task);
			res.json({message: "Success", task: task});
		}
	})
})

// RETRIEVE ALL TASKS
app.get('/tasks', function(req, res){
	Task.find({}, function(err, tasks){
		if(err){
			console.log("ERROR: ", err);
			res.json({message: "ERROR", error: err});
		}
		else{
			res.json({tasks})
		}
	})
})

// RETRIEVE A TASK BY ID
app.get("/retrieve/:id", function(req, res){
	Task.find({_id: req.params.id}, function(err, task){
		if(err){
			console.log("ERROR: ", err);
			res.json({message: "ERROR", error: err});
		}
		else{
			res.json({task});
		}
	})
})

// UPDATE A TASK BY ID
app.put("/update/:id", function(req, res){
	updated_task = {};
	if (req.body){
		updated_task = req.body;
	}
	Task.update({_id: req.params.id}, updated_task, function(err){
		if(err){
			console.log("ERROR: ", err);
			res.json({message: "ERROR", error: err});
		}
		else{
			res.json({message: "Success"})
		}
	});
})

// DELETE A TASK BY ID
app.delete("/delete/:id", function(req, res){
	Task.remove({_id: req.params.id}, function(err){
		if(err){
			console.log("ERROR: ", err);
			res.json({message: "ERROR", error: err});
		}
		else{
			res.json({message: "Success"})
		}
	});
})



var server = app.listen(8000, function(){
	console.log("listening on port 8000");
});

