var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('./mongodb');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var PORT = process.env.PORT || 8080;
var User = require('./user');
var q = require('q');

var currentChallenge;

userSessionAuthenticate = function (req, res, next) {
        UserSession.findOne({
            'sessionId': req.cookies.userSessionId
        }, function (err, userSession) {

            if (err !== null) {
                console.log('Error authenticating user: ' + err);
                next(err, null);
            } else {
                // Fetch the user based on the username stored in the session
                // mongobd collection, found by searching on the sessionId in
                // the cookie.
                if (userSession !== null) {
                    console.log('user session found');
                    User.findOne({
                        'username': userSession.username
                    }, function (err, user) {
                        if (err !== null) {
                            next(err, null);
                        }

                        req.user = user;
                        next(err, user);
                    });
                } else {
                    next('User session not found.', null);
                }
            }
        })
    },

    userSessionCreateCookie = function (req, res, next) {

        if (req.userSession !== undefined) {

            // Save cookie in user's browser.
            res.cookie('userSessionId', req.userSession.sessionId, {expires: new Date(Date.now() + 900000)}, {
                /*'path': '/',*/
                'secure': true
            });
            next();
        } else {
            next('Cannot create user session cookie: no user session found.');
        }
    },

    userSessionCreateDb = function (req, res, next) {

        if (req.user !== undefined) {

            var userSession = new UserSession({
                username: req.user.username
            });

            userSessionSaveToDb(userSession).then(function () {
                req.userSession = userSession;
                next();
            }, function (err) {
                console.log('Error creating user session in db: ' + err);
                next(err);
            });

        } else {
            next('Cannot create user session in db: no user found.');
        }
    },

    /**
     * Save session to database.
     *
     * @param {object} user - mongoose user object.
     * @return {object} - deferred promise.
     */
    userSessionSaveToDb = function (userSession) {

        var deferred = q.defer();

        userSession.save(function (err, userSessionMongoose) {
            if (err === undefined || err === null) {
                deferred.resolve(userSessionMongoose);
            } else {
                console.log('Error saving user session to db: ' + err);
                deferred.reject(err);
            }
        });

        return deferred.promise;
    },
    userSaveToDb = function (user) {

        var deferred = q.defer();

        user.save(function (err) {
            if (err === undefined || err === null) {
                deferred.resolve(user);
            } else {
                console.log('Error saving user to database: ' + err);
                deferred.reject(err);
            }
        });

        return deferred.promise;
    },
    userCreate = function (req, res, next) {
        console.log('Creating user...');
        console.log(req.body);
        var user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            points: 0,
            homeBase : {
            	latitude : req.body.latitude,
            	longitude : req.body.longitude
            }
        });

        userSaveToDb(user).then(function () {
            req.user = user;
            next();
        }, function (err) {
            console.log('Error saving user: ' + err);
            next(err);
        });
    },
    userLogIn = function (req, res, next) {

        User.findOne({
            'email': req.body.email
        }, function (err, user) {

            if (err !== null) {
                console.log('Error finding user: ' + err);
                res.status(401);
                next('User not found.');
            }

            if (user !== null) {
                // user.verifyPassword(req.body.password, function (err, isMatch) {

                //     // Password did not match, unset the user.
                //     if (isMatch === false) {
                //         console.log('Error with username or password (0): ' + err);
                //         res.status(401);
                //         next('Error Username or password incorrect. (0)');
                //     } else {
                //         req.user = user;
                //         next(err, user);
                //         console.log('User logged in');
                //     }
                // });
            } else {
                console.log('Error logging in (0): ' + err);
                console.log(user);
                res.status(401);
                next('Error logging in (2): ', user);
            }
        });
    };

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../public')).use(cookieParser());

app.get('/', function (req, res) {
	res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.post('/', userCreate, function (req, res) {
    console.log(req.body);
    res.status(200).send();
});

app.get('/user', userSessionAuthenticate, function (req, res) {
    res.json(req.user).send();
});

app.post('/session', userLogIn, userSessionCreateDb, userSessionCreateCookie, function (req, res) {
    var userObj = req.user;
    delete userObj.password;
    res.status(200).json(userObj).send();
});

app.delete('/session', function (req, res) {
    res.clearCookie('userSessionId', {
        'path': '/',
        'secure': true
    });
    res.clearCookie('connect.sid', {
        'path': '/',
        'secure': true
    });
    console.log('Deleting User');
    res.status(200).send();
});

//Currently gets all the locations data from db
app.get('/get-locations', function (req, res) {
	mongodb.getLocations(req, res);
});
//Gets the next time a satellite will be at a location
app.get('/get-next-time-at-location', function (req, res) {
	console.log(req);
	mongodb.getNextTimeAtLocation(req, res);
});
//Checks if bob is at the satellite location
app.get('/is-bob-at-location', function (req, res) {
	var satelliteLocation,
		bobsLocation = req.body.location;

	//Get satellite location
});
//Seems this endpoint is not necessary anymore
app.post('/current-challenge', function (req, res) {

});
//Gets the users points. Pass in the email as a param.
app.get('/user-points', function (req, res) {
	mongodb.getUserPoints(req, res);
});

app.post('user-change-in-points', function (req, res) {
	mongodb.changePoints(req, res);
});
app.get('/get-user-locations', function (req, res) {
	mongodb.getUserLocations(req, res);
});
app.post('/add-user-location', function (req, res) {
	mongodb.addUserLocation(req, res);
});
app.post('/here', function (req, res) {
	mongodb.here(req, res);
});
app.get('/get-challenges', function (req, res) {
	mongodb.getChallenges(req, res);
});
app.post('/add-home-base', function (req, res) {
	mongodb.addHomeBase(req, res);
});



//For testing. Not for demo purposes
app.post('/add-locations', function (req, res) {
	mongodb.addLocations(req, res);
});
app.get('/get-users', function (req, res) {
	mongodb.getUsers(req, res);
});

app.listen(PORT);
console.log('The magic happens on port ' + PORT);
