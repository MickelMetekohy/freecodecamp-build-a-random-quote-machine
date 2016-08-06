"use strict";

(function($, window, document) {

    /**
     * set namespace quote machine
     */
    var qm = {};

    /**
     * variable options
     */
    qm.options = {
        'numberOfQuotes': 9,
        'delimeter': '---',
    }

    /**
     * initialize properties to keep track of state
     */
    qm.middleQuote = ((qm.options.numberOfQuotes - (qm.options.numberOfQuotes % 2)) / 2);
    qm.currentQuote = qm.middleQuote;
    qm.quoteCount = 0;

    /**
     * get the quotes from json file
     */
    // qm.getQuotes = function() {
    //     // if quotes exist remove them
    //     if ($('.quote-wrap').length) {
    //         this.removeQuotes();
    //         return;
    //     }
    //     // REMOTE
    //     $.ajax({
    //             type: 'GET',
    //             url: 'http://demikeison.com/fcc/qm/ajax.php'
    //         })
    //         .done(function(data) {
    //             // used always instead of done
    //             data = JSON.parse(data);
    //             qm.setRandomQuotes(data);
    //             console.log('done');
    //         })
    //         .fail(function() {
    //             qm.middleQuote = 0;
    //             qm.currentQuote = qm.middleQuote
    //             qm.options.numberOfQuotes = 1;
    //             qm.setRandomQuotes({
    //                 'quotes': [{
    //                     'id': 0,
    //                     'quote': 'You\'re out of luck, please try again later.',
    //                     'cite': 'Quote Machine'
    //                 }]
    //             });
    //             console.log('error, getJSON failed!');
    //         })
    //         .always(function() {
    //             // on completion run init method to detemine the state
    //             // of the buttons and move the current class
    //             qm.init();
    //             console.log('completed getJSON');
    //         });
    // }
    // LOCAL
    qm.getQuotes = function() {
        // if quotes exist remove them
        if ($('.quote-wrap').length) {
            this.removeQuotes();
            return;
        }
        $.getJSON('js/quotes.json', function(data) {
                //run random quotes method with the fetched data
                qm.setRandomQuotes(data);
            })
            .done(function() {
                // used always instead of done
            })
            .fail(function() {
                qm.middleQuote = 0;
                qm.currentQuote = qm.middleQuote
                qm.options.numberOfQuotes = 1;
                qm.setRandomQuotes({
                    'quotes': [{
                        'id': 0,
                        'quote': 'You\'re out of luck, please try again later.',
                        'cite': 'Quote Machine'
                    }]
                });
                console.log('error, getJSON failed!');
            })
            .always(function() {
                // on completion run init method to detemine the state
                // of the buttons and move the current class
                qm.init();
                console.log('completed getJSON');
            });
    }

    /**
     * get a random integer to load random quotes
     */
    qm.getRandomInt = function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * set random quotes
     */
    qm.setRandomQuotes = function(q) {
        // pick quotes based on random number
        var use = [];
        while (use.length < this.options.numberOfQuotes) {
            var random = this.getRandomInt(0, q.quotes.length);
            if (use.indexOf(random) === -1) {
                use.push(random);
            }
        }
        //determine the width of #content to accomodate the quotes
        $('#content').css({
            'width': 100 * this.options.numberOfQuotes + '%',
        });
        // foreach random quote load the data in quoteTemplate
        $.each(use, function(index, val) {
            qm.quoteCount++;
            qm.quoteTemplate(q.quotes[val], index);
        });
    }

    /**
     * quote template
     */
    qm.quoteTemplate = function(quote, index) {
        // set the color class
        var color = 'primary-color';
        if (this.quoteCount % 2 == 0) {
            color = 'secondary-color';
        }
        // format the quote
        var html = '';
        html += '<div data-quote="' + this.quoteCount + '" class="quote-wrap ' + color + '">';
        html += '<div class="quote">';
        html += '<blockquote><q>' + quote.quote + '</q> ' + this.options.delimeter + ' ';
        html += '<cite>' + quote.cite + '</cite>';
        html += '</blockquote>';
        html += '</div>';
        html += '</div>';
        // append the quote to #content in the dom
        $('#inner-content').append(html);
    }

    /**
     * remove quotes before loading new quotes
     */
    qm.removeQuotes = function() {
        // disable buttons
        $('.next, .prev, .tweet, .random').prop('disabled', true);
        $('.info input').prop("checked", true);
        // move the current quotes out of site before they are removed
        // then reset state properties and get new quotes
        $('#content').animate({
            'marginLeft': -100 * this.options.numberOfQuotes + '%',
        }, 1000, function() {
            $('.quote-wrap').remove();
            qm.quoteCount = 0;
            qm.currentQuote = qm.middleQuote;
            qm.getQuotes();
        });
    }

    /**
     * sets the middle quote as the default
     */
    qm.init = function(e) {
        $('.quote-wrap').removeClass('current');
        $('.next, .prev, .tweet, .random').prop('disabled', true);
        // add class current to currentQuote
        $('.quote-wrap[data-quote="' + (this.currentQuote + 1) + '"]').addClass('current');

        // center current quote
        $('#content').animate({
            'marginLeft': -100 * this.middleQuote + '%',
        }, 1000, function() {
            // sets the state of the buttons
            $('.tweet, .random').prop('disabled', false);
            if (qm.currentQuote == 0) {
                $('.prev').prop('disabled', true);
            }
            if (qm.currentQuote == qm.quoteCount - 1) {
                $('.next').prop('disabled', true);
            }
            if (qm.currentQuote > 0) {
                $('.prev').prop('disabled', false);
            }
            if (qm.currentQuote < qm.quoteCount - 1) {
                $('.next').prop('disabled', false);
            }
        });
        $('.info input').prop('checked', false);
    }

    /**
     * select previous quote
     * previous quote is selected by prepending the last quote
     */
    qm.prevQuote = function(e) {
        this.currentQuote -= 1;
        $('#inner-content').animate({
            marginLeft: '100'
        }, 500, function() {
            $('#inner-content').prepend($('#content .quote-wrap:last'))
                .animate({
                    marginLeft: '0'
                }, 300)
        });
        // run init method to detemine the state of the buttons
        // and move the current class
        this.init(e);
    }

    /**
     * select next quote
     * next quote is selected by appending the first quote
     */
    qm.nextQuote = function(e) {
        this.currentQuote += 1;
        $('#inner-content').animate({
            marginLeft: '-100'
        }, 500, function() {
            $('#inner-content').append($('#content .quote-wrap:first'))
                .animate({
                    marginLeft: '0'
                }, 200)
        });
        // run init method to detemine the state of the buttons
        // and move the current class
        this.init(e);
    }

    /**
     * tweet the current quote
     */
    qm.tweetQuote = function() {
        //get the current quoutes values
        var cbq = $('.current blockquote');
        var hashtags = 'FreeCodeCamp';
        var text = cbq.text();
        var url = 'http://twitter.com/intent/tweet?hashtags=' + hashtags + '&text=' + text;
        // create tweet popup
        window.open(url, 'popup', 'width=400, height=300');
    }

    /**
     * EVENTS
     */
    $(document).ready(function() {
        // on document ready
        qm.getQuotes();

        $('.random').on('click', function(e) {
            qm.getQuotes();
        });

        $('.prev').on('click', function(e) {
            qm.prevQuote(e);
        });

        $('.next').on('click', function(e) {
            qm.nextQuote(e);
        });

        $('.tweet').on('click', function(e) {
            qm.tweetQuote(e);
        });

        $('.exit').on('touchstart click', function(e) {
            $('.info input').prop('checked', false);
        });

    });

})(jQuery, window, document);
