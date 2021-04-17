const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const n_port = 3000;

app.set("view engine", "ejs");

app.get("/", function(req, res){
  const date = new Date();
  const dayIndex = date.getDay();
  const days = ["Montag", "Dienstag", "Mittwoch", "donnerstag", "Freitag", "Samstag", "Sonntag"];

  res.render("list.ejs", {dayOfTheWeek : days[dayIndex-1]});
});

app.listen(n_port, function(){
  console.log("Server started: port "+n_port);
});
