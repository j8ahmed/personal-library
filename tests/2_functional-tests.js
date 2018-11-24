/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Pride & Prejudice'})
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'An object should be returned');
            assert.property(res.body.title);
            assert.property(res.body._id);
            assert.equal(res.body.title, 'Pride & Prejudice');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send()
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body, 'There is no book title provided.');
            done();
          });
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title', 'the first object in the array should have a title property');
            assert.property(res.body[0], '_id', 'the first object in the array should have a _id property');
            assert.property(res.body[0], 'commentcount'); 
            done();
          });
      
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/5bf7de12f16ebc48f0du4l0g')
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body, 'The book id must follow the correct format of a 24 character hexadecimal string or a 12 byte string (12 characters).');
            done();
          });
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/5bf7de12f16ebc48f042d789')
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, '5bf7de12f16ebc48f042d789');
            assert.property(res.body, 'comments');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/5bf7de12f16ebc48f042d789')
          .send({_id: '5bf7de12f16ebc48f042d789', comment: 'This book is amazing'})
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.property(res.body, '_id');
            done();
          });
  
      });
      
    });

  });

});
