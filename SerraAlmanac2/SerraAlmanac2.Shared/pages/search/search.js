// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511


(function () {
    "use strict";


    WinJS.UI.Pages.define("/pages/search/search.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            //load cards....
            var url = new Windows.Foundation.Uri("ms-appx:///data/AllSetsArray.json");
            Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                    var parsedObject = JSON.parse(text);
                    WinJS.Namespace.define("SerraAlmanac", { cardDB: parsedObject });

                    var html = "<option value='All Sets'>All Sets</option>";
                    for (var i = 0; i < parsedObject.length; i++) {
                        html += "<option value='" + parsedObject[i].name + "'>" + parsedObject[i].name + "</option>";
                    }

                    jQuery("#selSet").html(toStaticHTML(html));
                    // WinJS.Utilities.setInnerHTMLUnsafe(jQuery("#selSet")[0], html);
                    //jQuery("#selSet").select2();
                });
            });

            // bind the search controls
            jQuery("#selSet").change(this.runSearch);



            WinJS.UI.processAll();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
        runSearch: function () {
            var matches = SerraAlmanac.cardDB;
            if (jQuery("#selSet").val() !== null && jQuery("#selSet").val() !== "All Sets") {
                matches = _.where(matches, { name: jQuery("#selSet").val() })
            }

            var cardResults = [];
            _.each(matches, function (set) {
                _.each(set.cards, function (card) {
                    cardResults.push(card);
                    SerraAlmanac.cardResults.push(card);

                })
            });
            
//            SerraAlmanac.cardResults.notifyReload();
/*            var list = new WinJS.Binding.List(cardResults)
            WinJS.Namespace.define("SerraAlmanac", { cardResults: list });

            var listview = document.getElementById("card-listview").winControl;
            listview.forceLayout();
*/
        }
    });
})();
