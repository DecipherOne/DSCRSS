"use strict";

(function DailySchedule(window,$){

    var pageLinkBoxOffice = null,
        pageLinkFounders = null,
        pageLinkJDAT = null,
        pageLinkStar = null,
        pageLinkAll = null,
        pageLinkTools = null;

    $(document).ready(function()
    {
        InitializeLocalReferences(function(){

            $(pageLinkBoxOffice).click(function(){
                GetDailySchedule(0,0,0,'"Box Office"');
            });

            $(pageLinkFounders).click(function(){
                GetDailySchedule(0,0,0,'"Founders Hall"');
            });

            $(pageLinkJDAT).click(function(){
                GetDailySchedule(0,0,0,'"JDAT"');
            });

            $(pageLinkStar).click(function(){
                GetDailySchedule(0,0,0,'"Star Theater"');
            });

            $(pageLinkAll).click(function(){
                GetDailySchedule(0,0,0,'" "');
            });

            $(pageLinkTools).click(function(){
                NavigateToToolPage();
            });
        });
    });

    function InitializeLocalReferences(callback)
    {
        pageLinkBoxOffice = $("#pageLinkBoxOffice");
        pageLinkFounders = $("#pageLinkFoundersHall");
        pageLinkJDAT = $("#pageLinkJDAT");
        pageLinkStar = $("#pageLinkStar");
        pageLinkAll = $("#pageLinkAll"),
        pageLinkTools = $("#pageLinkTools");

        return callback();
    }

    function GetDailySchedule(day, month, year, screen)
    {
        var payload = BuildRequestPayload(day,month,year,screen),
            url = "_serverSide/readDailySchedule.php?day="+ payload["day"] +"&month=" +
                payload["month"] + "&year=" + payload["year"] + "&screen=" + payload["screen"];

        window.open(url,"_blank");
    }

    function NavigateToToolPage()
    {
        var url = "tools/";

        window.open(url,"_blank");

    }

    function BuildRequestPayload(day,month,year,screen)
    {
        var date = new Date();
        if(day === 0|| month === 0 || year === 0)
        {
            day = date.getDate();
            month = date.getMonth()+1;
            year = date.getFullYear();
        }

        return {day:day, month:month, year:year, screen:screen};
    }

})(window, jQuery = window.jQuery || {} );