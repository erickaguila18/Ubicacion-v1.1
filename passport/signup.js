var LocalStrategy   = require('passport-local').Strategy;
var User = require('../modelos/usuarios');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err){
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('message','El usuario ya existe'));
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                       // newUser.password = createHash(password);
                        newUser.password = password;
                        newUser.email = req.param('email');
                        newUser.latitude = req.param('latitude');
                        newUser.longitude = req.param('longitude');
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser, req.flash('message','El usuario fue creado'));
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}