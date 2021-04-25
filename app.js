const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

const n_port = 3000;
let items = [];
const itemsWork = [];

const itemSchema = new mongoose.Schema({
  name : {
    type : String,
    require : true,
  }
});
const Item = mongoose.model("Item", itemSchema);

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("static"));

app.get("/", function(req, res) {
  // expected output: Donnerstag, 20. Dezember 2012
    items = [];
   // db.once('open', function() {
    // using callback
    Item.find({}, function(err, fetchedItems){
      console.log(fetchedItems.length);
      if(fetchedItems.length === 0){
        items.push(new Item({name: "Morgen aufstehen"}));
        items.push(new Item({name: "God praying"}));
        items.push(new Item({name: "Frühstück essen"}));
        items.push(new Item({name: "Sport machen"}));
        Item.insertMany(items, (err)=>{
          if(err)
            console.log(err);
        });
        res.redirect("/");

      }else if(fetchedItems.length > 0){
          fetchedItems.forEach((item, i) => {
            items.push(item);
        });

        const s_date = date.getNowDate();

        console.log(items);
        res.render("list.ejs", { listTitle: s_date, listItems: items });

      }
    });
// });

});

app.get("/work", function(req, res) {
  res.render("list.ejs", {
    listTitle: "Work",
    listItems: itemsWork
  });
});

app.get("/about", function(req, res) {
  res.render("about.ejs");
});

app.post("/", (req, res) => {
  const s_item = req.body.txt_todo;

  if (req.body.btn_add.toLowerCase() === "work") {

      itemsWork.push(s_item);
      res.redirect("/work");

  } else {

      // items.push(new Item({name: s_item}));
      const item = new Item({name : s_item});
      item.save(function (err) {
        if (err) return console.error(err);
      });
      res.redirect("/");
  }

});

app.post("/del", function(req, res){
  const s_id = req.body.chk_item;
  console.log(s_id);

  //It seems that without providing the Callback func, nothing will be removed,
  //hence the callback func is required
  Item.findByIdAndRemove(s_id, function(err){
    if(err)
      console.log(err);
    else{
      res.redirect("/");
    }
  });
});




app.listen(n_port, function() {
  console.log("Server started: port " + n_port);
});
