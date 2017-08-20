var mongoose=require('mongoose');

var bookSchema=mongoose.Schema({

title:{
type:String,
required: true
},
genre:{
type:String,
required: true
},
description:{
type:String,
},
author:{
type:String,
required: true
},
publisher:{
type:String,
},
pages:{
type:String,
},
image_url:{
type:String,
},
buy_url:{
type:String,
},
create_date:{
type:Date,
default:Date.now
},
publication_year:{
type:String,
},
wholeselller:{
type:String,
},
comments:[String]



});

var Book=module.exports = mongoose.model('Book',bookSchema);

//get books
module.exports.getBooks=function(callback,limit){
Book.find(callback).limit(limit);
};

//get books - Limit
module.exports.getBooksLimit=function(limit,callback){
Book.find(callback).limit(limit);
};

//get book
module.exports.getBookById=function(id,callback){
Book.findById(id,callback);
};

//add Book
module.exports.addBook=function(book,callback){
Book.create(book,callback);
};

//update book
module.exports.updateBook=function(id,book,options,callback){
var query={_id:id};
var update={
title:book.title,
genre:book.genre,
description:book.description,
author:book.author,
publisher:book.publisher,
pages:book.pages,
image_url:book.image_url,
buy_url:book.buy_url
}
Book.findOneAndUpdate(query,update,options,callback);
};

//delete book
module.exports.deleteBook=function(id,callback){
var query={_id:id};
Book.remove(query,callback);
};


//patch Book
module.exports.patchBook=function(id,updateObject,callback){
var query={_id:id};
Book.update(query,{$set: updateObject},{ upsert: true },callback);
};


//patch Book using opcode & path
module.exports.patchOpcodeBook=function(id,id2,updateObject,callback){
var query={_id:id};

if(updateObject.op=="add")
{
console.log("In addiditon");
let set = {};
set[updateObject.path] = updateObject.value;
Book.update(query,{$push : set},{ upsert: true },callback);
}
if(updateObject.op=="replace")
{
let set = {};
set[updateObject.path] = updateObject.value;
Book.update(query,{$set : set},{ upsert: true },callback);
}
if(updateObject.op=="remove")
{
let set = {};
set[updateObject.path] = "";
Book.update(query,{$unset : set},{ upsert: true },callback);
}
if(updateObject.op=="copy")
{
//if keys are same it serves as copy that is copying of data from one field to another within same document
//if keys are different it serves as move that is copying of data from one field to another across documents
console.log("I was called");
var obj = Book.findOne({_id:id2},{_id:0});
var from=updateObject.from;
var val= new Array;
val=obj.from;

let set = {};
set[updateObject.path] = val;
Book.update(query,{$set : set},{ upsert: true },callback);
}

if(updateObject.op=="test")
{
var obj = Book.findOne({_id:id},{_id:0});
var path=updateObject.path;
var val= new Array;
val=obj.path;

var expected_val=updateObject.value;
if(val==expected_val)
console.log("Test was successful");
else
console.log("Test was unsuccessful");

}

};





