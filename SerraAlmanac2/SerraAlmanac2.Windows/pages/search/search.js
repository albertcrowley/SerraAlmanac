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
            jQuery(".searchControl").change(this.runSearch);
            jQuery("#colorMode").click(this.colorModeClick);


            // stash a global copy of the search function
            WinJS.Namespace.define("SerraAlmanac", { runSearch: this.runSearch });
            WinJS.Namespace.define("SerraAlmanac", { cardClick: this.cardClick });


            // setup the listview click handler
            var listView = element.querySelector('#card-listview').winControl;
            listView.addEventListener("iteminvoked", this.cardClick, false);



        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
        colorModeClick: function() {
            var el = jQuery("#colorMode");
            if (el.attr("mode") == "any") {
                el.attr("mode", "all").html("All of these Colors");
            } else if (el.attr("mode") == "all") {
                el.attr("mode", "exactly").html("Exactly these Colors");
            } else {
                el.attr("mode", "any").html("Any of these Colors");
            }
            SerraAlmanac.runSearch();
        },
        cardClick: function (e) {
            e.detail.itemPromise.done(function (itemInvoked) {
                console.log (itemInvoked);
                var overlay = jQuery("#card-overlay");
                overlay.hide();
                overlay.find(".name").html(itemInvoked.data.name);
                overlay.find(".manaCost").html(itemInvoked.data.manaCost);
                overlay.find('.cardText').html(itemInvoked.data.text);
                overlay.find(".cardImage img").attr("src","http://mtgimage.com/multiverseid/" + itemInvoked.data.multiverseid + ".jpg")
                overlay.show();
            });
        },
        runSearch: function () {
            // empty the list
            SerraAlmanac.cardResults.splice(0, SerraAlmanac.cardResults.length);

            //setup worker
            var searchWorker = new Worker("js/searchWorker.js");
            searchWorker.onmessage = function (e) {
                if (e.data.event == "searchHit") {
                    _.each(e.data.payload, function (card) { SerraAlmanac.cardResults.push(card); })                    
                    jQuery(".numberHits").html(SerraAlmanac.cardResults.length + " results found.");
                    return;
                }
                if (e.data.event == "searchDone") {
                    jQuery(".spinner").html("Done.  " );
                    return;
                }
                if (e.data.event == "limitHit") {
                    jQuery(".spinner").html("Stopping search after "+e.data.payload+" cards found.");
                    return;
                }
            };


            //setup the search
            var search = {color:[], colorMode: jQuery("#colorMode").attr("mode"), set: []};
            jQuery(".colorCheckbox:checked").each(function () {
                search.color.push(jQuery(this).attr("value"));
            })

            if (jQuery("#selSet").val() != null && jQuery("#selSet").val() != "All Sets") {
                search.set.push(jQuery("#selSet").val());
            }


            searchWorker.postMessage({ cardDB: SerraAlmanac.cardDB, search: search });
            jQuery(".spinner").html("Working....");
            jQuery(".numberHits").html("");

            
        }
    });
})();
