// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/life/life.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            function resizeLayout() {
                var viewbox = document.getElementById("viewbox");
                var w = window.innerWidth;
                var h = window.innerHeight;
                var bw = viewbox.clientWidth;
                var bh = viewbox.clientHeight;
                var wRatio = w / bw;
                var hRatio = h / bh;
                var mRatio = Math.min(wRatio, hRatio);
                var transX = Math.abs(w - (bw * mRatio)) / 2;
                var transY = Math.abs(h - (bh * mRatio)) / 2;
                viewbox.style["transform"] = "translate(" + transX + "px, " + transY + "px) scale(" + mRatio + ")";
                viewbox.style["transform-origin"] = "top left";
            }
            
            window.onresize = resizeLayout;
            SerraAlmanac.counter.init();
            SerraAlmanac.counter.updateScores();

            },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });


    var counter = {
        life: [],
        name: [],
        playerCount: 2,
        init: function () {
            this.life = [];
            for (var i = 1; i < this.playerCount+1; i++) {
                this.life[i] = 20;
                this.name[i] = "Player" + i;
            }
            jQuery(".lifeButton").click(this.lifeChangeButton);

            // setup player buttons
            jQuery(".lifeName").each(function () {
                var player = jQuery(this).parent().attr("player");
                jQuery(this).click(function () { SerraAlmanac.counter.getName(player, jQuery(this)) });
            });
            jQuery("#btnDoneName").click(function () {
                var innerPlayer = jQuery("#myFlyOut").attr("player");
                var n = jQuery("#txtName").val();
                SerraAlmanac.counter.name[innerPlayer] = n;
                SerraAlmanac.counter.updateScores();
                var myFlyout = document.getElementById("myFlyOut").winControl;
                myFlyout.hide();
            });
            jQuery("#txtName").bind('keypress', function (e) {
                if (e.keyCode == 13) {
                    jQuery("#btnDoneName").click();
                }
            })

        },
        getName : function(player, element) {
            jQuery("#myFlyOut").attr("player", player);
            jQuery("#txtName").val(element.text());
            var myFlyout = document.getElementById("myFlyOut").winControl;
            myFlyout.show(element[0], "top", "right");
        },
        updateScores: function () {
            for (var i = 1; i < this.playerCount+1; i++) {
                jQuery(".life" + i + " .lifeLife").text(this.life[i]);
                jQuery("div[player=" + i + "] .lifeName").text(this.name[i]);
            }
        },
        lifeChangeButton: function () {
            var element = jQuery(this);
            var player = element.attr("player");
            var delta = element.attr("delta");
            SerraAlmanac.counter.life[player] += parseInt(delta, 10);
            SerraAlmanac.counter.updateScores();
        }

    }

    WinJS.Namespace.define("SerraAlmanac", { counter : counter });


})();
