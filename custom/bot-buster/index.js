// Dependencies
var         util = require("util")
   , MissionQuiz = require("jquest-mission").MissionQuiz
             , _ = require("underscore")
          , jade = require("jade")
, twitterManager = require("../../core/twitter");

// Tweets array
var tweets = [];

// Add bots
twitterManager.addUser({screen_name: "ChamRT", solution: "bot"}, true);
twitterManager.addUser({screen_name: "assemroe", solution: "bot"}, true);
twitterManager.addUser({screen_name: "Egitto3000", solution: "bot"}, true);
twitterManager.addUser({screen_name: "Fuwaara", solution: "bot"}, true);
twitterManager.addUser({screen_name: "leenoo1989", solution: "bot"}, true);
// Add trusted user
twitterManager.addUser({screen_name: "acarvin", solution: "human"}, true);
twitterManager.addUser({screen_name: "leighstream", solution: "human"}, true);
twitterManager.addUser({screen_name: "jenanmoussa", solution: "human"}, true);
twitterManager.addUser({screen_name: "bbclysedoucet", solution: "human"}, true);
twitterManager.addUser({screen_name: "RawyaRageh", solution: "human"}, true);
twitterManager.addUser({screen_name: "hany2m", solution: "human"}, true);
twitterManager.addUser({screen_name: "zkaram", solution: "human"}, true);
twitterManager.addUser({screen_name: "cjchivers", solution: "human"}, true);
twitterManager.addUser({screen_name: "gebauerspon", solution: "human"}, true);
twitterManager.addUser({screen_name: "abuaardvark", solution: "human"}, true);
twitterManager.addUser({screen_name: "fieldproducer", solution: "human"}, true);
twitterManager.addUser({screen_name: "Brown_Moses", solution: "human"}, true);
twitterManager.addUser({screen_name: "NabilAbiSaab", solution: "human"}, true);
twitterManager.addUser({screen_name: "Max_Fisher", solution: "human"}, true);
twitterManager.addUser({screen_name: "DavidKenner", solution: "human"}, true);
twitterManager.addUser({screen_name: "ezzsaid", solution: "human"}, true);


// Force collectiong tweets
twitterManager.collectUsersTweets();

module.exports = function(apiManager, entityManager, user, mission, callback) {

  self = this;  
  // Add several questions from twitter user 
  for(var i=0; i<5; i++)  self.addQuestion(getTweetEvaluated);
  // Add several question from the database (entity to eval)
  for(var i=0; i<5;  i++) self.addQuestion(getTweetToEval);

  // Override the template's directory to use a custom template
  self.templateDirname  = __dirname,
  self.templateFilename = "index.jade",

  // Call the parent constructor
  module.exports.super_.call(self, apiManager, entityManager, user, mission, callback);

};

/**
 * Inheritance from "MissionQuizz"
 */
util.inherits(module.exports, MissionQuiz);

/**
 * Receive a data request
 * @param  {Object}   data     Data object (pass by GET query)
 * @param  {Function} callback Callback function]
 */
module.exports.prototype.get = function(data, callback) {

  switch(data.type) {

    case "user":
      var where = {};

      // User clause
      if(data.id) where.id = 1*data.id; // Important casting for right matching
      else if(data.screen_name) where.screen_name = data.screen_name;
      else return callback({error: "User identifier mission: use 'id' or 'screen_name' parameter."}, null);

      twitterManager.getUserProfile(where, function(err, profile) {
        // Add the twitter parse date function to the locals
        profile.parseDate = twitterManager.parseDate;
        profile.parseText = twitterManager.parseText;
        // Send the profile as locals
        callback(err, err ? null : self.render("profile.jade", profile) ); 
      });   

      break;

    default:
      callback({error: "Unknown request."}, null);      
  }

};

/**
 * Get a tweet from the tweets manager user (yet an array)
 * @param  {Function} callback Callback function
 */
function getTweetFromUser(callback) {
  

  function send(err, data) {

    // Spreads the error
    if(err) return callback(err, null);
    // Check statuses exist
    if(data.statuses.length === 0)  return callback({error: "No tweet available."}, null);

    // Random tweet
    var tweet = data.statuses[ _.random(0, data.statuses.length-1) ];          

    // Extend the tweet before display it (if needed)
    twitterManager.extendTweet(tweet, function(err, tweet) {

      // Spreads the error
      if(err) return callback(err, null);

      callback(null, {
        label     : "Do you think this message was published by a human or by a robot?",
        content   : tweet,
        duration  : 15,
        solution  : data.solution,
        answers   : ["bot", "human"],
        fid       : tweet.id,
        user      : _.clone(data),
        parseText : twitterManager.parseText
      });

    })    


  }

  // Gets a random user
  var user = twitterManager.users[ _.random(0, twitterManager.users.length - 1) ];
  // If there is some tweet
  if(user.data.statuses.length) send(null, user.data);
  // If not, load the timeline first
  else user.loadStatuses(send);

}


/**
 * Get a tweet from the database to evaluate
 * @param  {Function} callback Callback function
 */
function getTweetToEval(callback) {
  
  var tweet = twitterManager.tweetToEval(self.user, function(err, tweet) {

    callback(err, {
      label     : "Do you think this message was published by a human or by a robot?",
      content   : err || tweet,
      duration  : 15,
      answers   : ["bot", "human"],
      fid       : err || tweet.id,
      user      : err || tweet.user,
      family    : twitterManager.FAMILY_ID,
      parseText : twitterManager.parseText
    });

  });

}

/**
 * Get a tweet from the database to evaluate
 * @param  {Function} callback Callback function
 */
function getTweetEvaluated(callback) {
  
  var tweet = twitterManager.tweetEvaluated(self.user, function(err, tweet) {

    callback(err, {
      label     : "Do you think this message was published by a human or by a robot?",
      content   : err || tweet,
      duration  : 15,
      answers   : ["bot", "human"],
      fid       : err || tweet.id,
      user      : err || tweet.user,
      family    : twitterManager.FAMILY_ID,
      parseText : twitterManager.parseText,
      solution  : tweet.solution
    });

  });

}

exports = module.exports;