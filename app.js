const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

const n_port = 3000;
let routName = "";

let items = [];

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  }
});
const listSchema = new mongoose.Schema({
  listName: {
    type: String,
    require: true,
  },
  listItems: [itemSchema],
});
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

// mongoose.connect("mongodb://localhost:27017/todolistDB", {
mongoose.connect("mongodb+srv://khaledr:Miki@12345@cluster0.x9mim.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("static"));

app.get("/", function(req, res) {
  // expected output: Donnerstag, 20. Dezember 2012
  items = [];
  routName = "";
  // db.once('open', function() {
  // using callback
  Item.find({}, function(err, fetchedItems) {
    // console.log(fetchedItems.length);
    if (fetchedItems.length === 0) {
      items.push(new Item({ name: "Morgen aufstehen" }));
      items.push(new Item({ name: "God praying" }));
      items.push(new Item({ name: "Frühstück essen" }));
      items.push(new Item({ name: "Sport machen" }));
      Item.insertMany(items, (err) => {
        if (err)
          console.log(err);
      });
      res.redirect("/");

    } else if (fetchedItems.length > 0) {
      fetchedItems.forEach((item, i) => {
        items.push(item);
      });

      const s_date = date.getNowDate();

      // console.log(items);
      res.render("list.ejs", {
        listTitle: s_date,
        listItemsToDisplay: items
      });

    }
  });
  // });

});

app.get("/:listname", function(req, res) {
  // console.log(req.params.listname);
  routName = req.params.listname;

  //const customListItems = List.findOne()
  // using callback
  List.findOne({ listName: routName }, function(err, listFound) {
    if (!err) {
      if (listFound) {
        items = listFound.listItems;

        res.render("list.ejs", { listTitle: routName, listItemsToDisplay: items });

      } else if (!listFound) { // inserting new list document
        items = [];
        const list = new List({ listName: routName, listItems: items });
        list.save();

        res.render("list.ejs", { listTitle: routName, listItemsToDisplay: items });
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about.ejs");
});

app.post("/", (req, res) => {
  const s_item = req.body.txt_todo;

  if (routName === "") { //working with main list

    const item = new Item({ name: s_item });
    item.save(function(err) {
      if (err) return console.error(err);
    });
    res.redirect("/");

  } else if (routName !== "") { //working with custom list
    items.push(new Item({ name: s_item }));
    // const result = List.updateOne({ listName: routName }, { listItems: [items] });
    List.updateOne({listName:routName}, {listItems:items}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        // console.log("listname="+routName + "   items="+items + ">>>mached"+docs);
    }
    });
    // res.n; // Number of documents matched
    // res.nModified; // Number of documents modified

    res.redirect("/" + routName);
  }
});

app.post("/del", function(req, res) {
  const s_id = req.body.chk_item;
  const s_index = req.body.hdn_index;

  if(routName === ""){
    //It seems that without providing the Callback func, nothing will be removed,
    //hence the callback func is required
    Item.findByIdAndRemove(s_id, function(err) {
      if (err)
        console.log(err);
      else {
        res.redirect("/");
      }
    });

  }else if(routName !== ""){
    items.splice(s_index, 1);
    // List.findOneAndUpdate({listName : routName}, {listItems: items});
    // List.findOneAndUpdate({listName : routName}, { $set: { listItems: items }}, null, function(err){
    //     if(err)
    //       console.log(err);
    // });
    List.findOneAndUpdate({listName : routName}, { $pull: { listItems: {_id : s_id} }}, function(err, result){
      if(!err)
        res.redirect("/" + routName);
    });
  }
});




app.listen(n_port, function() {
  console.log("Server started: port " + n_port);
});
