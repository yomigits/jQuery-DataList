/*
jQuery datalist plugin
*/
(function($) {
    //Global variables & Constants
    var CONST_ALPHABET = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];
    var CONST_OPTION_ALL = 'OptionAll';
    var CONST_OPTION_NUMBERS = 'OptionNumbers';
    var CONST_EVENT_TYPE_TOUCH = 'touchstart';
    var CONST_EVENT_TYPE_CLICK = 'click';
    var CONST_EVENT_TYPE_SEARCH = 'keyup';


    $.fn.datalist = function(options) {

        //set options
        var _options = $.extend({}, $.fn.datalist.defaults, options);

        //For now we'll deal with only one list at a time, so this will have to be called on each of the list
        var $list = $(this),
            id = this[0].id,
            $container,
            $navigation,
            $searchContol,
            currentNavigationItem = '',
            currentSearchItem = '';

        // set/create the parent/reference container
        if (!$('#' + id + '-datalist').length) {
            $('<div id="' + id + '-datalist" class="datalist"/>').insertBefore($list);
        }

        $container = $('#' + id + '-datalist');

        $container.append(CreateNavigationMarkup());

        //set the navigation
        $navigation = $('.btn-group.navigation', $container);

        initialize();

        //enable/disable the navigation elements based on content 
        //set appropriate bindings for the elements 
        function initialize() {

            //iterate through the list re-enabling the navigation options based on the value in the list
            $list.children().each(function() {
                if (this.innerText.length > 0) {
                    var firstLetter = this.innerText[0].toLowerCase();
                    //Enable the letter in navigation
                    if (CONST_ALPHABET.indexOf(firstLetter) > -1) {
                        $('button[type=button][value="' + firstLetter + '"]').removeAttr('disabled');
                        $(this).addClass(firstLetter);
                    }
                }
            });

            //Bind elements
            $('button', $navigation).bind(CONST_EVENT_TYPE_CLICK, function(e) {
                e.preventDefault();
                var $this = $(this),
                    letterSelection = $this.val();

                if (currentNavigationItem !== letterSelection) {
                    if (letterSelection === CONST_OPTION_ALL) {
                        $list.children().show();
                    } else {
                        $list.children().hide().each(function() {
                            if ($(this).hasClass(letterSelection)) {
                                $(this).show()
                            }

                        });
                    }
                }
            });
        }


        //fill the navigation list
        function CreateNavigationMarkup() {
            //TODO we need to do something a little better here in the future to avoid performance bottlenecks
            //Concatenating html markup as strings is not really a good practice.
            //Perhaps we can look into the jQuery template

            var markup = '';

            //include option for All
            if (_options.optionAll) {
                markup += '<button type="button" class="btn btn-default" value="' + CONST_OPTION_ALL + '">All</button>'

            }

            //Include numbers
            if (_options.optionNums) {
                markup += '<button type="button" class="btn btn-default" value="' + CONST_OPTION_NUMBERS + '" disabled="disabled">0-9</button>'
            }

            //Build the remaining list
            for (var i = 1; i < CONST_ALPHABET.length; i++) {
                markup += '<button type="button" class="btn btn-default" value="' + CONST_ALPHABET[i] + '" disabled="disabled">' + CONST_ALPHABET[i] + '</button>'
            }

            return '<div class="btn-group block navigation">' + markup + '</div>'
        }

        //set the individual item classes & remove items not needed
    };

    $.fn.datalist.defaults = {
        initLetter: '',
        optionAll: true,
        optionOther: false,
        optionNums: true,
        removeDisabled: false,
        notFoundText: 'No matching entries found',
        searchControlName: ''
    };
})(jQuery);