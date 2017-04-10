angApp.
controller('GalleryCtrl', function($scope) {
    var list = [
                {
                    name: 'Gold',
                    symbol: 'Au',
                    number: '79',
                    weight: '196.966569',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Antimony',
                    symbol: 'Sb',
                    number: '51',
                    weight: '121.76',
                    css: 'metalloid',
                    category: 'metalloid'
                },
                {
                    name: 'Mercury',
                    symbol: 'Hg',
                    number: '80',
                    weight: '200.59',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Tellurium',
                    symbol: 'Te',
                    number: '52',
                    weight: '127.6',
                    css: 'metalloid',
                    category: 'metalloid'
                },
                {
                    name: 'Bismuth',
                    symbol: 'Bi',
                    number: '83',
                    weight: '208.980',
                    css: 'post-transition metal',
                    category: 'post-transition'
                },
                {
                    name: 'Lead',
                    symbol: 'Pb',
                    number: '82',
                    weight: '207.2',
                    css: 'post-transition metal',
                    category: 'post-transition'
                },
                {
                    name: 'Gold',
                    symbol: 'Au',
                    number: '79',
                    weight: '196.967',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Potassium',
                    symbol: 'K',
                    number: '19',
                    weight: '39.0983',
                    css: 'alkali metal',
                    category: 'alkali'
                },
                {
                    name: 'Sodium',
                    symbol: 'Na',
                    number: '11',
                    weight: '22.99',
                    css: 'alkali metal',
                    category: 'alkali'
                },
                {
                    name: 'Cadmium',
                    symbol: 'Cd',
                    number: '48',
                    weight: '112.411',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Calcium',
                    symbol: 'Ca',
                    number: '20',
                    weight: '40.078',
                    css: 'alkaline-earth metal',
                    category: 'alkaline-earth'
                },
                {
                    name: 'Rhenium',
                    symbol: 'Re',
                    number: '75',
                    weight: '186.207',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Thallium',
                    symbol: 'Tl',
                    number: '81',
                    weight: '204.383',
                    css: 'post-transition metal',
                    category: 'post-transition'
                },
                {
                    name: 'Antimony',
                    symbol: 'Sb',
                    number: '51',
                    weight: '121.76',
                    css: 'metalloid',
                    category: 'metalloid'
                },
                {
                    name: 'Cobalt',
                    symbol: 'Co',
                    number: '27',
                    weight: '58.933',
                    css: 'transition metal',
                    category: 'transition'
                },
                {
                    name: 'Ytterbium',
                    symbol: 'Yb',
                    number: '70',
                    weight: '173.054',
                    css: 'lanthanoid metal inner-transition',
                    category: 'lanthanoid'
                },
                {
                    name: 'Argon',
                    symbol: 'Ar',
                    number: '18',
                    weight: '39.948',
                    css: 'noble-gas nonmetal',
                    category: 'noble-gas'
                },
                {
                    name: 'Nitrogen',
                    symbol: 'N',
                    number: '7',
                    weight: '14.007',
                    css: 'diatomic nonmetal',
                    category: 'diatomic'
                },
                {
                    name: 'Uranium',
                    symbol: 'U',
                    number: '92',
                    weight: '238.029',
                    css: 'actinoid metal inner-transition',
                    category: 'actinoid'
                },
                {
                    name: 'Plutonium',
                    symbol: 'Pu',
                    number: '94',
                    weight: '(244)',
                    css: 'actinoid metal inner-transition',
                    category: 'actinoid'
                }
            ];
            $scope.elementsList = angular.copy(list);
            var types = [
                'post-transition metal',
                'transition metal',
                'metalloid',
                'alkali metal',
                'alkaline-earth metal',
                'lanthanoid metal inner-transition',
                'noble-gas nonmetal'
            ];
            $scope.add = function() {
                var css = types[Math.floor(Math.random()*types.length)];
                var newelement = {
                    name: Math.random().toString(36).substring(7),
                    symbol: Math.random().toString(36).substring(16),
                    number: '95',
                    weight: (Math.random() * 10).toFixed(4),
                    css: css,
                    category: 'lanthanoid'
                };
                $scope.elementsList.push(newelement);
            }
            $scope.clear = function() {
                $scope.elementsList = [];
            }
            $scope.reset = function() {
                $scope.elementsList = angular.copy(list);
            }     

});