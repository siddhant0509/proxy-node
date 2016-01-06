var app  = require("express")(),
	bodyParser = require("body-parser"),
	morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser());

var transactions = [];

app.post("/propogate", function(req,res){
	var body = req.body;	
	res.send({status: 1,data: "Ok"})
});

app.get("/status/:transactionId", function(req,res){
	res.send({status:1, data: "SCHEDULED"});
})

app.listen(8086);
