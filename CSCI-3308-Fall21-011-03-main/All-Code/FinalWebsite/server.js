/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
var cookie_parser=require('cookie-parser');
app.use(cookie_parser('1234'));
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'bufflist_db',
	user: 'postgres',
	password: 'pass'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

 Web Page Requests:

  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
m
************************************/

app.get('/login', function(req, res) {
	res.render('login',{
		page_title: 'Log In',
		css: 'resources/css/style.css',
		error: false,
		fail: false,
		newuser: false
	});
});

app.post('/login', function(req, res) {
	var login = req.body.loginUser;
	var pass = req.body.passUser;
	var query = "select userid, screenname from users where screenname='"+login+"' and pword='"+pass+"' union select userid, screenname from users where email='"+login+"' and pword='"+pass+"';";
	db.any(query)
	  .then(function (data) {
	  if (data.length > 0) {
		if (Object.keys(req.cookies).length > 0) {
			res.clearCookie('userid');
			res.clearCookie('screenname');
		}
		res.cookie('userid', data[0].userid, {expire: 3600000 + Date.now()}); //Should Last 1 Hour
		res.cookie('screenname', data[0].screenname, {expire: 3600000 + Date.now()}); 
		var query2 = 'select listings.listingid, listings.ltitle, pics.link, pics.alttext from listings inner join pics on listings.listingid = pics.listingid;';
			db.any(query2)
			.then(function (rows) {
				res.render('home',{
					page_title: 'Home',
					css:'resources/css/style.css',
					data: rows,
					error: false,
					screenname: req.cookies.screenname
				})
			})
			.catch(function (err) {
				console.log('error', err);
				res.render('home', {
					page_title: 'Home',
					css:'resources/css/style.css',
					data: '',
					error: true,
					screenname: req.cookies.screenname
				})
			})
	  }
	  else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: true,
			newuser: false
		});
	  }
      })
	  .catch(function (err) {
		  console.log('error', err);
		  res.render('home', {
			  page_title: 'Home',
			  data: '',
			  css: 'resources/css/style.css',
			  error: true,
			  items: '',
			  searchQuery: searchQuery
		  })
	  })
});

app.get('/', function(req, res) {
	if (Object.keys(req.cookies).length > 0) {
		var query = 'select listings.listingid, listings.ltitle, pics.link, pics.alttext from listings inner join pics on listings.listingid = pics.listingid order by listings.lpostedtime DESC;';
		db.any(query)
		.then(function (rows) {
			res.render('home',{
				page_title: 'Home',
				css:'resources/css/style.css',
				data: rows,
				error: false,
				screenname: req.cookies.screenname
			})

		})
		.catch(function (err) {
			console.log('error', err);
			res.render('home', {
				page_title: 'Home',
				css:'resources/css/style.css',
				data: '',
				error: true,
				screenname: req.cookies.screenname
			})
		})
	}
	else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: false,
			newuser: false
		});	
	}
});

app.get('/search', function(req, res) {
	if(Object.keys(req.cookies).length > 0) {
		var query = 'select listings.listingid, listings.ltitle, pics.link, pics.alttext from listings inner join pics on listings.listingid = pics.listingid order by listings.lpostedtime DESC;';
		db.any(query)
		.then(function (rows) {
			res.render('search',{
				page_title: 'Search',
				css: 'resources/css/style.css',
				error: false,
				items: rows,
				screenname: req.cookies.screenname,
				searchQuery: ''
			});
		})
	}
	else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: false,
			newuser: false
		});	
	}
});

app.post('/get_search', function(req, res) {
  var searchQuery = req.body.search;
  var query = "select listings.listingid, listings.ltitle, pics.link, pics.alttext from listings left join pics on listings.listingid = pics.listingid where upper(ltitle) like upper('%"+searchQuery+"%') union select listings.listingid, listings.ltitle, pics.link, pics.alttext from listings left join pics on listings.listingid = pics.listingid where upper(ldesc) like upper('%"+searchQuery+"%');";

  db.any(query)
	.then(function (rows) {
    res.render('search',{
  		page_title: 'Search',
  		css: 'resources/css/style.css',
      	items: rows,
  		error: false,
		searchQuery: searchQuery,
		screenname: req.cookies.screenname
  	});

	})
	.catch(function (err) {
		console.log('error', err);
		res.render('home', {
			page_title: 'Home',
            data: '',
			css: 'resources/css/style.css',
			error: true,
			items: '',
			searchQuery: searchQuery,
			screenname: req.cookies.screenname
		})
	})


});

app.get('/listings', function(req, res) {
	console.log(req.cookies);
	console.log(Object.keys(req.cookies).length);
	if(Object.keys(req.cookies).length > 0) {
		var id = req.query.id;
		var query = 'select listings.*, users.screenname, users.email, pics.link, pics.alttext from listings inner join users on listings.listedby = users.userid left join pics on listings.listingid = pics.listingid where listings.listingid='+id+';';
		db.any(query)
		.then(function (info) {
			res.render('listings',{
				page_title: 'Listings',
				css: 'resources/css/style.css',
				error: false,
				title: info[0].ltitle,
				desc: info[0].ldesc,
				postedat: info[0].lpostedtime,
				type: info[0].ltype,
				screennameLoc: info[0].screenname,
				email: info[0].email,
				lat: info[0].llat,
				lon: info[0].llon,
				price: info[0].lprice,
				screenname: req.cookies.screenname,
				picture: info[0].link
			})

		})
		.catch(function (err) {
			console.log('error', err);
			res.render('listings', {
				page_title: 'Listings',
				css: 'resources/css/style.css',
				error: true,
				title: '',
				desc: '',
				postedat: '',
				type: '',
				screennameLoc: '',
				email: '',
				lat: '',
				lon: '',
				price: '',
				screenname: req.cookies.screenname
			})
		})
	}
	else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: false,
			newuser: false
		});	
	}
});

app.get('/account_setting', function(req, res) {
	if(Object.keys(req.cookies).length > 0) {
		var user = req.cookies.userid;
		//var query = 'select listings.listingid, listings.listedby, listings.ltitle, pics.link, listings.llat, listings.llon, listings.ldesc, pics.alttext from listings inner join pics on listings.listingid = pics.listingid;';
		var query = 'select listings.listingid, listings.ldesc, listings.llon, listings.llat, listings.lprice, listings.ltitle, pics.link, pics.alttext from listings inner join pics on listings.listingid = pics.listingid where listings.listedby='+user+' order by listings.listedby DESC;';
		db.any(query)
		.then(function (rows) {
		console.log(rows);
		res.render('account_setting',{
			page_title: 'Account Settings',
			css: 'resources/css/style.css',
			items: rows,
			error: false,
			screenname: req.cookies.screenname
		});
		})
		.catch(function (err) {
		console.log('error', err);
			res.render('home', {
				page_title: 'Home',
				css:'resources/css/style.css',
				data: '',
				error: true,
				screenname: req.cookies.screenname
			})
		})
	}
	else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: false,
			newuser: false
		});	
	}
});

app.post('/account_setting/update_preferences' , function(req, res) {
	if(Object.keys(req.cookies).length > 0) {
		var email = req.body.changeEmail;
		var confirmPW = req.body.changePW;
		var newPW = req.body.newPW;
		var username = req.body.ChangeUser;
		var phone = req.body.changePhone;

		var userId = req.cookies.userid;
		var query = 'select listings.listingid, listings.ldesc, listings.llon, listings.llat, listings.lprice, listings.ltitle, pics.link, pics.alttext from listings inner join pics on listings.listingid = pics.listingid where listings.listedby='+userId+';';

		var insQuery = `UPDATE Users SET `;
		if(email){
			insQuery += `email = '${email}' `;
		}
		if(confirmPW && newPW){
			insQuery += `pword = '${newPW}' `;
		}
		if(username){
			insQuery += `screenName = '${username}' `;
		}
		if(phone){
			insQuery += `phoneNumber = '${phone}' `;
		}
		insQuery += `WHERE userId = ${userId};`;

		console.log(insQuery);
		
		db.task('get-everything', task => {
			return task.batch([
				task.any(query),
				task.any(insQuery)
			]);
		})
			.then(function (rows) {
			console.log(rows);
			res.render('account_setting',{
				page_title: 'Account Settings',
				css: 'resources/css/style.css',
				items: rows,
				error: false,
				screenname: req.cookies.screenname
			});
		})
		.catch(function (err) {
		console.log('error', err);
			res.render('home', {
				page_title: 'Home',
				css:'resources/css/style.css',
				data: '',
				error: true,
				screenname: req.cookies.screenname
			})
		})
	}
	else {
		res.render('login',{
			page_title: 'Log In',
			css: 'resources/css/style.css',
			error: false,
			fail: false,
			newuser: false
		});	
	}		
})



app.get('/signup', function(req, res) {
	res.render('signup',{
		page_title: 'Sign-up',
		error: false
	});
});

app.post('/signup/new_user', function(req, res) {
	var maxUIDStmt = "select max(UserId) from users;";
	db.any(maxUIDStmt)
	.then( function(maxUID) {
		var UserId = maxUID[0].max + 1;
		var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var fname = req.body.firstName;
		var midinit = req.body.middleInitial;
		var lname = req.body.lastName;
		var phone = req.body.phone;
		var email = req.body.UserEmail;
		var screenname = req.body.username;
		var pass = req.body.password;
		var insert_statement = "INSERT INTO Users(UserId, firstName, middleInitial, lastName, phoneNumber, screenName, email, pword, joinDate, blacklisted_user_ids, hide_name_location, show_listings) VALUES ('"+UserId+"', '"+fname+"', '"+midinit+"', '"+lname+"', '"+phone+"', '"+screenname+"', '"+email+"', '"+pass+"', '"+date+"', '', false, true);";
		db.any(insert_statement)
		.then( function (info){
			res.render('login',{
				page_title: 'Log In',
				css: 'resources/css/style.css',
				error: false,
				fail: false,
				newuser: true
			})
		})
		.catch(function (err) {
			console.log('error', err);
			res.render('home', {
				page_title: 'Home',
				data: '',
				css: 'resources/css/style.css',
				error: true,
				screenname: req.cookies.screenname
			})
		})
	})
	.catch(function (err) {
		console.log('error', err);
		res.render('signup', {
			page_title: 'Sign-up'
		})
	})
});

app.post('/', function(req, res) {
	var title = req.body.product;
	var type = req.body.type;
	var price = -1;
	if(type != "Selling") {
		price = -1;
	}
	else {
		price = req.body.price;
	}
	var desc = req.body.description;
	var lat = req.body.latitude;
	var lon = req.body.longitude;
	var imgs = [req.body.img1, req.body.img2, req.body.img3];
	var date = new Date().toISOString().slice(0, 19).replace('T', ' ')
	var userid = req.cookies.userid;
	var maxListingIDQuery = "select max(listingid) from listings;";
	var maxPictureIDQuery = "select max(picid) from pics;";
	var insListingsQuery = '';
	var insPicsQuery = '';
	var selectQuery = '';

	db.task('get-everything', task => {
        return task.batch([
            task.any(maxListingIDQuery),
            task.any(maxPictureIDQuery)
        ]);
    })
	.then(maxes => {
		var maxLID = maxes[0][0].max + 1;
		var maxPID = maxes[1][0].max + 1;
		insListingsQuery = "INSERT INTO Listings(ListingID, LType, ListedBy, LPostedTime, LTitle, LDesc, LPrice, LLat, LLon, LStatus) VALUES ("+maxLID+", '"+type+"', "+userid+", '"+date+"', '"+title+"', '"+desc+"', "+price+", "+lat+", "+lon+", FALSE);";
		insPicsQuery = "INSERT INTO Pics(PicID, ListingID, link, altText) VALUES ";
		for(let i = 0; i < imgs.length; i++) {
			if (imgs[i] != "") {
				insPicsQuery += "("+maxPID+", "+maxLID+", '"+imgs[i]+"', 'todo'), ";
				maxPID++;
			}
		}
		insPicsQuery = insPicsQuery.substring(0, insPicsQuery.length - 2) + ";";
		selectQuery = 'select listings.*, users.screenname, users.email from listings inner join users on listings.listedby = users.userid where listings.listingid='+maxLID+';';
		db.task('get-everything', task => {
			return task.batch([
				task.any(insListingsQuery),
				task.any(insPicsQuery)
			]);
		})
		.then(info => {
			db.any(selectQuery)
			.then( function(result) {
				res.render('listings',{
					page_title: result[0].ltitle,
					css:'resources/css/style.css',
					title: result[0].ltitle,
					desc: result[0].ldesc,
					postedat: result[0].lpostedtime,
					type: result[0].ltype,
					screennameLoc: result[0].screenname,
					email: result[0].email,
					lat: result[0].llat,
					lon: result[0].llon,
					price: result[0].lprice,
					screenname: req.cookies.screenname,
					picture: req.body.img1
				})
			})
			.catch( function(error) {
				console.log('error', err);
				res.render('home', {
					page_title: 'Home',
					css:'resources/css/style.css',
					data: '',
					error: true,
					screenname: req.cookies.screenname
				})
			})
		})
		.catch(err => {
			console.log('error', err);
			res.render('home', {
				page_title: 'Home',
				css:'resources/css/style.css',
				data: '',
				error: true,
				screenname: req.cookies.screenname
			})
		})
	})
	.catch(err => {
		console.log('error', err);
		res.render('home', {
			page_title: 'Home',
			css:'resources/css/style.css',
            data: '',
			error: true,
			screenname: req.cookies.screenname
		})
	})
});

app.listen(3000);
console.log('3000 is the magic port');
