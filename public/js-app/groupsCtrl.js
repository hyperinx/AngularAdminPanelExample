var app = angular.module('app2020');

app.controller('GroupsCtrl', ['$scope', '$http', '$uibModal', 'common', function($scope, $http, $uibModal, common) {
    var ctrl = this;

    // stałe
    const limitDefault = 30;
    const limitDelta = 10;

    // tablica danych
    ctrl.groups = [];
    ctrl.skip = 0;
    ctrl.limit = limitDefault;
    ctrl.search = '';
    ctrl.count = 0;
    ctrl.filtered = 0;

    // akcja przewinięciu ekranu do końca
    ctrl.incLimit = function() {
        if(ctrl.limit >= ctrl.filtered) return;
        ctrl.limit += limitDelta;
        ctrl.loadGroups();
    };

    // akcja po naciśnięciu przycisku +
    ctrl.newGroup = function() {
        var editGroupOptions = { data: {}, noDelete: true };
        editGroup(editGroupOptions);
    };

    // akcja po kliknięciu na rekord
    ctrl.clickGroup = function(id) {
        $http.get("/group?_id=" + id).then(
            function(rep) {
                var editGroupOptions = { data: rep.data };
                editGroup(editGroupOptions);
            },
            function(err) {}
        );
    };

    // załadowanie (ponowne) osób do tablicy persons
    ctrl.loadGroups = function() {
        $http.get("/groups?skip=" + ctrl.skip + "&limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.groups = rep.data.data;
                ctrl.count = rep.data.count;
                ctrl.filtered = rep.data.filtered;
            },
            function(err) {
                ctrl.groups = [];
                ctrl.count = 0;
                ctrl.filtered = 0;
                ctrl.limit = limitDefault;
            }
        );
    };

    // wywołanie modala
    var editGroup = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editGroupDialog.html',
            controller: 'EditGroupCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editGroupOptions: function () {
                    return options;
                }
            }
        });

        modalInstance.result.then(
            function (ret) {
                if(ret == 'delete') {
                    deleteGroup(options.data._id);
                } else if(ret == 'save') {
                    if(options.data._id) {
                        changeGroup(options.data);
                    } else {
                        insertGroup(options.data);
                    }
                }
            },
            function (ret) {}
        );
    };

    // zmiana istniejącego rekordu w bazie
    var changeGroup = function(data) {
        $http.put("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    // usunięcie rekordu
    var deleteGroup = function(id) {
        $http.delete("/group?_id=" + id).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    };

    // dodanie nowego rekordu
    var insertGroup = function(data) {
        $http.post("/group", data).then(
            function(rep) {
                ctrl.loadGroups();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };
    
    // na start kontrolera
    ctrl.loadGroups(function() {});
 
    
}]);