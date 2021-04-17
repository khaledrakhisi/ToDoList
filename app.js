const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const n_port = 3000;

let items = [];

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  // const date = new Date();
  // const dayIndex = date.getDay();
  // const days = ["Montag", "Dienstag", "Mittwoch", "donnerstag", "Freitag", "Samstag", "Sonntag"];

  const event = new Date();
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  const s_date = event.toLocaleDateString('de-DE', options);
  // expected output: Donnerstag, 20. Dezember 2012

  res.render("list.ejs", {
    dayOfTheWeek: s_date,
    listItems: items
  });
});

app.post("/", (req, res) => {
  let s_item = req.body.txt_todo;
  if (s_item) {
    items.push(s_item);
    res.redirect("/");
  }
  else{
    // res.send("Empty not allowed.");
    
    res.redirect("/");
  }
});

app.listen(n_port, function() {
  console.log("Server started: port " + n_port);
});
