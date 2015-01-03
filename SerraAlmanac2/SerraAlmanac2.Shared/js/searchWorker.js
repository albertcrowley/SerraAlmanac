/// <reference group="Dedicated Worker" />



onmessage = function (event) {
    self.importScripts("/js/underscore.js");

    var matches = event.data.cardDB;
    var search = event.data.search;
    var hits = 0;
    var limitHit = false;
    var BATCH_SIZE = 5;
    var HIT_LIMIT = 1000;

    var dupeList = {};

    // search sets
    if (search.set.length > 0) {
        matches = _.where(matches, { name: search.set[0] })
    }

    var colors = search.color;
    var numColorMatches = search.colorMode == "any" ? 1 : search.color.length;

    var cardResults = [];
    _.each(matches, function (set) {
        if (hits > HIT_LIMIT) { limitHit = true;  return; }
        _.each(set.cards, function (card) {
            if (hits > HIT_LIMIT) { limitHit = true; return;}

            if (colors.length > 0) {
                var colorMatchCount = _.intersection(colors, card.colors).length;
                if (colorMatchCount < numColorMatches) {
                    //no color match!
                    return;
                }
                if (search.colorMode == "exactly" && colors.length != card.colors.length) {
                    return;
                }
            }

            if (dupeList[card.name] != true) {
                card.imageuri = "http://mtgimage.com/multiverseid/" + card.multiverseid + ".jpg";
                cardResults.push(card);
                hits++;
                dupeList[card.name] = true;;
            }

            if (cardResults.length > BATCH_SIZE) {
                postMessage({ event: "searchHit", payload: cardResults });
                cardResults = [];
                BATCH_SIZE = Math.ceil(BATCH_SIZE * 1.5);
            }
        })
    });
    postMessage({ event: "searchHit", payload: cardResults });
    if (limitHit) {
        postMessage({ event: "limitHit", payload: hits });
    } else {
        postMessage({ event: "searchDone", payload: hits });
    }

            
    console.log("Found "+hits+" matches in search for:");
    console.log(search);
}
