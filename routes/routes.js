var express = require("express"),
    router = express.Router(),
    firebase = require("firebase");


/* Get home page*/
router.get("/", function(req, res){

	if(req.signedCookies.user){
		res.redirect(302, "/dashboard");
	}
	else{
		res.render("home/index");
	}
});

router.post("/signUp", function(req, res, next){

	var regex1 = /^[\w\-_]+@[\w-]+(\.\w{2,3})+$/,
	    regex2 = /^\w{8,}$/,
	    email = req.body.email,
	    password1 = req.body.password1,
	    password2 = req.body.password2;

	if(email.length === 0 || password1.length === 0 || password2.length === 0){
		 res.flash("info", "Invalid logins");
		 res.redirect(302, "/");
	}
	else if(password1 != password2){
		res.flash("info", "Password must match");
		res.redirect(302, "/");
	}
	else if(!regex1.test(email) || !regex2.test(password1)){
		res.flash("info","Inavalid password or email");
		res.redirect(302, "/");
	}
	else
	{

	    firebase.auth().createUserWithEmailAndPassword(email, password1)
	    .then(function(user){
	    	// var uid = currentUser.uid;
		    // console.log(currentUser);
		    
		    //set cookie
		    res.cookie("user", JSON.stringify(user), {maxAge:900000, httpOnly: true, signed: true} )
		    return res.redirect(303, "/dashboard");
	    })
	    .catch(function(error){

		    var errorCode = error.code;
		    var errorMessage = error.message;

		    if(errorCode == "auth/weak-pasword"){
			    console.log("The password is too weak.");
			    res.flash("info", "The password is too weak.");
			    res.redirect("/");
		    }
		    else{
			    console.log(errorMessage)};
			    res.flash("info", errorMessage);
			    res.redirect("/");	
		});
	}
});

router.post("/signIn", function(req, res, next){
 
	var email = req.body.email,
	    password = req.body.password;

	if(email.length === 0 || password.length === 0 ){
		 res.flash("info1", "Invalid logins");
		 res.redirect(302, "/");
	}
	else{

            //Get current user and sign out
        if (firebase.auth().currentUser){
    	    firebase.auth().signOut()
        }
        else{

	    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
	    .then(function(user){
	    	//var uid = currentUser.uid;
		    //console.log(currentUser);
		    res.cookie("user", JSON.stringify(user), {maxAge:900000, htppOnly: true, signed: true})
	    	return res.redirect(302, "/dashboard");

	    })
	    .catch(function(error){
		    var errorCode = error.code;
		    var errorMessage = error.message;
		
		    if (errorCode == "auth/wrong-password") {
			    console.log(error);
			    res.flash("info1", "Wrong password");
			    res.redirect("/")
		    }
		    else{
			    console.log(error);
			    res.flash("info1", error.message);
			    res.redirect("/")
		    }
	    })
        }
    }
});

router.get("/forgotPassword", function(req, res){
	res.render("forgotPassword/forgotPassword");
});

router.post("/forgotPassword", function(req, res, next){
	firebase.auth().sendPasswordResetEmail(req.body.emailpasswordreset)
	.then(function(){
		res.flash("password", "An email has been sent to you");
		res.redirect(302, "/forgotPassword");
	})
	.catch(function(error){
		var errorCode = error.code,
		    errorMessage = error.message;
		if(errorCode == "auth/invalid-email"){
			console.log(errorMessage)
			res.flash("password", "An invalid email");
		    res.redirect(302, "/forgotPassword");
		}
		else if(errorCode == "auth/user-not-found"){
			console.log(errorCode)
			res.flash("password", errorMessage);
		    res.redirect(302, "/forgotPassword");
		}
	})
});

router.get("/dashboard", function(req, res){
    
    //if signed cookie redirects to homepage
    //console.log(req.signedCookies.user);
	if(req.signedCookies.user){
		//var user = req.signedCookies.user;
		res.render("dashboard/dashboard");
	}
	else{
		res.redirect("/");
	}	
});

router.post("/details", function(req, res){
	console.log(req.signedCookies.user);
	console.log(req)
	var user = JSON.parse(req.signedCookies.user);

	     	
	 //Get the current user by setting an observer on the Auth object
			var uid = req.signedCookies.user,
			    documentBody = req.body.document,
			    documentTitle = req.body.title,
			    documentKeywords = req.body.keywords,
			    documentLink = req.body.link,
			    documentDepartment = req.body.department;

		if ( !documentBody || !documentTitle || !documentKeywords || !documentLink || !documentDepartment ) {
			res.flash("document", "All fields must be filled.");
			res.redirect(302, "/dashboard");
		}
		else{
			   
		firebase.database().ref("users/" + user.uid).push(
		{
			"body": documentBody,
			"title": documentTitle,
			"keywords": documentKeywords,
			"link": documentLink,
	        "department": documentDepartment,
	        "date": (new Date()).toString()
		}
		)
		.then(function(){
			
			res.flash("document", "You have one document added");
			res.redirect(302, "/dashboard");
		})
		.catch(function(error){
			res.flash("document", error.message);
			res.redirect(302, "/dashboard");
		});
		};
});

router.get("/details", function(req, res){
	var departments = req.query.department,
	    user = JSON.parse(req.signedCookies.user);
	    firebase.database().ref("users/" + user.uid).on("value", function(snapshot){
	    	var data = snapshot.val();
	    	var keystore = [];
	    	for(var i in data){
	    		if (data[i].department === departments) {
	    			keystore.push(data[i])
	    		};
	    		
	    	}
	    	 res.end(JSON.stringify(keystore))
	    });
	   
});

router.get("/details/search", function(req, res){
	var user = JSON.parse(req.signedCookies.user);
	for(var i in req.query){
		var searchName = i,
		search = req.query[i];
	}
	firebase.database().ref("users/" + user.uid).on("value", function(snapshot){
		var data = snapshot.val(),
		resp = [];
		for(var i in data){
			if(data[i][searchName].toLowerCase().indexOf(search.toLowerCase()) !== -1){
				resp.push(data[i]);
			}
		}
		res.end(JSON.stringify(resp));
	})
})

router.get("/signOut", function(req, res){
	//sign out and clear cookie
	firebase.auth().signOut()
	.then(function(){
		res.clearCookie("user");
	    res.redirect("/");
	})
});

module.exports = router;