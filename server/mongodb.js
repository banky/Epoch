(function () {
	'use strict';

	var mongodb = require('mongodb'),
		mongoose = require('mongoose'),

		db = mongoose.connection,

		http = require('http'),
		https = require('https'),
		Locations = require('./locations'),
		User = require('./user'),
		config = require('./config'),
		apiKey = config.apiKey,
		apiSecret = config.apiSecret,
		inside = require('point-in-polygon'),
		request = require('request'),
		waterfall = require('async-waterfall'),

		cnTowerAOID = 'AU_nfvr5tVbz6yKH6FGa',
		algonquinParkAOID = 'AU_nge1Aae0DkMKpFMvJ',
		scarboroughBluffsAOID = 'AU_ngvnCae0DkMKpFMvL',
		eloraGorgeAOID = 'AU_ng_hAae0DkMKpFMvM',
		kawarthaHighlandsAOID = 'AU_nhVUu5L4R4rmumoLd',
		niagaraFallsAOID = 'AU_nhnRntVbz6yKH6FGd',
		gtaAOID = 'AU_pMaRUGPejrq3tvGr4',
		neUSAAOID = 'AU_pO8aY5HTUQ1kxV-eV',
		hackTheNorthAOID = 'AU_pQrKNtVbz6yKH6Psj',
		arrayOfAoIDs = [cnTowerAOID, algonquinParkAOID, scarboroughBluffsAOID, eloraGorgeAOID, kawarthaHighlandsAOID, niagaraFallsAOID, gtaAOID, neUSAAOID, hackTheNorthAOID],
		arrayOfChallengeNames = ["CN Tower", "Algonquin Park", "Scarborough Bluffs", "Elor Gorge", "Kawartha Highlands", 
								"Niagara Falls", "GTA", "North East USA", "Hack The North"];
	db.on('error', console.error);

	db.once('open', function () {
		exports.getLocations = function(req, res) {
			Locations.find(function (err, locations) {
				if (err) {
					console.log('Error in get locations: ' + err);
					res.status(400).send();
				}
				res.json(locations).status(200);				
			}); 
		};

		//Commented out the if statement because we are not yet getting any actual locations
		exports.getNextTimeAtLocation = function(req, res) {
				var longitude = req.query.longitude;
				var latitude = req.query.latitude;
				var url = 'https://api.urthecast.com/v1/satellite_tracker/sensor_platforms/iris/forecasts?geometry_intersects=POINT(' + longitude + 
					'%20' + latitude + ')&api_key=' + apiKey + '&api_secret=' + apiSecret;
				console.log('url: ' + url);

				request.get(url, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var jsonBody = JSON.parse(body);
						res.json(jsonBody.payload).status(200);
					} else {
						console.log('An error occured: ' + error);
					}
					callback(null, polygon, req);
				});
		};

		//Not for demo purposes
		exports.addLocations = function(req,res) {
			Locations.find(function(err,locations){
				if(err){
					console.log('Error finding locations in addLocations:' + err);
					res.status(400).send();
				} else{
					var location = {
						latitude : req.body.latitude,
						longitude : req.body.longitude,
						radius : req.body.radius
					}
					locations.push(location);
					// locations.(function (err,user) {
					// 	if(err){
					// 		console.log('An error occured while adding the new location:' + err);
					// 	} else{
					// 		res.status(200);
					// 	}
					// });
				}
			});
		};

		exports.getUserPoints = function(req, res) {
			//Cannot test until we have functional login.
			User.findOne({'email': req.query.email}, function (err, user) {
				if (err) {
					console.log('Error finding user in getUserPoints: ' + err);
					res.status(400).send
				} else {
					console.log('Getting user points');
					res.json(user.points).status(200);
				}
			});
		};

		exports.changePoints = function (req, res) {
			//Cannot test until we have a functional login
			User.findOne({'email': req.query.email}, function (err, user) {
				if (err) {
					console.log('Error finding user in changePoints: ' + err);
				} else {
					user.points = user.points + req.body.changeInPoints;
					user.save (function (err, user) {
						if (err) {
							console.log('Error saving user in changePoints: ' + err);
							res.status(400).send();
						} else {
							console.log('Points changed successfully');
							res.status(200).send();
						}
					});
				}
			});
		};

		exports.getUserLocations = function (req, res) {
			User.findOne({'email': req.query.email}, function (err, user) {
				if (err) {
					console.log('Error in finding user in getUserLocations: ' + err);
				} else {
					res.json(user.locations).status(200);
					res.send();
				}
			});
		};

		exports.addUserLocation = function (req, res) {
			User.findOne({'email': req.query.email}, function (err, user) {
				if(err) {
					console.log('Error in finding user in addUserLocation: ' + err);
				} else {
					user.locations.push(req.body.location);
					user.save(function (err, req) {
						if (err) {
							console.log('An error occured while saving the userLocation: ' + err);
						} else {
							res.status(200);
						}
					});
				}
			});
		};

		exports.here = function (req, res) {
			//var userLocation = req.body.location;
			if (req.body.challenge === "CN Tower") {
				getPolygon(cnTowerAOID, req);
			} else if (req.body.challenge === "Algonquin Park") {
				getPolygon(algonquinParkAOID, req);
			} else if (req.body.challenge === "Scarborough bluffs") {
				getPolygon(scarboroughBluffsAOID, req);
			} else if (req.body.challenge === "Elora Gorge") {
				getPolygon(eloraGorgeAOID, req);
			} else if (req.body.challenge === "Kawartha Highlands") {
				getPolygon(kawarthaHighlandsAOID, req);
			} else if (req.body.challenge === "Niagara Falls") {
				getPolygon(niagaraFallsAOID, req);
			} else if (req.body.challenge === "Hack the North") {
				getPolygon(hackTheNorthAOID, req);
			} else if (req.body.challenge === "GTA") {
				getPolygon(gtaAOID, req);
			} else if (req.body.challenge === "NEUSA") {
				getPolygon(neUSAAOID, req);
			} else {
				console.log('Challenge not found. Check in exports.here or your string');
			}
			
		};

		var getPolygon = function (aoid, req) {
			var polygon = [];
			var url = "https://api.urthecast.com/v1/consumers/apps/me/aois/" + aoid + "?api_key=" + apiKey + 
				"&api_secret=" + apiSecret;

			waterfall([
				function (callback) {
					request.get(url, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							var jsonBody = JSON.parse(body);
							polygon = jsonBody.payload[0].geometry.coordinates[0];
						} else {
							console.log('An error occured: ' + error);
						}
						callback(null, polygon, req);
					});
				}, 
				function (polygon, req, callback) {
					var homeBase;
					User.findOne({'email': req.query.email}, function (err, user) {
						if (err) {
							console.log('Error getting user in waterfall: ' + err);
						} else {
							homeBase = user.homeBase;
						}
					});
					if (inside([req.body.location.longitude, req.body.location.latitude], polygon)) {
						var averageLon = 0,
							averageLat = 0,
							polygonLength = polygon.length,
							radius = 0;
						for (var i = 0; i < polygonLength; i++) {
							averageLon += polygon[i][0];
							averageLat += polygon[i][1];
						};
						averageLon /= polygonLength;
						averageLat /= polygonLength;

						for (var i = 0; i < polygonLength; i++) {
							radius += Math.sqrt((Math.abs(polygon[i][0] - averageLon))*(Math.abs(polygon[i][0] - averageLon)) + 
								(Math.abs(polygon[i][1] - averageLat))*(Math.abs(polygon[i][1] - averageLat)));
						}
						radius /= polygonLength;

						res.status(200).send;
					} else {
						res.send(401);
					}
					
				}
			]);
		};

		exports.getChallenges = function (req, res) {
			var points = 50,
				homeBase,
				polygon = [],
				urls = [],
				challenges = [];

			for (var i = 0; i < arrayOfAoIDs.length; i++) {
				urls.push("https://api.urthecast.com/v1/consumers/apps/me/aois/" + arrayOfAoIDs[i] + "?api_key=" + apiKey + 
				"&api_secret=" + apiSecret);
			}

			waterfall ([
				function (callbackOuter) {
					for (var i = 0; i < arrayOfAoIDs.length; i++) {

						(function (i) {
							var title = arrayOfChallengeNames[i];
							var url = "https://api.urthecast.com/v1/consumers/apps/me/aois/" + arrayOfAoIDs[i] + "?api_key=" + apiKey + 
							"&api_secret=" + apiSecret;
							waterfall([
								function (callback) {
									request.get(urls[i], function (error, response, body) {
										if (!error && response.statusCode == 200) {
											var jsonBody = JSON.parse(body);
											polygon = jsonBody.payload[0].geometry.coordinates[0];
											console.log(polygon);
										} else {
											console.log('crap An error occured: ' + error);
										}
										callback(null, polygon, req);
									});
								}, function (polygon, req, callback) {
									
									User.findOne({'email': req.query.email}, function (err, user) {
										if (err) {
											console.log('An error occured getting user in getChallenges: ' + err);
										} else {
											var averageLon = 0,
												averageLat = 0,
												polygonLength = polygon.length,
												radius = 0;
											for (var j = 0; j < polygonLength; j++) {
												averageLon += polygon[j][0];
												averageLat += polygon[j][1];
											};
											averageLon /= polygonLength;
											averageLat /= polygonLength;
											homeBase = user.homeBase;

											if (!inside([homeBase.longitude, homeBase.latitude], polygon)) {
												for (var j = 0; j < polygonLength; j++) {
													radius += Math.sqrt((Math.abs(polygon[j][0] - averageLon))*(Math.abs(polygon[j][0] - averageLon)) + 
														(Math.abs(polygon[j][1] - averageLat))*(Math.abs(polygon[j][1] - averageLat)));
												}
												radius /= polygonLength;

												var distance,
													longitudeDistance,
													latitudeDistance;
												longitudeDistance = Math.abs(homeBase.longitude - averageLon) - radius;
												latitudeDistance = Math.abs(homeBase.latitude - averageLat) - radius;

												//Lets convert stuff to KM
												longitudeDistance = 111.320 * Math.cos(latitudeDistance);
												latitudeDistance = latitudeDistance * 110.574;

												distance = Math.sqrt(longitudeDistance * longitudeDistance + latitudeDistance * latitudeDistance);

												points += distance*50/10;
												points = Math.round(points);
												
												currentLongitude = averageLon;
												currentLatitude = averageLat;

												var challenge = {
													"title" : title,
													"points" : points,
													"latitude" : averageLat, 
													"longitude" : averageLon
												}
												challenges.push(challenge);
												callback();
											} else {
												console.log('inside home base');
												var challenge = {
													"title" : title,
													"points" : points,
													"latitude" : averageLat,
													"longitude" : averageLon
												}
												challenges.push(challenge);
												callback();
											}
										}
									});
								}, function () {
									if (challenges.length == arrayOfAoIDs.length) {
										callbackOuter();
									}
								}

							]);	
						})(i);

					}
				}, function () {
					console.log('sending json');
					res.json(challenges).status(200);
				}

			]);
			
		};

		exports.addHomeBase = function (req, res) {
			console.log(req.query.email);
			User.findOne({'email': req.query.email}, function (err, user) {
				if (err) {
					console.log('An error occured finding user in addHoeBase: ' + err);
				} else {
					console.log(req.body.homeBase);
					user.homeBase = req.body.homeBase;
					user.save (function (err, user) {
						if (err) {
							console.log('Error saving user in addHomeBase: ' + err);
							res.status(400).send();
						} else {
							console.log('Home base added successfully');
							res.status(200).send();
						}
					});
				}
			});
		};

		exports.getUsers = function (req, res) {
			User.find(function (err, user) {
				if (err) {
					console.log('An error occured finding user in addHoeBase: ' + err);
				} else {
					console.log(user);
				}
			})
		};
	});

	mongoose.connect('mongodb://heroku_90jwgmq9:nt2u3qf5v93tu4picrikhiqajj@ds051553.mongolab.com:51553/heroku_90jwgmq9');


}());
