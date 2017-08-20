var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');

var RateLimit = require('express-rate-limit');
app.enable('trust proxy');
var apiLimiter = new RateLimit({
    windowMs: 2 * 60 * 1000, // 1 minutes
    max: 5, //5 requests per minute for any IP
    delayMs: 500, // disabled
    message: "Sorry, the maximum limit of 5 API calls per minute has been reached. Please try after some time!",
    statusCode: 429,
    headers: true,
    handler: function(req, res) {
        if (apiLimiter.headers) {
            res.setHeader('X-RateLimit-Limit', apiLimiter.max);
            res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);
        }
        res.format({
            json: function() {
                res.json("Sorry, the maximum limit of 5 API calls per minute has been reached. Please try after some time!");
            }
        });
    }

});

app.use('/api/', apiLimiter);


app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

Genre = require('./models/genres');
Book = require('./models/books');

mongoose.connect('mongodb://localhost/bookstore', {
    useMongoClient: true
});
var db = mongoose.connection;

//getting token
app.get('/token', function(req, res) {
    var token = jwt.sign({
        username: "booklibrary"
    }, 'supersecret', {
        expiresIn: 60 * 60
    });
    res.send(token);
});

//invalid access
app.get('/', function(req, res) {
    res.send('Please use /api/books or /api/genres');
});

//getting options
app.get('/options', function(req, res) {
    res.send('<html>"In each of the following requests please provide correct token to authenticate yourself : /api/...../token_id" <br> "Allow: GET,POST,PUT,DELETE,PATCH" <br><br><br>"/":"Invalid Access	",<br>"/api/genres":"To get all Genres	[GET]",<br>"/api/books":"To get all Books	[GET]",<br>"/api/books":"To add Books	[POST]",<br>"/api/books/[limit]":"To limit the number of books returned	[GET]"<br>"/api/books/[book_id]":"To get a specific book	[GET]",<br>"/api/genres/[genre_id]":"To get a specific genre	[GET]",<br>"/api/genres":"To add genres to database	[POST]",<br>"/api/genres/[genre_id]":"To update a genre		[PUT]",<br>"/api/books/[book_id]":"To update a book		[PUT]",<br>"/api/genres/[genre_id]":"To delete a genre	[DELETE]",<br>"/api/books":"To get all the books	[GET]",<br>"/api/books/[book_id]":"To get a specific book	[GET]",<br>"/api/books/[book_id]":"To delete a book	[DELETE]",<br>"/api/books/patch/[book_id]":"To update a specific field [PATCH]",<br>"/api/books/patchOpcode/[book_id]":"To perform operations like add,replace,remove,test [PATCH]",<br>"/api/books/patchOpcode/[book_id1]/[[book_id2]":"To perform operations like copy,move [PATCH]"');
});


//get genres
app.get('/api/genres/:token', function(req, res) {

    var token = req.params.token;

    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {

            Genre.getGenres(function(err, genres) {
                if (err) {
                    throw err;
                }
                res.json(genres);

            });

        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});

//get books
app.get('/api/books/:token', function(req, res) {

    var token = req.params.token;

    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            Book.getBooks(function(err, books) {
                if (err) {
                    throw err;
                }
                res.json(books);

            });
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });


});

//get books Limit
app.get('/api/books/:limit/:token', function(req, res) {

    var token = req.params.token;


    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var limit = parseInt(req.params.limit);
            Book.getBooksLimit(limit, function(err, books) {
                if (err) {
                    throw err;
                }
                res.json(books);

            });
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });


});


//get book
app.get('/api/books/:_id/:token', function(req, res) {


    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Book.getBookById(req.params._id, function(err, book) {
                    if (err) {
                        throw err;
                    }
                    res.json(book);
                });
            } else {
                res.json("Invalid Request : Malicious Request Detected");
            }
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });


});


//post genres
app.post('/api/genres/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var genre = req.body;
            Genre.addGenre(genre, function(err, genre) {
                if (err) {
                    throw err;
                }
                res.json(genre);

            });
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});

//update genre
app.put('/api/genres/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var id = req.params._id;
            var genre = req.body;
            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {

                Genre.updateGenre(id, genre, {}, function(err, genre) {
                    if (err) {
                        throw err;
                    }
                    res.json(genre);
                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });


});

//delete genre
app.delete('/api/genres/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var id = req.params._id;
            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Genre.deleteGenre(id, function(err, genre) {
                    if (err) {
                        throw err;
                    }
                    res.json(genre);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });



});

//get books
app.post('/api/books/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var book = req.body;
            Book.addBook(book, function(err, genre) {
                if (err) {
                    throw err;
                }
                res.json(book);

            });
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });



});


//patch book using Opcode & Path
app.put('/api/books/patchOpcode/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                var updateObject = req.body;
                var id = req.params._id;
                Book.patchOpcodeBook(id, "", updateObject, function(err, book) {
                    if (err) {
                        throw err;
                    }
                    res.json(book);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});


//patch book copy,move
app.put('/api/books/patchOpcode/:_idone/:_idtwo/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var updateObject = req.body;
            var id = req.params._idone;
            var id2 = req.params._idtwo;
            var f = 0;
            for (var i = 0; i < req.params._idone.length; i++) {
                var char1 = req.params._idone.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }
            for (var i = 0; i < req.params._idtwo.length; i++) {
                var char1 = req.params._idtwo.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Book.patchOpcodeBook(id, id2, updateObject, function(err, book) {
                    if (err) {
                        throw err;
                    }

                    res.json(book);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});


//patch book
app.put('/api/books/patch/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var updateObject = req.body;
            var id = req.params._id;

            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Book.patchBook(id, updateObject, function(err, book) {
                    if (err) {
                        throw err;
                    }
                    res.json(book);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});


//put book
app.put('/api/books/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var id = req.params._id;
            var book = req.body;

            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Book.updateBook(id, book, {}, function(err, book) {
                    if (err) {
                        throw err;
                    }
                    res.json(book);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");
        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });


});

//delete book
app.delete('/api/books/:_id/:token', function(req, res) {

    var token = req.params.token;
    jwt.verify(token, 'supersecret', function(err, decoded) {
        if (!err) {
            var id = req.params._id;
            var f = 0;
            for (var i = 0; i < req.params._id.length; i++) {
                var char1 = req.params._id.charAt(i);
                var cc = char1.charCodeAt(0);

                if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123))) {
                    f = 1;
                    break;
                }

            }

            if (f != 1) {
                Book.deleteBook(id, function(err, book) {
                    if (err) {
                        throw err;
                    }
                    res.json(book);

                });
            } else
                res.json("Invalid Request : Malicious Request Detected");

        } else {
            res.send("Invalid Request : Authentication Failed");
        }
    });

});



app.listen(3000);
console.log('Running on port 3000');