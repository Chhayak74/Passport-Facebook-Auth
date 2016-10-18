 var FacebookStrategy = require('passport-facebook').Strategy;
require('../app/models/Users.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('User')

var configAuth = require('./auth');


module.exports= function(passport){

	passport.serializeUser(function(user , done){
		done(null , user.id);
	});

	passport.deserializeUser(function( id, done){
		userModel.findOne({"_id":id},function(err, user){
			done(err, user);
		});
	});


	passport.use( new FacebookStrategy({
		clientID     : configAuth.facebookAuth.clientID , 
        clientSecret  : configAuth.facebookAuth.clientSecret, 
        callbackURL   : configAuth.facebookAuth.callbackURL,
        profileFields : ['email']

	},function(accessToken, refreshToken ,profile, done){
		process.nextTick(function(){

			userModel.findOne({'facebook.id':profile.id}, function(err , user){
				if(err){
					return done(err);
				}
				if(user){
					//console.log(user);
					//console.log(profile)
					console.log(profile.emails[0].value)
					return done(null , user);
				}else{
					var newUser = new userModel();
                    console.log(profile)
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;
					console.log(profile.emails[0].value)
					//newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null , newUser);
					});
				}
			});

		})


	}));




}