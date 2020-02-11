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
        scrollAreaHeight = null,
        currentPresentation = null,
        nextPresentation = null,
        numberOfVisibleEvents = 0,
        previouslyPassedIndex = null;

    $(document).ready(function()
    {
        InitializeLocalReferences(function(){
            InitializeNavigationClickEvents();
            InitializeScheduleClock();
            scrollAreaHeight = 320;
            ParseEventsForNowShowingAndUpNext();
            setInterval(ScrollComingAttractions,60);
            setInterval(ParseEventsForNowShowingAndUpNext,1000);
        });
    });

    function InitializeScheduleClock()
    {
        if(scheduleCurrentTime!==null && scheduleCurrentTime !== undefined)
            setInterval(function(){
                $(scheduleCurrentTime).html('<h2>' + GetCurrentDayNameDateAndTime() + '</h2>');
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
        numberOfVisibleEvents = todaysEvents.length;
        comingAttractionsScrollArea = $("#comingAttractionsScrollArea");
        currentPresentation = $("#currentPresentation");
        nextPresentation = $("#nextPresentation");

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

    function GetCurrentDayNameDateAndTime()
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
            dateTimeString += " pm";
        else
            dateTimeString += " am";

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

    function ParseEventsForNowShowingAndUpNext()
    {

        var timeString = GetHourMinuteTimeString(),
            eventStartTime = null,
            eventEndTime = null,
            convertedEventStartTime = null,
            convertedEventEndTime = null,
            eventTitle = null,
            eventLocation = null,
            currentEventIndex = 0,
            setCurrentEvent = false;


        for(var i=0; i< todaysEvents.length; i++)
        {
            eventStartTime = $(todaysEvents[i]).children(".entryGroupStartTime").children(".presentationEntry").html();
            eventEndTime = $(todaysEvents[i]).children(".entryGroupEndTime").children(".presentationEntry").html();
            eventTitle = $(todaysEvents[i]).children(".entryGroupTitle").children(".presentationEntry").html();
            eventLocation = $(todaysEvents[i]).children(".entryGroupLocation").children(".presentationEntry").html();

            convertedEventStartTime = Convert12HourTo24Hour(eventStartTime);
            convertedEventEndTime = Convert12HourTo24Hour(eventEndTime);

            var date = new Date(),
                dateString = date.getFullYear() + "-" + (parseInt(date.getMonth())+1) + "-" + date.getDate();

            var eventStartTimeStamp = Date.parse(dateString + " " + convertedEventStartTime),
                eventEndTimeStamp = Date.parse(dateString + " " + convertedEventEndTime),
                currentTimeStamp = Date.parse(dateString + " " + timeString);


            if(currentTimeStamp >= eventStartTimeStamp  && currentTimeStamp <= eventEndTimeStamp && !$(todaysEvents[i]).hasClass("hidden"))
            {
                $(currentPresentation).children(".entryGroupTitle").children(".presentationEntry").html(eventTitle);
                $(currentPresentation).children(".entryGroupLocation").children(".presentationEntry").html(eventLocation);
                $(currentPresentation).children(".entryGroupEndTime").children(".presentationEntry").html(eventEndTime);

                $(todaysEvents[i]).addClass("hidden");
                numberOfVisibleEvents -=1;
                setCurrentEvent = true;
                currentEventIndex = i;
                break;
            }
            else if(currentTimeStamp > eventStartTimeStamp   &&  currentTimeStamp > eventEndTimeStamp)
            {
                if($(todaysEvents[i]).hasClass("hidden"))
                    continue;
                $(todaysEvents[i]).addClass("hidden");
                numberOfVisibleEvents -=1;
            }
        }

        if(!setCurrentEvent)
            currentEventIndex = todaysEvents.length - numberOfVisibleEvents -1;

        SetNextEventData(currentEventIndex);
    }

    function SetNextEventData(index)
    {
        if(index === previouslyPassedIndex)
            return;

        var startTime = $(todaysEvents[index+1]).children(".entryGroupStartTime").children(".presentationEntry").html(),
            title = $(todaysEvents[index+1]).children(".entryGroupTitle").children(".presentationEntry").html(),
            location = $(todaysEvents[index+1]).children(".entryGroupLocation").children(".presentationEntry").html();

        $(nextPresentation).children(".entryGroupTitle").children(".presentationEntry").html(title);
        $(nextPresentation).children(".entryGroupLocation").children(".presentationEntry").html(location);
        $(nextPresentation).children(".entryGroupStartTime").children(".presentationEntry").html(startTime);

        previouslyPassedIndex = index;
    }


    function GetHourMinuteTimeString()
    {
        var currentTime = new Date(),
            convertedHoursString = currentTime.getHours(),
            convertedMinutesString = PrependZeroToTimeValue(currentTime.getMinutes()),
            timeString = convertedHoursString+":"+convertedMinutesString;


        return timeString;
    }

    function Convert12HourTo24Hour(hours)
    {
        var meridiem = hours.replace(/ /g,''),
            convertedTimeString = hours.replace(/ /g,''),
            convertedHours = 0,
            storedMinutes = 0;

        convertedTimeString = convertedTimeString.substring(0,convertedTimeString.length -2);
        meridiem = meridiem.substring(meridiem.length -2, meridiem.length);

        if(meridiem === "pm")
        {
            convertedHours = convertedTimeString.substring(0,convertedTimeString.indexOf(":"));
            storedMinutes = convertedTimeString.substring(convertedTimeString.indexOf(":"),convertedTimeString.length);
            if(convertedHours !== "12")
                convertedHours = parseInt(convertedHours) + 12;
            convertedTimeString = convertedHours + storedMinutes;
        }

        return convertedTimeString;

    }


    function ScrollComingAttractions()
    {
        var topBounds  = $(comingAttractionsScrollArea).offset().top,
        bottomBounds = 0,
        eventDivBounds = null;

        if(todaysEvents === null && todaysEvents === undefined || numberOfVisibleEvents===1)
            return;

        scrollAreaHeight -=  0.6;

        for(var i=0; i < todaysEvents.length; i++)
        {
            if($(todaysEvents[i]).hasClass("hidden"))
                continue;

            bottomBounds = 400 + (100 * i);

            if(i===0)
                eventDivBounds = $(todaysEvents[i]).offset().top + 100;
            else
                eventDivBounds = $(todaysEvents[i]).offset().top + (100*i);

            if(eventDivBounds < topBounds)
            {
                $(todaysEvents[i]).css("top", bottomBounds);

                if(i >= (numberOfVisibleEvents/2)&& numberOfVisibleEvents >= 3)
                    if(i===0)
                        scrollAreaHeight = 320;
                    else
                        scrollAreaHeight = 320 + (i*10);
                else if(numberOfVisibleEvents < 3)
                    scrollAreaHeight = -10;
            }
            else
                $(todaysEvents[i]).css("top", scrollAreaHeight);

        }
    }

})(window, jQuery = window.jQuery || {} );