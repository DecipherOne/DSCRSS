"use strict";

(function DailySchedule(window,$){

    var pageLinkBoxOffice = null,
        pageLinkFounders = null,
        pageLinkJDAT = null,
        pageLinkStar = null,
        pageLinkAll = null,
        pageLinkTools = null,
        scheduleCurrentTime = null,
        todaysEvents = null,
        comingAttractionsScrollArea = null,
        scrollAreaHeight = null;

    $(document).ready(function()
    {
        InitializeLocalReferences(function(){
            InitializeNavigationClickEvents();
            InitializeScheduleClock();
            scrollAreaHeight = 1;
            setInterval(ScrollComingAttractions,50);
        });
    });

    function InitializeScheduleClock()
    {
        if(scheduleCurrentTime!==null && scheduleCurrentTime !== undefined)
            setInterval(function(){
                $(scheduleCurrentTime).html('<h2>' + GetCurrentTime() + '</h2>');
            },100);
    }

    function InitializeLocalReferences(callback)
    {
        pageLinkBoxOffice = $("#pageLinkBoxOffice");
        pageLinkFounders = $("#pageLinkFoundersHall");
        pageLinkJDAT = $("#pageLinkJDAT");
        pageLinkStar = $("#pageLinkStar");
        pageLinkAll = $("#pageLinkAll"),
        pageLinkTools = $("#pageLinkTools");
        scheduleCurrentTime = $("#scheduleCurrentTime");
        todaysEvents = $(".scheduleCalendarEntry");
        comingAttractionsScrollArea = $("#comingAttractionsScrollArea");
        return callback();
    }

    function InitializeNavigationClickEvents()
    {
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
    }

    function GetDailySchedule(day, month, year, screen)
    {
        var payload = {day:day, month:month, year:year, screen:screen},
            url = "_serverSide/readDailySchedule.php?day="+ payload["day"] +"&month=" +
                payload["month"] + "&year=" + payload["year"] + "&screen=" + payload["screen"];

        window.open(url,"_blank");
    }

    function NavigateToToolPage()
    {
        var url = "tools/";
        window.open(url,"_blank");
    }

    function GetCurrentTime()
    {
        var dateTime = new Date(),
            dayName = null,
            convertedHoursString = _24HoursTo12(dateTime),
            convertedMinutesString = PrependZeroToTimeValue(dateTime.getMinutes()),
            convertedSecondsString = PrependZeroToTimeValue(dateTime.getSeconds()),
            convertedMonthString = dateTime.getMonth() + 1,
            dateTimeString = convertedMonthString + "/" + dateTime.getDate() + "/" +
                dateTime.getFullYear()+ " " + convertedHoursString + ":" +
                convertedMinutesString + ":" + convertedSecondsString;

        if(dateTime.getHours().valueOf()>11)
            dateTimeString += "pm";
        else
            dateTimeString += "am";

        dayName = dateTime.getDay();
        dayName = GetDayNameString(dayName);
        return dayName + " " + dateTimeString;
    };

    function _24HoursTo12(dateTime)
    {
        var hours = dateTime.getHours().valueOf();
        if(hours>12)
            return hours - 12;
        else if(hours==0)
            return 12;
        else
            return hours;
    }

    function PrependZeroToTimeValue(dateTime)
    {
        var timeDenomination = dateTime.valueOf();
        if(timeDenomination<10)
            return '0'+timeDenomination.toString();
        else
            return timeDenomination;
    }

    function GetDayNameString(dayIndex)
    {
        switch(dayIndex)
        {
            case 0:
            {
                return "Sunday";
                break;
            }
            case 1:
            {
                return "Monday";
                break;
            }
            case 2:
            {
                return "Tuesday";
                break;
            }
            case 3:
            {
                return "Wednesday";
                break;
            }
            case 4:
            {
                return "Thursday";
                break;
            }
            case 5:
            {
                return "Friday";
                break;
            }
            case 6:
            {
                return "Saturday";
                break;
            }
        }
    }

    function PushCurrentEventToHeader()
    {

    }

    function GetEventsDataFromDom()
    {

    }

    function ScrollComingAttractions()
    {

        if(todaysEvents === null && todaysEvents === undefined)
            return;

        scrollAreaHeight -=  1;
       for(var i=0; i < todaysEvents.length; i++)
        {

            $(todaysEvents[i]).css("top", scrollAreaHeight);
          /*  var val = toInteger($(todaysEvents[i]).data("index")),
                topBounds =  val * 100,
                bottomBounds = $("#comingAttractionsScrollArea").outerHeight();
            if($(todaysEvents[i]).position().top > topBounds)
                $(todaysEvents[i]).css("top", bottomBounds);*/
        }



    }

})(window, jQuery = window.jQuery || {} );