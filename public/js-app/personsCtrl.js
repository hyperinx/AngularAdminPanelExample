var app = angular.module('app2020');

app.controller('PersonsCtrl', ['$scope', '$http', '$uibModal', 'common', function($scope, $http, $uibModal, common) {
    var ctrl = this;

    // stałe
    const limitDefault = 30;
    const limitDelta = 10;

    // tablica danych
    ctrl.persons = [];
    ctrl.skip = 0;
    ctrl.limit = limitDefault;
    ctrl.search = '';
    ctrl.count = 0;
    ctrl.filtered = 0;

    // akcja przewinięciu ekranu do końca
    ctrl.incLimit = function() {
        if(ctrl.limit >= ctrl.filtered) return;
        ctrl.limit += limitDelta;
        ctrl.loadPersons();
    };

    // akcja po naciśnięciu przycisku +
    ctrl.newPerson = function() {
        var editPersonOptions = { data: {}, noDelete: true };
        editPerson(editPersonOptions);
    };

    // akcja po kliknięciu na rekord
    ctrl.clickPerson = function(id) {
        $http.get("/person?_id=" + id).then(
            function(rep) {
                var editPersonOptions = { data: rep.data };
                editPerson(editPersonOptions);
            },
            function(err) {}
        );
    };

    // załadowanie (ponowne) osób do tablicy persons
    ctrl.loadPersons = function() {
        $http.get("/persons?skip=" + ctrl.skip + "&limit=" + ctrl.limit + "&search=" + ctrl.search).then(
            function(rep) {
                ctrl.persons = rep.data.data;
                ctrl.count = rep.data.count;
                ctrl.filtered = rep.data.filtered;
            },
            function(err) {
                ctrl.persons = [];
                ctrl.count = 0;
                ctrl.filtered = 0;
                ctrl.limit = limitDefault;
            }
        );  
    };
   

    // wywołanie modala
    var editPerson = function(options) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'editPersonDialog.html',
            controller: 'EditPersonCtrl',
            controllerAs: 'ctrl',
            resolve: {
                editPersonOptions: function () {
                    return options;
                }
            }
        });

        modalInstance.result.then(
            function (ret) {
                if(ret == 'delete') {
                    deletePerson(options.data._id);
                } else if(ret == 'save') {
                    if(options.data._id) {
                        changePerson(options.data);
                    } else {
                        insertPerson(options.data);
                    }
                }
            },
            function (ret) {}
        );
    };

    // zmiana istniejącego rekordu w bazie
    var changePerson = function(data) {
        $http.put("/person", data).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane zmienione');
            },
            function(err) {}    
        );
    };

    // usunięcie rekordu
    var deletePerson = function(id) {
        $http.delete("/person?_id=" + id).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane usunięte');
            },
            function(err) {}
        );
    };

    // dodanie nowego rekordu
    var insertPerson = function(data) {
        $http.post("/person", data).then(
            function(rep) {
                ctrl.loadPersons();
                common.alert('alert-success', 'Dane dodane');
            },
            function(err) {}    
        );
    };
    
    // na start kontrolera
    ctrl.loadPersons(function() {});

}]);