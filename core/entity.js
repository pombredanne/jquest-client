var api = require("./api.js");

function EntityManager() {}

/**
 * Add an entity to the database
 * @param {Object}          entity    Entity object
 * @param {String}          fid       Identifier of the entity in its family   
 * @param {Integer|String}  family    Family identifier (id or resource uri)
 * @param {Function}        callback  Callback function
 */
EntityManager.prototype.add = function(entity, fid, family, callback) {
    callback = callback || function() {};
    var data = { 
        // Stringify the entity
        body: JSON.stringify(entity), 
        // Specify the entity id (from its provider) to avoid duplicates
        fid: fid,
        // Specify the family (Tweet, FB update, etc)
        family: family
    };
    api.entity.post(data, callback);
};

/**
 * Record an entity evaluation
 * @param {String}          value     Value of the evaluation
 * @param {String}          fid       Identifier of the entity in its family   
 * @param {Integer|String}  family    Family identifier (id or resource uri)
 * @param {Function}        callback  Callback function
 */
EntityManager.prototype.eval = function(value, fid, family, callback) {

    callback = callback || function() {};
    var data = { 
        user: 4,
        // Stringify the value if need
        value: typeof(value) == "string" ? value : JSON.stringify(value), 
        // Specify the entity id (from its provider)
        fid: fid,
        // Specify the family (Tweet, FB update, etc)
        family: family
    };

    // We use the couple fid/family that is the best way to identificate
    // an unique entity through the database 
    api.entity_eval.post(data, callback);
};

// Assure the manager object is a singleton.
global.JQUEST_ENTITY_MANAGER = global.JQUEST_ENTITY_MANAGER ? global.JQUEST_ENTITY_MANAGER : new EntityManager();

// The module exports a singleton instance of the TweetManager class so the
// instance is immediately available on require(), and the prototype methods
// aren't a part of the object namespace when inspected.
module.exports = global.JQUEST_ENTITY_MANAGER;