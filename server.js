"use strict";

var app  = require("express")(),
	bodyParser = require("body-parser"),
	morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser());

var data = {
"Status": 1,
"Data": {
"Accounts": [
{
"PublicKey": "7F6B6BCD15B7D6F7EABB7CAD0016A506663804930F712C230B2D551832485F17",
"Money": 80067393640,
"Name": "trestoradmin",
"Address": "TNegJDtZrPSaNUqUxNnCNuSQQTpSjLPNbVB",
"AccountState": 0,
"NetworkType": 14,
"AccountType": 217,
"LastTransactionTime": 130889292515036860
}
]
}
}



var users = {"dvw0ht" : {balance: 100000000000000}}
var transactions = {};


app.post("/propogate", function(req,res){
	var body = req.body;	
	console.log(body);
	performTransaction(body);
	res.send({status: 1,data: "Ok"})
});



app.get("/status/:transactionId", function(req,res){
	console.log("Status for: "+ req.params.transactionId);
	res.send({status:1, data: transactions[req.params.transactionId]});
})

app.get("/balance/:name", function(req,res){
	console.log("Balance for: "+ req.params.name)
	var name = req.params.name;
	if(name in users){
		console.log("User found")		
		data["Data"]["Accounts"][0]["Money"] = users[name].balance ;
		res.send({status:1, data: data});
	}		
	else{
		console.log("User not found")	
		console.log(data["Data"]["Accounts"][0]["Money"])	;
		data["Data"]["Accounts"][0]["Money"] = 0.0
		res.send({status:1, data: data});
	}
})

app.listen(8086);

function failedTransaction(req){
	transactions[req.transactionId] = "FAILURE";
}

function successTransaction(req){
	var sender = req.sources[0];
	var destination = req.destinations[0];
	if(sender.name in users){
		users[sender.name].balance -= sender.value; 
		if(destination.name in users)
			users[destination.name].balance += destination.value * 1000000;
		else{
			let val = destination.value * 1000000;
			users[destination.name] = {balance: val}
		}
		transactions[req.transactionId] = "SUCCESS";
	}
	else{
		console.log("Sender name not in users")
		failedTransaction(req);
	}
}

function performTransaction(req){
	var val = Math.random();
	if(val > 0.9)
		failedTransaction(req)
	else
		successTransaction(req)

}

