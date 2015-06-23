var express = require('express');
var router = express.Router();
var Usuario = require('../modelos/usuarios');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){

	router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	router.get('/signup', function(req, res){
		res.render('new',{message: req.flash('message')});
	});
	
	

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true  
	}));


	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('chat', { user: req.user });
	});
	/*
	router.get('/map', isAuthenticated, function(req, res){
		res.render('mapa', { user: req.user });
	});
	*/
	router.get('/ubicacion',isAuthenticated, function(req,res){
    Usuario.find({}, function(error, usuarios){
        if(error){
            res.send('Ha surgido un error.');
        }else{
            res.render('ubicacion', {
                usuarios: usuarios
            });
           // res.render('chat', { user: req.user });
        }
    })
	});

	router.get('/map/:id', function(req, res){
    Usuario.findById(req.params.id, function(error, documento){
        if(error){
            res.send('Error al intentar ver el usuario.');
        }else{
            res.render('mapa', {
                usuario: documento
            });
        }
    });
	});



	
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





