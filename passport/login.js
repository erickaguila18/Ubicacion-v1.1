var LocalStrategy   = require('passport-local').Strategy;
var User = require('../modelos/usuarios');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({ 'email' :  username }, 
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                        return done(null, false, req.flash('message', 'Correo no registrado'));                 
                    }
                    if (!isValidPassword(user, password)){
                        return done(null, false, req.flash('message', 'La contraseña no coincide')); // redirect back to login page
                    }
                    var usuario = user;
                    usuario.latitude = req.body.latitude;
                    usuario.longitude = req.body.longitude;
                    usuario.save(function(error, user){
                        if(error){
                            console.log("Error");
                        }else{  
                           console.log("Coordenadas modificadas");
                        }
            });

                    return done(null, user);
                }
            );
        })
    );

    var isValidPassword = function(user, password){
        //return bCrypt.compareSync(password, user.password);
       if(password==user.password){
        return true;
       } 
       return false;
    }   
}