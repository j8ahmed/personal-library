/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        console.log('successfully connected to the database to handle the GET requests.');
        db.collection('books').find().toArray((err, arr)=>{
          if(err) return console.log(err);
          res.send(arr);
        });
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(title != ''){
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          console.log('successfully connected to the database to handle the POST requests.');
          db.collection('books').insert({
            title: title,
            comments: [],
            commentcount: 0
          }, (err, cursor)=>{
            if(err) return console.log(err);
            console.log(cursor.ops[0]);
            res.json({
              _id: cursor.ops[0]._id,
              title: cursor.ops[0].title
            });
          });
          
        });
      }else{
        res.send('There is no book title provided.');
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        console.log('successfully connected to the Database to handle the DELETE request for all books in the collection.');
        db.collection('books').remove({}, (err, result)=>{
          if(err) return console.log(err);
          // console.log(result);
          res.send('complete delete successful');
        });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      //check if the :id matches the correct format
      if(bookid.length != 24 && !/[^a-f0-9]/i.test(bookid)|| bookid.length != 12){
        res.send('The book id must follow the correct format of a 24 character hexadecimal string or a 12 byte string (12 characters).');
      }else{
    
        //check if that :id exists for a book in the colleciton
        
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          console.log('successfully connected to the Database to handle the GET request for a specified book.');
          db.collection('books').findOne({_id: ObjectId(bookid)}, (err, result)=>{
            if(err) return console.log(err);
            // console.log(result);
            if(result){
              res.json({
                title: result.title,
                _id: result._id,
                comments: result.comments
              });
            }else res.send('This _id does not match any documents in the collection'); 
          });
        });
      }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      //check if the :id matches the correct format
      if(bookid.length != 24 || /[^a-z0-9]/.test(bookid)){
        res.send('The book id must follow the correct format of a 24 character hexadecimal string');
      }else{
    
        //check if that :id exists for a book in the colleciton
        
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          console.log('successfully connected to the Database to handle the POST request for add a Book comment.');
          db.collection('books').update({_id: ObjectId(bookid)},{$push: {comments: req.body.comment}, $inc: {commentcount: 1} }, (err, result)=>{
            if(err) return console.log(err);
            console.log(result);
            if(result){
              res.json({
                title: result.title,
                _id: result._id,
                comments: result.comments
              });
            }else res.send('This _id does not match any documents in the collection'); 
          });
        });
      }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    
      if(bookid.length != 24 || /[^a-z0-9]/.test(bookid)){
          res.send('The book id must follow the correct format of a 24 character hexadecimal string');
      }else{
        //if successful response will be 'delete successful'
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          console.log('successfully connected to the Database to handle the DELETE request for the book with a matching bookid.');
          db.collection('books').removeOne({_id: ObjectId(bookid)}, (err, result)=>{
            if(err) return console.log(err);
            // console.log(result);
            res.send('delete successful');
          });
        });
      }
    });
  
};
