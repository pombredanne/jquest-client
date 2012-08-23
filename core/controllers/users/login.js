/**
 * @author Pirhoo
 * @description Login route
 *
 */
module.exports = function(app, sequelize) {

	/*
	 * GET user login page.
	 */
	app.get('/users/login', loginPage);

	/*
	 * POST user login page.
	 */
	app.post('/users/login', loginPage);

};


function loginPage (req, res) {

	// Disabled page
	return res.redirect("/users/twitter-connect");	

	if( req.param('email', false) )
		loadUser(req, res, loginForm);
	else
		loginForm(req, res);
}


function loginForm(req, res){

	// Redirects logged users
	if(req.session.currentUser) return res.redirect("/");	

	var params = { 
		title: 'jQuest',
		email: req.param('email', false), 
		path:"/" 
	};

	res.render('users/login.jade', params);
}


function loadUser(req, res, callback) {

	//error handling omitted
	var query = sequelize.query("SELECT * FROM jquest_user WHERE ( email=$1 OR username=$1 ) AND password=crypt($2, password)", [ req.param('email'), req.param('password') ] );
	
	// for each row
	query.on("row", function(row, result) {
		result.rows.push(row);
	});

	// when we reach the end of the fetching
	query.on("end", function(result) {

		// register the user
		if(result.rows.length > 0) req.session.currentUser = result.rows[0];

	 	if(typeof callback === "function") callback(req, res);
	});

	// error appends
	query.on("error", function(error) {
		if(typeof callback === "function") callback(req, res);
	});

}