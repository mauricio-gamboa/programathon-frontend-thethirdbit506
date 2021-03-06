(function() {
    'use strict';
    angular
        .module('pymeFbApp')
        .controller('AdminController', ['Facebook', 'Notification', 'config', 'dataService', 'sessionService', '$location', '$rootScope','$routeParams', AdminController]);

    function AdminController(Facebook, Notification, config, dataService, sessionService, $location, $rootScope, $routeParams) {
        var vm = this;

        vm.shared = false;
        vm.loading = false;
        vm.installed = false;
        vm.responsesAvailable = false;
        vm.isLoadingResponses = false;

        vm.install = function () {
          var addTab = 'https://www.facebook.com/dialog/pagetab?app_id=1203377526408832&redirect_uri=http://thethirdbitapp.herokuapp.com/';

        }

        vm.share = function () {
          Facebook.login(function(response) {
            Facebook.getLoginStatus(function(response) {
              sharePost(response.authResponse.accessToken);
            });
          });
        }

        function sharePost (user_token) {
          vm.loading = true;
          dataService.postToPyme(vm.PymeID, user_token).then(function(response){
              vm.shared = true;
              Notification.success('La encuesta fue compartida con exito');
          });
        }

        vm.code = getURLParameter('code');
        vm.PymeID = $rootScope.sessionData.PymeID;

        dataService.getPyme(vm.PymeID).then(function(pyme){
          vm.business = pyme.data;
          $rootScope.business = vm.business;

          vm.socialLinks = [];
          for(var x = 0, max = vm.business.social.length; x < max; x++) {
              var obj = {};
              obj.type = vm.business.social[x].type === 'Website' ? 'globe' : vm.business.social[x].type.toLowerCase();
              obj.name = vm.business.social[x].type === 'Website' ? 'Sitio Web' : vm.business.social[x].type;
              obj.url = vm.business.social[x].Link;
              vm.socialLinks.push(obj);
          }
        });

        vm.getResponses = function() {
            $('.morris-charts').empty();
            vm.isLoadingResponses = true;

            function parseDate(date) {
                return date.replace(/\//g, '-');
            }

            var startDate = parseDate(vm.formData.fecha_inicial),
                startNumber = parseInt(startDate.substring(0,2)),
                endDate = parseDate(vm.formData.fecha_final),
                endNumber = parseInt(endDate.substring(0,2));

            if(startDate < endDate || startDate == endDate) {
                dataService.getResponses(vm.PymeID, startDate, endDate).then(function(data){
                    console.log(data);
                    if(data.statusText == 'OK') {
                        vm.responsesAvailable = true;
                        vm.isLoadingResponses = false;
                        console.log(data);
                        vm.females = 0;
                        vm.males = 0;

                        vm.ageOne = 0;
                        vm.ageTwo = 0;
                        vm.ageThree = 0;
                        vm.ageFour = 0;
                        vm.ageFive = 0;
                        vm.ageSix = 0;
                        vm.ageSeven = 0;

                        vm.QuestionOneAnswerOne = 0;
                        vm.QuestionOneAnswerTwo = 0;
                        vm.QuestionOneAnswerThree = 0;
                        vm.QuestionOneAnswerFour = 0;
                        vm.QuestionOneAnswerFive = 0;

                        vm.QuestionTwoAnswerOne = 0;
                        vm.QuestionTwoAnswerTwo = 0;
                        vm.QuestionTwoAnswerThree = 0;
                        vm.QuestionTwoAnswerFour = 0;
                        vm.QuestionTwoAnswerFive = 0;

                        vm.QuestionThreeAnswerOne = 0;
                        vm.QuestionThreeAnswerTwo = 0;
                        vm.QuestionThreeAnswerThree = 0;
                        vm.QuestionThreeAnswerFour = 0;
                        vm.QuestionThreeAnswerFive = 0;

                        vm.QuestionFourAnswerOne = 0;
                        vm.QuestionFourAnswerTwo = 0;
                        vm.QuestionFourAnswerThree = 0;
                        vm.QuestionFourAnswerFour = 0;
                        vm.QuestionFourAnswerFive = 0;

                        vm.QuestionFiveAnswerOne = 0;
                        vm.QuestionFiveAnswerTwo = 0;
                        vm.QuestionFiveAnswerThree = 0;
                        vm.QuestionFiveAnswerFour = 0;
                        vm.QuestionFiveAnswerFive = 0;

                        var dataLength = data.data.length;

                        for(var x = 0, max = data.data.length; x < max; x++) {
                            switch(data.data[x].genero_id) {
                                case 'F':
                                    vm.females = vm.females + 1;
                                    break;
                                case 'M':
                                    vm.males = vm.males + 1;
                                    break;
                            }
                            switch(data.data[x].rango_edad) {
                                case "1":
                                    vm.ageOne = vm.ageOne + 1;
                                    break;
                                case "2":
                                    vm.ageTwo = vm.ageTwo + 1;
                                    break;
                                case "3":
                                    vm.ageThree = vm.ageThree + 1;
                                    break;
                                case "4":
                                    vm.ageFour = vm.ageFour + 1;
                                    break;
                                case "5":
                                    vm.ageFive = vm.ageFive + 1;
                                    break;
                                case "6":
                                    vm.ageSix = vm.ageSix + 1;
                                    break;
                                case "7":
                                    vm.ageSeven = vm.ageSeven + 1;
                                    break;
                            }
                            switch(data.data[x].respuesta_01) {
                                case "1":
                                    vm.QuestionOneAnswerOne = vm.QuestionOneAnswerOne + 1;
                                    break;
                                case "2":
                                    vm.QuestionOneAnswerTwo = vm.QuestionOneAnswerTwo + 1;
                                    break;
                                case "3":
                                    vm.QuestionOneAnswerThree = vm.QuestionOneAnswerThree + 1;
                                    break;
                                case "4":
                                    vm.QuestionOneAnswerFour = vm.QuestionOneAnswerFour + 1;
                                    break;
                                case "5":
                                    vm.QuestionOneAnswerFive = vm.QuestionOneAnswerFive + 1;
                                    break;
                            }
                            switch(data.data[x].respuesta_02) {
                                case "1":
                                    vm.QuestionTwoAnswerOne = vm.QuestionTwoAnswerOne + 1;
                                    break;
                                case "2":
                                    vm.QuestionTwoAnswerTwo = vm.QuestionTwoAnswerTwo + 1;
                                    break;
                                case "3":
                                    vm.QuestionTwoAnswerThree = vm.QuestionTwoAnswerThree + 1;
                                    break;
                                case "4":
                                    vm.QuestionTwoAnswerFour = vm.QuestionTwoAnswerFour + 1;
                                    break;
                                case "5":
                                    vm.QuestionTwoAnswerFive = vm.QuestionTwoAnswerFive + 1;
                                    break;
                            }
                            switch(data.data[x].respuesta_03) {
                                case "1":
                                    vm.QuestionThreeAnswerOne = vm.QuestionThreeAnswerOne + 1;
                                    break;
                                case "2":
                                    vm.QuestionThreeAnswerTwo = vm.QuestionThreeAnswerTwo + 1;
                                    break;
                                case "3":
                                    vm.QuestionThreeAnswerThree = vm.QuestionThreeAnswerThree + 1;
                                    break;
                                case "4":
                                    vm.QuestionThreeAnswerFour = vm.QuestionThreeAnswerFour + 1;
                                    break;
                                case "5":
                                    vm.QuestionThreeAnswerFive = vm.QuestionThreeAnswerFive + 1;
                                    break;
                            }
                            switch(data.data[x].respuesta_04) {
                                case "1":
                                    vm.QuestionFourAnswerOne = vm.QuestionFourAnswerOne + 1;
                                    break;
                                case "2":
                                    vm.QuestionFourAnswerTwo = vm.QuestionFourAnswerTwo + 1;
                                    break;
                                case "3":
                                    vm.QuestionFourAnswerThree = vm.QuestionFourAnswerThree + 1;
                                    break;
                                case "4":
                                    vm.QuestionFourAnswerFour = vm.QuestionFourAnswerFour + 1;
                                    break;
                                case "5":
                                    vm.QuestionFourAnswerFive = vm.QuestionFourAnswerFive + 1;
                                    break;
                            }
                            switch(data.data[x].respuesta_05) {
                                case "1":
                                    vm.QuestionFiveAnswerOne = vm.QuestionFiveAnswerOne + 1;
                                    break;
                                case "2":
                                    vm.QuestionFiveAnswerTwo = vm.QuestionFiveAnswerTwo + 1;
                                    break;
                                case "3":
                                    vm.QuestionFiveAnswerThree = vm.QuestionFiveAnswerThree + 1;
                                    break;
                                case "4":
                                    vm.QuestionFiveAnswerFour = vm.QuestionFiveAnswerFour + 1;
                                    break;
                                case "5":
                                    vm.QuestionFiveAnswerFive = vm.QuestionFiveAnswerFive + 1;
                                    break;
                            }
                        }

                        function valueAsPercentage(val, total) {
                            return Math.floor(100*(val/total));
                        }

                        Morris.Donut({
                            element: 'chart-gender',
                            data: [{
                                label: "Mujeres",
                                value: valueAsPercentage(vm.females, dataLength)
                            }, {
                                label: "Hombres",
                                value: valueAsPercentage(vm.males, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-age',
                            data: [{
                                label: "12-17",
                                value: valueAsPercentage(vm.ageOne, dataLength)
                            }, {
                                label: "18-33",
                                value: valueAsPercentage(vm.ageTwo, dataLength)
                            }, {
                                label: "34-45",
                                value: valueAsPercentage(vm.ageThree, dataLength)
                            }, {
                                label: "46-55",
                                value: valueAsPercentage(vm.ageFour, dataLength)
                            }, {
                                label: "56-64",
                                value: valueAsPercentage(vm.ageFive, dataLength)
                            }, {
                                label: "65-73",
                                value: valueAsPercentage(vm.ageSix, dataLength)
                            }, {
                                label: "74+",
                                value: valueAsPercentage(vm.ageSeven, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-question-one',
                            data: [{
                                label: "Malo(a)",
                                value: valueAsPercentage(vm.QuestionOneAnswerOne, dataLength)
                            }, {
                                label: "Regular",
                                value: valueAsPercentage(vm.QuestionOneAnswerTwo, dataLength)
                            }, {
                                label: "Normal",
                                value: valueAsPercentage(vm.QuestionOneAnswerThree, dataLength)
                            }, {
                                label: "Bueno(a)",
                                value: valueAsPercentage(vm.QuestionOneAnswerFour, dataLength)
                            }, {
                                label: "Excelente",
                                value: valueAsPercentage(vm.QuestionOneAnswerFive, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-question-two',
                            data: [{
                                label: "Malo(a)",
                                value: valueAsPercentage(vm.QuestionTwoAnswerOne, dataLength)
                            }, {
                                label: "Regular",
                                value: valueAsPercentage(vm.QuestionTwoAnswerTwo, dataLength)
                            }, {
                                label: "Normal",
                                value: valueAsPercentage(vm.QuestionTwoAnswerThree, dataLength)
                            }, {
                                label: "Bueno(a)",
                                value: valueAsPercentage(vm.QuestionTwoAnswerFour, dataLength)
                            }, {
                                label: "Excelente",
                                value: valueAsPercentage(vm.QuestionTwoAnswerFive, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-question-three',
                            data: [{
                                label: "Malo(a)",
                                value: valueAsPercentage(vm.QuestionThreeAnswerOne, dataLength)
                            }, {
                                label: "Regular",
                                value: valueAsPercentage(vm.QuestionThreeAnswerTwo, dataLength)
                            }, {
                                label: "Normal",
                                value: valueAsPercentage(vm.QuestionThreeAnswerThree, dataLength)
                            }, {
                                label: "Bueno(a)",
                                value: valueAsPercentage(vm.QuestionThreeAnswerFour, dataLength)
                            }, {
                                label: "Excelente",
                                value: valueAsPercentage(vm.QuestionThreeAnswerFive, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-question-four',
                            data: [{
                                label: "Malo(a)",
                                value: valueAsPercentage(vm.QuestionFourAnswerOne, dataLength)
                            }, {
                                label: "Regular",
                                value: valueAsPercentage(vm.QuestionFourAnswerTwo, dataLength)
                            }, {
                                label: "Normal",
                                value: valueAsPercentage(vm.QuestionFourAnswerThree, dataLength)
                            }, {
                                label: "Bueno(a)",
                                value: valueAsPercentage(vm.QuestionFourAnswerFour, dataLength)
                            }, {
                                label: "Excelente",
                                value: valueAsPercentage(vm.QuestionFourAnswerFive, dataLength)
                            }],
                            resize: true
                        });
                        Morris.Donut({
                            element: 'chart-question-five',
                            data: [{
                                label: "Malo(a)",
                                value: valueAsPercentage(vm.QuestionFiveAnswerOne, dataLength)
                            }, {
                                label: "Regular",
                                value: valueAsPercentage(vm.QuestionFiveAnswerTwo, dataLength)
                            }, {
                                label: "Normal",
                                value: valueAsPercentage(vm.QuestionFiveAnswerThree, dataLength)
                            }, {
                                label: "Bueno(a)",
                                value: valueAsPercentage(vm.QuestionFiveAnswerFour, dataLength)
                            }, {
                                label: "Excelente",
                                value: valueAsPercentage(vm.QuestionFiveAnswerFive, dataLength)
                            }],
                            resize: true
                        });
                        $(window).resize();
                    } else {
                        vm.responsesAvailable = false;
                        vm.isLoadingResponses = false;
                    }
                });
            } else {
                Notification.error('Por favor ingresar un fecha valida.');
                vm.isLoadingResponses = false;
                vm.responsesAvailable = false;
            }
        };

        dataService.getUser($rootScope.sessionData.UsuarioId).then(function(user){
            vm.user = user.data;
        });

        vm.title = 'Panel de Métricas';

        vm.getCurrentDate = function() {
            var today = new Date(),
                dd = today.getDate(),
                mm = today.getMonth() + 1,
                yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = dd + '/' + mm + '/' + yyyy;
            console.log(today);
            return today;
        };

        vm.signOut = function() {
            sessionService.signOut(function() {
                $location.path('/inicio');
            });
        };

        $rootScope.signOut = vm.signOut;

        vm.getResults = function (data) {
          console.log(data);
        }

        function getURLParameter(name) {
          return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
        }
    };
})();
