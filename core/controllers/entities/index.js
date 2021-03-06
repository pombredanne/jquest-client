var entityManager = require("../../entity")
         , config = require("config")
          , async = require('async')
          , users = require("../users")
            , api = require("../../api")
              , _ = require("underscore");

// app global object
var app;

/**
 * @author Pirhoo
 * @description Missions route handlers
 *
 */
module.exports = function(_app) {  

  app = _app;

  app.get("/:lang/e/:id", singleEntityPage);

};


var singleEntityPage = function(req, res) {

    api.entity(req.params.id).get(function(err, entity) {
        // No entity available
        if(err) res.render("500", err);
        else res.render("entities/entity", entity);
    });

}