// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            function menuInvoke(eventObject) {
                eventObject.detail.itemPromise.done;
                var item = Data.items.getAt(eventObject.detail.itemIndex);

                WinJS.Navigation.navigate(SerraAlmanac.menuList.getItem(eventObject.detail.itemIndex).data.click , { item: Data.getItemReference(item) });
            }


            var listView = element.querySelector('#menu-listview').winControl;
            listView.addEventListener("iteminvoked", menuInvoke, false);           

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
