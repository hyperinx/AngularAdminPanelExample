var mongodb = require('mongodb');
var common = require('./common');
var restHelper = require('./restHelper');

var rest = module.exports = {

    'login': restHelper.login,
    
    'person': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1 ])) return;
        restHelper.manageSingleObject(arg, common.persons, {
            $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' }
        }, function(person) {
            delete person.groups;
            if(person.memberOf) {
                for(var i in person.memberOf) {
                    person.memberOf[i] = mongodb.ObjectId(person.memberOf[i]);
                }
            } else {
                person.memberOf = [];
            }
        });
    },

    'persons': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1, 2 ])) return;
        restHelper.getObjects(arg, common.persons, {
            
            $lookup: { from: 'groups', localField: 'memberOf', foreignField: '_id', as: 'groups' }
        }, 10, {
            $or: [
                { firstName: { $regex: new RegExp(arg.query.search, 'i') } },
                { lastName: { $regex: new RegExp(arg.query.search, 'i') } },
                { email: { $regex: new RegExp(arg.query.search, 'i') } },
                { groups: { $elemMatch: { name: { $regex: new RegExp(arg.query.search, 'i') } } } }
            ]
        });
       
    },
    

    'group': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1 ])) return;
        restHelper.manageSingleObject(arg, common.groups, null, null);
    },

    'groups': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1 ])) return;
        restHelper.getObjects(arg, common.groups, null, 5, {
            $or: [
                    { name: { $regex: new RegExp(arg.query.search, 'i') } }, 
                    { description: { $regex: new RegExp(arg.query.search, 'i') } }     
                 ]   
        });
    },

    'task': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1 ])) return;
        restHelper.manageSingleObject(arg, common.tasks, null, null);
    },

    'tasks': function(arg) {
        if(!restHelper.checkPermission(arg, [ 1, 2 ])) return;
        restHelper.getObjects(arg, common.tasks, null, 5, {
            name: { $regex: new RegExp(arg.query.search, 'i') }
        });
    },

    'addPersonToGroup': restHelper.notImplemented

};