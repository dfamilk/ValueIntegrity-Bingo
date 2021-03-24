        var apiPath = 'https://dfaapi.dfamilk.com/api/TemporaryTasks/ValueIntegrityBingoParticipants';
        var apiClientName = 'Solutions_Team_Prod';
        var apiKey = '9d07b8c9739642b79f14d778a248199f';

        var bingoGameApp = angular.module('bingoGameApp', ['ngDialog']);

        bingoGameApp.factory("bingoGameService",
        ["$http",
        function ($http) {    
            var postSaveParticipant = function (data) {
                var restConfig = {
                    headers: {
                        'Ocp-Apim-Subscription-Key': apiKey,
                        'ClientName': apiClientName,
                        'ClientUsername': 'Bingo: ' + data.firstName + ' ' + data.lastName,
                    }
                }
                return $http.post(apiPath, data, restConfig);
            }
    
            return {
                postSaveParticipant: postSaveParticipant,
            };    
        }]);

        bingoGameApp.controller('bingoGameController', function($scope, bingoGameService, $timeout, ngDialog) {

            // variables
            $scope.currentQuestionIndex = 0;
            $scope.isGameOver = false;
            $scope.isEmailSubmitted = false;
            $scope.isSavingEmail = false;
            $scope.modalData = {
                firstName: '',
                lastName: '',
                userEmail: '',
                errorMessage: ''
            };
            
            $scope.answers = [
                {id: 1, label: 'R', isBoxBlocked: true}, 
                {id: 2, label: 'A', isBoxBlocked: true}, 
                {id: 3, label: 'I', isBoxBlocked: true}, 
                {id: 4, label: 'S', isBoxBlocked: true}, 
                {id: 5, label: 'E', isBoxBlocked: true},

                {id: 6, label: 'Cooperative'}, 
                {id: 7, label: 'Trust'}, 
                {id: 8, label: 'RaiseIt'}, 
                {id: 9, label: 'Acceptable'}, 
                {id: 10, label: 'Positive', isPartOfWinningRow: true },
                {id: 11, label: 'Act'}, 
                {id: 12, label: 'Honesty'}, 
                {id: 13, label: 'Organization'}, 
                {id: 14, label: 'Expected', isPartOfWinningRow: true}, 
                {id: 15, label: 'Confident'},
                {id: 16, label: 'Aware'}, 
                {id: 17, label: 'Ethical'}, 
                {id: 18, label: 'IT', isBoxBlocked: true, isPartOfWinningRow: true }, 
                {id: 19, label: 'Committed'}, 
                {id: 20, label: 'Free'},
                {id: 21, label: 'Mindful'}, 
                {id: 22, label: 'Integrity', isPartOfWinningRow: true }, 
                {id: 23, label: 'RaiseIt@dfamilk.com'}, 
                {id: 24, label: 'Safety'}, 
                {id: 25, label: 'Dignity'},
                {id: 26, label: 'Success', isPartOfWinningRow: true }, 
                {id: 27, label: 'Truth'}, 
                {id: 28, label: 'Management'}, 
                {id: 29, label: 'Fairly'}, 
                {id: 30, label: 'Social Events'}];

            $scope.questions = [
                
                {text: 'Exercise good judgment and ____________ according to policies and applicable laws.',  answerId: 11},
                {text: 'Be ____________ that content you create can potentially be viewed by a wide audience, while it is actively posted, and may be available for viewing even after the content has been deleted.', answerId: 16},
                {text: 'The way we communicate online with our members, customers, and consumers is critical to our ____________. ', answerId: 26},
                {text: '____________ is our core value.', answerId: 22},
                {text: 'We have built an ____________ culture where our actions are consistent with our words, and our words are consistent with our intentions.', answerId: 17},
                {text: 'We ____________ our employees will do the right thing, and our management and leadership teams will do the right thing when employees raise concerns.', answerId: 7},
                {text: 'Report concerns to a supervisor or any member of ____________.', answerId: 28, inWinningRow: true},
                {text: 'Report concerns to the Ethics and Compliance Department at ____________ or 1-833-852-2020.', answerId: 23, inWinningRow: true},
                {text: 'Report concerns to the Integrity Helpline at 1-855-____________(1-855-724-7348) or at www.dfamilk.ethicspoint.com, if employees wish to remain anonymous.', answerId: 8},
                {text: 'We never compromise our strong values, and we are ____________ to abiding by the laws designed to promote and preserve a competitive global market.', answerId: 19},
                {text: 'Employees are our most important assets and their ____________ and health is of primary concern.', answerId: 24, inWinningRow: true},
                {text: 'Employees are ____________ to act in the best interest of the Cooperative at all times.', answerId: 14, inWinningRow: true},
                {text: 'All individuals should be treated with respect and ____________.', answerId: 25, inWinningRow: true},
                {text: 'We do not tolerate bullying, harassment, or discrimination in the workplace, or in any other work-related settings, such as business trips or business-related ____________ ____________.', answerId: 30, inWinningRow: true},
                {text: 'We believe this begins with maintaining a ____________ and productive work environment, free from bullying, harassment and discrimination.', answerId: 10, inWinningRow: true}
                ];

            // functions
            $scope.clickAnswer = function(answer){
                if ($scope.isGameOver ||
                    !answer ||
                    answer.isBoxBlocked)
                    return;

                if (answer.id != $scope.questions[$scope.currentQuestionIndex].answerId)
                    $scope.wrongAnswer();
                else 
                    $scope.correctAnswer(answer);
            };

            $scope.wrongAnswer = function () {
                ngDialog.open({
                    template: "wrongAnswerModalTemplate",
                    scope: $scope
                });
            };

            $scope.correctAnswer = function (answer) {
                answer.isCorrect = true;
                
                if ($scope.currentQuestionIndex != $scope.questions.length - 1)
                    $scope.currentQuestionIndex++;
                else
                    $scope.setGameOver();
            }

            $scope.setGameOver = function() {
                $scope.isGameOver = true;
                $scope.currentQuestionIndex++;
                $timeout($scope.showGameOver, 250);
            };

            $scope.showGameOver = function() {
                ngDialog.open({
                    template: "gameOverModalTemplate",
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false,
                    scope: $scope
                });
            };

            $scope.closeModal = function() {
                ngDialog.closeAll();
            };

            $scope.submitEmail = function () {
                $scope.isEmailSubmitted = true;

                if (!$scope.modalData.firstName ||
                    !$scope.modalData.lastName ||
                    !$scope.modalData.userEmail ||
                    $scope.isSavingEmail)
                    return;

                $scope.callApiToSaveInfo();
            };
    
            $scope.callApiToSaveInfo = function() {
                $scope.isSavingEmail = true;
                
                var requestBody = {
                    firstName: $scope.modalData.firstName,
                    lastName: $scope.modalData.lastName,
                    email: $scope.modalData.userEmail
                };

                bingoGameService.postSaveParticipant(requestBody)
                    .then(
                        function (data) {
                            $scope.showSaveSuccessful();
                        },
                        function (data) {
                            console.log('Error calling postSaveParticipant', requestBody, data)
                            $scope.modalData.errorMessage = 'An error occurred. Please try again later.';
                            $scope.isSavingEmail = false;
                        });
            };
    
            $scope.showSaveSuccessful = function() {
                $scope.isSavingEmail = false;
                $scope.closeModal();

                ngDialog.open({
                    template: "saveSuccessModalTemplate",
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false,
                    scope: $scope
                });
            };

            $scope.modalFeedbackDisplay = function() {
                if (!$scope.isEmailSubmitted ||
                    $scope.modalData.errorMessage)
                    return null;

                if (!$scope.modalData.firstName) 
                    return 'Enter your first name';

                if (!$scope.modalData.lastName)
                    return 'Enter your last name';

                if (!$scope.modalData.userEmail)
                    return 'Enter your DFA email address';

                return null;
            };

        });
