const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");


var serviceAccount = require("./contact-us-7c6f1-firebase-adminsdk-7ajfg-6fcd2a018a.json");

var transporter = nodemailer.createTransport({
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
     secure: false,//true
     port: 25,//465
    auth: {
        user: "youremail@gmail.com",
        pass: "yourpasssword"
    }
  });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://contact-us-7c6f1.firebaseio.com"
});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));
var firebaseConfig = {
    apiKey: "AIzaSyCrWSGrtY_gYQenGKS3MIjb5Nj7NOjTXgM",
    authDomain: "contact-us-7c6f1.firebaseapp.com",
    databaseURL: "https://contact-us-7c6f1.firebaseio.com",
    projectId: "contact-us-7c6f1",
    storageBucket: "contact-us-7c6f1.appspot.com",
    messagingSenderId: "657188471429",
    appId: "1:657188471429:web:2c69f9de8b4c3fabef1fec"
  };

  const db = admin.firestore();

app.route("/")
    .get(function(req,res){

        res.render("index");
    })
     .post(function(req,res){
        var name,number,email,message;
        name = req.body.name;
        number = req.body.number;
        email = req.body.email;
        message = req.body.message;
        db.collection('Contacts').doc(name).set({
            number : number,
            email_id : email,
            message : message
        })
        var mailOptions = {
            from: email,
            to: 'sender email',
            subject: 'Contact Me Page from '+ name ,
            text: " Email-id = "+ email + "\n Phone number= " + number + "\n Message=" + message};
          
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        res.redirect("/");
});



    app.listen(process.env.PORT||3000,function(){
        console.log("Server started on port 3000");
    });

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
