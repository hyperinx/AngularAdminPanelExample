var config = require('./config');

var initializeData = function(collection, collectionName, exampleData) {
    if(collection.countDocuments({}, function(err, n) {
        if(!err && n <= 0) {
            console.log('Initializing', collectionName, 'with example data (', exampleData, 'records)');
            if(exampleData.length > 0) {
                collection.insertMany(exampleData);
            }
        }
    }));    
};

var common = module.exports = {

    // sessions: key is session id, value is an object
    sessions: {},

    users: null,
    persons: null,
    groups: null,
    tasks: null,

    initializeData: function(db) {

        var collections = ['users', 'persons', 'groups', 'tasks'];
        for(var i in collections) {
            common[collections[i]] = db.collection(collections[i]);
            initializeData(common[collections[i]], collections[i], config.exampleData[collections[i]]);
        }
    }

};