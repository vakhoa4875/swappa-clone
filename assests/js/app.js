angular.module("myApp", ["ngRoute"])
    .run(($rootScope, $timeout) => {
        $rootScope.$on('$routeChangeStart', () => {
            $rootScope.loading = true;
        })
        $rootScope.$on('$routeChangeSuccess', () => {
            $timeout(() => {
                $rootScope.loading = false;
            }, 500);
        })
        $rootScope.$on('$routeChangeError', () => {
            $rootScope.loading = false;
            alert("Lỗi đc chưa");
        })
    })
    .config(($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'assests/html/home.html',
                controller: 'homeCtrl'
            })
            .when('/category/:name/:child', {
                templateUrl: 'assests/html/productList.html',
                controller: 'productList2Ctrl'
            })
            .when('/category/:name/:child/:product', {
                templateUrl: 'assests/html/productList3.html',
                controller: 'productList3Ctrl'
            })
            .when('/category/:name/:child/:product/:code', {
                templateUrl: 'assests/html/productDetail.html',
                controller: 'productDetailCtrl'
            })
            .when('/search/:code', {
                templateUrl: 'assests/html/productDetail.html',
                controller: 'productDetailCtrl'
            })
            .when('/category/:name', {
                templateUrl: 'assests/html/productList.html',
                controller: 'productListCtrl'
            })
            .when('/searchResult', {
                templateUrl: 'assests/html/searchResult.html',
                controller: 'searchResultCtrl'
            })
            .when('/cart', {
                templateUrl: 'assests/html/cart.html',
                controller: 'cartCtrl'
            })
            .when('/account', {
                templateUrl: 'assests/html/account.html',
                controller: 'accountCtrl'
            })
            .when('/account/changePass', {
                templateUrl: 'assests/html/changePass.html',
                controller: 'changePassCtrl'
            })
            .otherwise({
                template: '<img src="assests/srcPic/404.gif">',
            })
    })
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('!');
    }])
    .filter('uppercaseFirst', function () {
        return function (input) {
            if (input) {
                return input.charAt(0).toUpperCase() + input.slice(1);
            } else {
                return '';
            }
        };
    })
    .filter('timeAgo', function () {
        return function (input) {
            if (input) {
                var date = new Date(input);
                var now = new Date();
                var timeDifference = now - date;

                var seconds = Math.floor(timeDifference / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                var months = Math.floor(days / 30);
                var years = Math.floor(months / 12);

                if (years > 0) {
                    return years + ' year' + (years > 1 ? 's' : '') + ' ago';
                } else if (months > 0) {
                    return months + ' month' + (months > 1 ? 's' : '') + ' ago';
                } else if (days > 0) {
                    return days + ' day' + (days > 1 ? 's' : '') + ' ago';
                } else if (hours > 0) {
                    return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
                } else if (minutes > 0) {
                    return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
                } else {
                    return (seconds == 0) ? 'just now' : seconds + ' second' + (seconds > 1 ? 's' : '') + ' ago';
                }
            } else {
                return '';
            }
        };
    })
    .service('sharedDataService', function () {
        return {};
    })
    .controller("myCtrl", function ($scope, $route, $rootScope, $http, $location) {

        $rootScope.currentPath = '/';

        /*
        DECLARE REASONABLE VARIABLES
        */
        //searchCtrl & myCtrl
        $rootScope.categories = [];
        $rootScope.series = [];
        $rootScope.allMiniItems = [];
        $rootScope.allItems = [];
        $rootScope.searchRes = null;
        $scope.keyword = '';

        // $scope.redirectOnInputChange = function () {
        //     // Your logic to check if keyword is not empty and then redirect
        //     if ($scope.keyword != '') {
        //         $location.path('/searchResult');
        //     }
        // }

        /*
        GET DATA FROM JSON
        */
        $http.get('assests/json/dataFinal.json').then(
            (res) => {
                // alert('loading json');
                $rootScope.categories = res.data;
                for (item of $rootScope.categories) {
                    for (ite of item.child) {
                        if (ite.series != null) {
                            $rootScope.series.push({
                                ...ite,
                                name1: item.name,
                                name2: ite.name
                            });
                            for (it of ite.series) {
                                $rootScope.allItems.push({
                                    ...it,
                                    name1: item.name,
                                    name2: ite.name,
                                    name3: it.name
                                })
                                if (it.products != null) {
                                    for (i of it.products) {
                                        $rootScope.allMiniItems.push({
                                            ...i,
                                            name1: item.name,
                                            name2: ite.name,
                                            name3: it.name,
                                            name4: i.code
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                console.log($rootScope.allMiniItems);
            },
            (res) => {
                console.log("ERROR LOADING DATA FROM JSON FILE.");
            }
        )

        //item
        $rootScope.star = [1, 2, 3, 4, 5];

        $rootScope.search = (keyword, e) => {
            e.preventDefault();
            keyword = keyword.toLowerCase();
            $rootScope.searchRes = [];
            // for (item of $rootScope.series) {
            //     let name = item.name.toLowerCase();
            //     if (name.indexOf(keyword) !== -1) {
            //         for (ite of item.series) {
            //             $rootScope.searchRes.push({
            //                 ...ite,
            //                 name1: item.name1,
            //                 name2: item.name2,
            //                 name3: ite.name
            //             });
            //             console.log(ite);
            //         }
            //     } else {
            //         for (ite of item.series) {
            //             let name2 = ite.name.toLowerCase();
            //             if (name2.indexOf(keyword) !== -1) {
            //                 $rootScope.searchRes.push({
            //                     ...ite,
            //                     name1: item.name1,
            //                     name2: item.name2,
            //                     name3: ite.name
            //                 });
            //                 console.log(ite);
            //             }
            //         }
            //     }
            // }

            for (item of $rootScope.allItems) {
                if (item.name1.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                    || item.name2.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                    || item.name3.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                    $rootScope.searchRes.push(item);
                    // console.log(item);
                }
            }

            if (keyword != null) {
                $location.path('/searchResult');
            }
        }

        /* 
        CART CTRL
        */

        $rootScope.cart = [];
        $rootScope.cartLen = $rootScope.cart.length;

        $rootScope.add2cart = (id) => {
            let check = false;

            for (sp of $rootScope.cart) {
                if (sp.id == id) {
                    check = true;
                    sp.quantity++;
                    return;
                }
            }

            if (!check) {
                let newProd = {};
                for (sp of $rootScope.allMiniItems) {
                    if (sp.id == id) {
                        newProd = {
                            ...sp,
                            buy: false,
                            quantity: 1
                        };
                        $rootScope.cart.push(newProd);
                        break;
                    }
                }
            }
            console.log($rootScope.cart);
            $rootScope.cartLen = $rootScope.cart.length;
        }

        /*
        ACCOUNT CTRL
        */
        $rootScope.accounts = [
            {
                firstName: 'Khoa',
                lastName: 'Vu',
                email: 'khoavaps29089@fpt.edu.vn',
                password: 'Khoa69'
            }
        ]

        $rootScope.logOut = () => {
            let check = confirm('Are u sure about that - losing all the items in your cart??');
            if (check) {
                $rootScope.isLogin = false;
                $location.path('/');
                // $route.reload();
            }
        }

    })
    .controller("homeCtrl", function ($scope, $rootScope) {

    })
    .controller("changePassCtrl", function ($scope, $rootScope) {
        $scope.password = '';
        $scope.password2 = '';
        $scope.status = null;
        $scope.textStatus = '';
        $scope.passwordBlurred = false;
        $scope.password2Blurred = false;
        $scope.showPass = false;
        $scope.showPass2 = false;

        $scope.isInvalidPassword = function () {
            return $scope.formChange.password.$invalid && $scope.passwordBlurred;
        };

        $scope.isInvalidPassword2 = function () {
            return $scope.formChange.password2.$invalid && $scope.password2Blurred;
        };

        $scope.changePass = () => {
            if ($scope.password == $rootScope.user.password) {
                if ($scope.password2 != $scope.password) {
                    $rootScope.user.password = $scope.password2;
                    $scope.status = 1;
                    $scope.textStatus = 'Your Password is updated successfully! Take care!';
                    return;
                }
                else {
                    $scope.status = 0;
                    $scope.textStatus = 'The new password is the same as previous one! Please choose another one!';
                    return;
                }
            }
            $scope.status = -1;
            $scope.textStatus = 'The type your current password correctly!';
        }


    })
    .controller("searchResultCtrl", function ($scope, $rootScope) {

    })
    .controller("accountCtrl", function ($scope, $rootScope, $location, $timeout) {
        /*
        SIGN UP
        */
        $scope.firstNameBlurred = false;
        $scope.lastNameBlurred = false;
        $scope.email2Blurred = false;
        $scope.password21Blurred = false;
        $scope.password22Blurred = false;
        //firstname sign up
        $scope.isInvalidFirstName = function () {
            // console.log($scope.firstName);
            return $scope.formSignUp.firstName.$invalid && $scope.firstNameBlurred;
        };
        //lastname sign up
        $scope.isInvalidLastName = function () {
            // console.log($scope.password21 + " | " + $scope.password22);
            return $scope.formSignUp.lastName.$invalid && $scope.lastNameBlurred;
        };
        //email2 sign up
        $scope.isInvalidEmail2 = function () {
            // console.log($scope.password21 + " | " + $scope.password22);
            return $scope.formSignUp.email2.$invalid && $scope.email2Blurred;
        };
        //password21 sign up
        $scope.isInvalidPassword21 = function () {
            // console.log($scope.password21 + " | " + $scope.password22);
            return $scope.formSignUp.password21.$invalid && $scope.password21Blurred;
        };
        //email21 sign up
        $scope.isInvalidPassword22 = function () {
            console.log($scope.password21 + " | " + $scope.password22);
            return $scope.formSignUp.password22.$invalid && $scope.password22Blurred;
        };
        /*
        LOG IN
        */
        $scope.emailBlurred = false;
        $scope.passwordBlurred = false;
        //email
        $scope.isInvalidEmail = function () {
            return $scope.formLogIn.email.$invalid && $scope.emailBlurred;
        };
        //email
        $scope.isInvalidPassword = function () {
            return $scope.formLogIn.password.$invalid && $scope.passwordBlurred;
        };

        // $scope.loginSuccess = true;
        $scope.textStatus = '';
        $rootScope.isLogin = false;
        $rootScope.user = null;

        $rootScope.login = () => {
            $scope.status = -1;
            let log = 'Your email hasn\'t been registered yet!';
            if ($scope.formLogIn.$valid) {
                for (acc of $rootScope.accounts) {
                    if (acc.email.toLowerCase() == $scope.email.toLowerCase()) {
                        if (acc.password == $scope.password) {
                            // $scope.loginSuccess = true;
                            log = 'Welcome back, ' + acc.lastName + ' ' + acc.firstName + '!! You\'re automatically redirect to your previous page in 3 seconds';
                            $scope.status = 1;
                            $rootScope.user = acc;
                            break;
                        } else {
                            // $scope.loginSuccess = false;
                            $scope.textStatus = 'Wrong Password, please try again!!'
                            $scope.status = 0;
                            return;
                        }
                    }
                }
            }
            console.log(log);
            $scope.textStatus = log;
            $rootScope.isLogin = true;
            $timeout(() => {
                // Redirect to the desired page after the delay
                $location.path($rootScope.currentPath);  // Replace '/your-page' with the actual URL
            }, 2250);
        }

        $scope.textStatus2 = '';
        $scope.showPass = false;

        $rootScope.signUp = () => {
            $scope.status2 = true;
            $scope.textStatus2 = 'Your email is already exists. Please try another!!';

            if ($scope.password21 != $scope.password22) {
                $scope.textStatus2 = 'Ayyo correct the confirm password!';
                $scope.status2 = false;
                return;
            }

            if ($scope.formSignUp.$valid) {
                for (acc of $rootScope.accounts) {
                    if (acc.email.toLowerCase() == $scope.email2.toLowerCase()) {
                        $scope.status2 = false;
                        return;
                    }
                }
            }

            $rootScope.createAccount();

            $scope.textStatus2 = 'Account Registration Successfully!! You can LOGIN now!';
            console.log($scope.textStatus2);

        }

        $rootScope.createAccount = () => {
            $rootScope.accounts.push({
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email2,
                password: $scope.password21
            });
            console.log($rootScope.accounts);
        }

    })
    .controller("cartCtrl", function ($scope, $timeout, $rootScope, $location) {

        $scope.itemsCount = 0;
        $scope.total = 0;
        $scope.isTickAll = false;

        $scope.countSelected = () => {
            let count = 0;
            let total = 0;
            for (sp of $rootScope.cart) {
                console.log($rootScope.cart);
                if (!sp.buy) {
                    $scope.isTickAll = false;
                    console.log($scope.isTickAll);
                }
                count = (sp.buy) ? ++count : count;
                total = (sp.buy) ? total + sp.price : total;
            }
            $scope.total = total;
            $scope.itemsCount = count;
        }


        $scope.delFromCart = (id) => {
            for (let i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].id == id) {
                    $rootScope.cart.splice(i, 1);
                    break;
                }
            }
            $rootScope.cartLen = $rootScope.cart.length;
            $scope.countSelected();
        }

        $scope.clearCart = () => {
            var userConfirmed = confirm("Are you sure you want to clear all items in your CART??");

            if (userConfirmed) {
                $rootScope.cart = [];
            }
            $rootScope.cartLen = $rootScope.cart.length;
            $scope.countSelected();
        }

        $scope.tickAll = (check) => {
            $scope.isTickAll = check;
            for (sp of $rootScope.cart) {
                sp.buy = check;
            }
            $scope.countSelected();
        }

        $scope.boughtItemsID = [];

        $scope.buySelected = () => {
            if (!$rootScope.isLogin) {
                let check = confirm("You're not login yet! Login now?");

                for (sp of $rootScope.cart) {
                    sp.buy = false;
                }

                if (check) {
                    $rootScope.currentPath = '/cart';
                    $location.path('/account');
                }
                return;
            }

            var buyRequest = confirm("Are you sure to pay $" + $scope.total + " for " + $scope.itemsCount + " items");

            if (buyRequest) {
                $timeout(function () {
                    // Code to be executed after the timeout
                    alert('Your Order is Ready!\nThanks for using our service!!');
                }, 1000);


                for (let i = 0; i < $rootScope.cart.length; i++) {
                    if ($rootScope.cart[i].buy) {
                        $scope.boughtItemsID.push($rootScope.cart[i].id);
                        $rootScope.cart.splice(i--, 1);
                        // i--;
                    }
                }

                for (let i = 0; i < $rootScope.allMiniItems.length; i++) {
                    if ($scope.boughtItemsID.indexOf($rootScope.allMiniItems.id) !== -1) {
                        $rootScope.allMiniItems.splice(i, 1);
                        console.log('del: ' + i);
                    }
                }
            }
            $scope.countSelected();
        }

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    })
    .controller("productListCtrl", function ($scope, $routeParams, $rootScope) {
        $scope.name = $routeParams.name;
        $scope.series = [];
        for (ele of $rootScope.categories) {
            if (ele.name == $scope.name) {
                $scope.series = ele.child;
                break;
            }
        }
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    })
    .controller("productList2Ctrl", function ($scope, $routeParams, $rootScope) {
        $scope.name = $routeParams.name;
        $scope.child = $routeParams.child;

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    })
    .controller("productList3Ctrl", function ($scope, $routeParams, $rootScope) {

        $scope.name0 = $routeParams.name;
        $scope.child = $routeParams.child;
        $scope.product = $routeParams.product;
        $scope.item = {};

        /*
        FILTER
        */

        $scope.carriers = [
            {
                key: '',
                value: 'Carrier Filter'
            }
        ]
        $scope.colors = [
            {
                key: '',
                value: 'Color Filter'
            }
        ]
        $scope.storages = [
            {
                key: '',
                value: 'Storage Filter'
            }
        ]
        $scope.models = [
            {
                key: '',
                value: 'Model Filter'
            }
        ]
        $scope.conditions = [
            {
                key: '',
                value: 'Condition Filter'
            }
        ];

        var isObjectInArray = (obj, arr) => {
            return arr.some(function (element) {
                return angular.equals(element, obj);
            });
        }

        for (item of $rootScope.allItems) {
            if (item.name1 == $scope.name0
                && item.name2 == $scope.child
                && item.name3 == $scope.product) {
                $scope.item = item;
                if (item.products == null) return;
                for (prod of item.products) {
                    if (!isObjectInArray({ key: prod.carrier, value: prod.carrier }, $scope.carriers)) {
                        $scope.carriers.push({ key: prod.carrier, value: prod.carrier });
                    }
                    if (!isObjectInArray({ key: prod.color, value: prod.color }, $scope.colors)) {
                        $scope.colors.push({ key: prod.color, value: prod.color });
                    }
                    if (!isObjectInArray({ key: prod.model, value: prod.model }, $scope.models)) {
                        $scope.models.push({ key: prod.model, value: prod.model });
                    }
                    if (!isObjectInArray({ key: prod.condition, value: prod.condition }, $scope.conditions)) {
                        $scope.conditions.push({ key: prod.condition, value: prod.condition });
                    }
                    if (!isObjectInArray({ key: prod.storage, value: prod.storage }, $scope.storages)) {
                        $scope.storages.push({ key: prod.storage, value: prod.storage });
                    }
                }
                console.log(item);
                break;
            }
        }

        /*
        PAGINAITON
        */
        $scope.page = 1;
        $scope.limPage = 3;
        let midPage = Math.ceil($scope.limPage / 2);
        $scope.limItems = 10;
        $scope.start = ($scope.page - 1) * $scope.limItems;
        $scope.tempList = null;
        $scope.maxPage = Math.ceil($scope.item.products.length / $scope.limItems);
        $scope.tempList = $scope.item.products;
        $scope.pageList = [];

        var appendToPageList = () => {
            $scope.pageList = [];
            // console.log(maxPage);
            for (let i = 1; i <= $scope.maxPage; i++) {
                $scope.pageList.push(i);
            }
        }

        appendToPageList();

        $scope.setTempList = (arr) => {
            $scope.tempList = arr;
            console.log(arr);
            updatePagination();
        }

        var getStartPage = () => {
            let prev = ($scope.page - midPage < 0) ? 0 : ($scope.page - midPage);
            return ($scope.page >= $scope.maxPage)
                ? (($scope.maxPage - $scope.limPage < 0) ? 0 : $scope.maxPage - $scope.limPage)
                : prev;
        }

        $scope.startPage = getStartPage();

        var updatePagination = () => {
            $scope.page = 1;
            $scope.maxPage = Math.ceil($scope.tempList.length / $scope.limItems);

            appendToPageList();
            $scope.startPage = getStartPage();
            $scope.start = ($scope.page - 1) * $scope.limItems;
        }

        $scope.selectPage = (value) => {
            $scope.page = value;
            $scope.start = ($scope.page - 1) * $scope.limItems;
            $scope.startPage = getStartPage();
        }

        $scope.clearFilter = () => {
            $scope.selectedCarrier = '';
            $scope.selectedColor = '';
            $scope.selectedStorage = '';
            $scope.selectedModel = '';
            $scope.selectedCondition = '';
        }

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    })
    .controller("productDetailCtrl", function ($scope, $interval, $routeParams, $rootScope, $location) {

        $scope.name = $routeParams.name;
        $scope.child = $routeParams.child;
        $scope.product = $routeParams.product;
        $scope.code = $routeParams.code;

        $scope.prod = {};
        $scope.item = {};

        const loadItems = () => {
            for (item of $rootScope.allMiniItems) {
                if (item.code == $scope.code) {
                    $scope.prod = item;
                    break;
                }
            }
            console.log('error');
        }
        loadItems();

        // Set up $interval to call your function every 10 seconds
        // var intervalPromise = $interval(loadItems, 1000);

        // $scope.$on('$destroy', function () {
        //     $interval.cancel(intervalPromise);
        // });

        //comment
        $scope.replyTo = null;
        $scope.toWhom = null;
        $scope.content = '';

        $scope.setReplyTo = (id) => {
            $scope.replyTo = id;
            if (id === null) return;
            for (cmt of $scope.prod.discussion) {
                if (cmt.id == id) {
                    $scope.toWhom = cmt.name;
                    console.log($scope.toWhom);
                    return;
                }
            }
        }

        var generateRandomID = (length) => {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result = '';

            for (var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }

            return result;
        };

        $scope.postComment = function (content) {
            // console.log("Abc");
            // alert($scope.content);
            // angular.element(document.getElementById("textboxContent")).html("");

            if (!$rootScope.isLogin) {
                let check = confirm('You\ve not login yet? Login Now?');
                if (check) {
                    $rootScope.currentPath = '/category/' + $scope.name + '/' + $scope.child + '/' + $scope.product + '/' + $scope.code;
                    $location.path('/account');
                }
                return;
            }

            if (content.length == 0) {
                console.log(content);
                alert('please enter the content of your comment');
                return;
            }
            for (item of $rootScope.allMiniItems) {
                if (item.code == $scope.code) {
                    if (item.discussion == null) item.discussion = [];
                    if ($scope.replyTo == null) {
                        item.discussion.push({
                            id: generateRandomID(10),
                            name: $rootScope.user.firstName + " " + $rootScope.user.lastName,
                            avatar: 'anonymous.jpg',
                            content: content,
                            date: new Date(),
                            inner: []
                        })
                        // document.querySelector('#content').innerHTML = '';
                        $scope.content = "";
                        return;
                    }
                    for (cmt of item.discussion) {
                        if ($scope.replyTo == cmt.id) {
                            console.log(cmt.inner);
                            if (cmt.inner == null) {
                                cmt.inner = [];
                            }
                            cmt.inner.push({
                                id: $rootScope.user.email,
                                name: $rootScope.user.firstName + " " + $rootScope.user.lastName,
                                avatar: 'anonymous.jpg',
                                content: content,
                                date: new Date()
                            });
                            console.log(cmt.inner);
                            $scope.content = "";
                            // document.querySelector('#content').innerHTML = '';
                            return;
                        }
                    }
                }
            }
        }




    })







