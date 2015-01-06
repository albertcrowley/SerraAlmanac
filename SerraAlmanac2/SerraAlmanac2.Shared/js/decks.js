(function () {
    var deckManager = {
        DECK_FILE_NAME : "deck_info.json",
        decks: {},
        init: function () {
            // load any local save data
            var existPromise = WinJS.Application.local.exists(this.DECK_FILE_NAME);
            existPromise.then(function (exists){
                if (exists) {
                    this.decks = JSON.parse(WinJS.Application.local.readText(this.DECK_FILE_NAME));
                }   
            });
        },
        populateDeckDropdown: function (element) {
            element.append($("<option></option").attr("value", "_serraalmanac_blank").text(""));
            element.append($("<option></option").attr("value", "_serraalmanac_new_deck").text("New Deck"));
            element.append($("<option></option").attr("value", "fake").text("Fake Deck"));
        }
        
    };
    
    deckManager.init();
    WinJS.Namespace.define("SerraAlmanac", { deckManager: deckManager });

})();

console.log("here");