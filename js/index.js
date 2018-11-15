"use strict";

(function() {
    /**
     * set namespace quote machine
     */
    const qm = {};

    /**
     * state
     */
    qm.state = {
        quotes: false,
        currentQuote: false,
    };

    /**
     * get a random integer to load random quotes
     */
    qm.getRandomInt = function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    /**
     * fetch the quotes
     */
    qm.fetchQuote = () => {
       const fetchQuotePromise = fetch(`https://s3.amazonaws.com/web-1665/freecodecamp/quotes.json`);
       fetchQuotePromise
        .then(data => data.json())
        .then(data => qm.state.quotes = data)
        .then(() => qm.renderQuote(qm.state.quotes))
        .catch(err => console.log(err))
    };
    qm.fetchQuote();

    /**
     * render quote from qm.quotes
     */
    qm.renderQuote = (data) => {
        const {quotes} = data;
        const pickQuote = qm.getRandomInt(0, quotes.length);
        if(quotes.length !== 1 && pickQuote === qm.state.currentQuote) qm.renderQuote();
        const randomQuote = quotes[pickQuote];
        document.getElementById('text').textContent = randomQuote.quote;
        document.getElementById('author').textContent = randomQuote.cite;
        qm.createTweetLink('FreeCodeCamp', `${randomQuote.quote} — ${randomQuote.cite}`);
    };

    /**
     * tweet
     */
    qm.createTweetLink = (hashtags, text) => {
        //get the current quoutes values
        const url = 'https://twitter.com/intent/tweet?hashtags=' + hashtags + '&text=' + text;
        document.getElementById('tweet-quote').href = url;
    };
    qm.tweetQuote = () => window.open(document.getElementById('tweet-quote').href, 'popup', 'width=400, height=300');

    /**
     * Events
     */
    // render new quote
    document.getElementById('new-quote').addEventListener('click', e => qm.renderQuote(qm.state.quotes));

    // tweet quote
    document.getElementById('tweet-quote').addEventListener('click', e => {
        e.preventDefault();
        qm.tweetQuote();
    });

    // toggle info
    Array.from(document.querySelectorAll('.exit'))[0].addEventListener('click', e => {
        Array.from(document.querySelectorAll('.info input'))[0].checked = false;
    });

})();