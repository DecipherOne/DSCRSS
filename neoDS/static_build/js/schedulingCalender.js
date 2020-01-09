"use strict";

(function SchedulingCalendar(window,$){

    var dayNumberSpans = null,
    calendarEl = null,
    calendar = null,
    nodeBuffer = null,
    fullCalendarButton = null,
    noEventMarkers = null,
    pastEventMarkers = null,
    scheduledEventMarkers = null,
    dateSelect = null,
    firstOfMonth = null,
    currentYear = null,
    currentMonth = null,
    currentDay = null,
    presentationsQueryResponse = null,
    scheduleTablesQueryResponse = null,
    todaysDate = null,
    predefinedPresentationNode = null,
    presentationEntryContainer = null,
    presentationNumberSpan = null;

    $(document).ready(function() {

        InitializePredefinedPresentationNode();
        InitializeTodaysDate();
        InitializeCalendar();
        if(!calendarEl)
            return console.log("Error: Could not create Calendar : schedulingCalendar.js");

        calendar.render();
        presentationEntryContainer = $('#presentationEntryContainer');
        presentationNumberSpan = $('#presentationNumberSpan');
        CheckDatabaseForMonthlyEvents();
        fullCalendarButton = document.getElementsByClassName('fc-button');
        $(fullCalendarButton).click(function(e){
            CheckDatabaseForMonthlyEvents(e);
        });
    });

    function InitializePredefinedPresentationNode()
    {
        var topControls = "<span class='deletePresentationEntry left'><span class='controlLabel'>-</span></span><span class='modifyPresentationEntry left'><span class='controlLabel'>Y</span></span>";
        var selects = '<select  class="schedulingToolSelect left startTimeSelect" ><option selected="">Start Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left endTimeSelect" ><option selected="">End Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left titleSelect" ><option selected="">Presentation Title</option></select>';
        selects +=  '<select  class="schedulingToolSelect left locationSelect"><option selected="">Location</option></select>';
        selects +=  '<select  class="schedulingToolSelect left presenterSelect"><option selected="">Presenter</option></select>';
        selects +=  '<select  class="schedulingToolSelect left deploymentLocationSelect"><option selected="">Screen Location</option></select>';
        predefinedPresentationNode = topControls + selects;
    }

    function InitializeTodaysDate()
    {
        todaysDate = new Date();
        currentDay = todaysDate.getDate().toString();
        todaysDate = todaysDate.getFullYear() + "-" + ParseMonthIndex(todaysDate.getMonth()) +
            "-"+todaysDate.getDate();

    }

    function InitiatlizeEventMarkers(callback)
    {
        noEventMarkers = $('.noEventCircleMarker');
        pastEventMarkers = $('.archivedEventCircleMarker');
        scheduledEventMarkers = $('.scheduledEventCircleMarker'),
        dateSelect = $('#schedulingToolDateSelect');

        if(callback)
            return callback();
    }


    function InitializeCalendar()
    {
        calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'dayGrid'],
            showNonCurrentDates:false
        });
    }

    function RetrievePresentationsFromDataStore(callback)
    {
        firstOfMonth = $("span").filter(function() { return ($(this).text() === '1') });
        firstOfMonth = $(firstOfMonth).parent().attr("data-date");
        currentYear = firstOfMonth.substring(0,4);
        currentMonth = firstOfMonth.substring(5,7);

        presentationsQueryResponse = GetMonthlySchedule(currentMonth,currentYear,function(response){
            return callback(response);
        });
    }

    function RetrieveScheduleTablesFromDataStore(callback)
    {
        scheduleTablesQueryResponse = GetScheduleTables(function()
        {
            return callback();
        });
    }

    function ScheduledDateHasPassed(dateA, dateB)
    {
        if(dateA ==='' && dateB === '')
            return false;

        var dateObjectA = new Date(dateA + " 12:00:00"),
        dateObjectB = new Date(dateB + " 12:00:00");

        dateObjectA = dateObjectA.getTime();
        dateObjectB = dateObjectB.getTime();

        if(dateObjectB > dateObjectA)
            return false;

        return true;

    }


    function GetScheduleLabelsAndPopulateSelects()
    {
        RetrieveScheduleTablesFromDataStore(function(){

        });
    }

    function CheckDatabaseForMonthlyEvents()
    {
        dayNumberSpans = $('.fc-day-number').filter(':parents(.fc-past-month)')
            .filter(':parents(.fc-other-month)').filter(':parents(.fc-future-month)');



        RetrievePresentationsFromDataStore(function(presentationsQueryResponse ){

            var comparisonDateString = null,
                previouslyScheduledEvent = null,
                selectedDayString = null;

            for (var c = 0; c <= dayNumberSpans.length; c++)
            {
                if(presentationsQueryResponse.length >= 1)
                {
                    var foundMatch = false;
                    for(var i=0; i < presentationsQueryResponse.length; i++)
                    {
                        comparisonDateString = currentYear + "-" + currentMonth + "-" + $(dayNumberSpans[c]).html(),
                            selectedDayString = $(dayNumberSpans[c]).html();
                        previouslyScheduledEvent =  ScheduledDateHasPassed(presentationsQueryResponse[i]['scheduledDate'],comparisonDateString);

                        var scheduleDaySubstring = presentationsQueryResponse[i]['scheduledDate'].substring(8,10),
                            firstSubCharacter = scheduleDaySubstring[0];

                        if(firstSubCharacter === "0")
                            scheduleDaySubstring = scheduleDaySubstring[1];

                        if(parseInt(currentDay) <= parseInt(scheduleDaySubstring) &&
                            scheduleDaySubstring === selectedDayString) //look for comparison
                        {
                            nodeBuffer = "<span class=\"scheduledEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                                "SCI</span></span>";
                            foundMatch = true;
                        }
                        else if(previouslyScheduledEvent && scheduleDaySubstring === selectedDayString) //the day has a scheduled event that has passed.
                        {
                            nodeBuffer = "<span class=\"archivedEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                                "SCI</span></span>";
                            foundMatch = true;
                        }

                        if(foundMatch)
                        {
                            $(dayNumberSpans[c]).after(nodeBuffer);
                            break;
                        }
                    }

                    if(!foundMatch)
                    {
                        nodeBuffer = "<span class=\"noEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                            "SCI</span></span>";
                        $(dayNumberSpans[c]).after(nodeBuffer);
                    }

                }
                else
                {
                    nodeBuffer = "<span class=\"noEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                        "SCI</span></span>";
                    $(dayNumberSpans[c]).after(nodeBuffer);
                }
            }

            InitiatlizeEventMarkers(function(){

                $(noEventMarkers).click(function(e){
                    $(presentationEntryContainer).html('');
                    UpdateDailyPresentationNumber(0);
                    GetDateFromEventTokenParentPutInDateInput(e);
                    GenerateDefaultPresentationNodes(9);
                    GetScheduleLabelsAndPopulateSelects();
                    UpdateDailyPresentationNumber(9);
                    $('.modifyPresentationEntry').hide();
                });

                $(scheduledEventMarkers).click(function(e){
                    $(presentationEntryContainer).html('');
                    UpdateDailyPresentationNumber(0);
                    GetDateFromEventTokenParentPutInDateInput(e);
                    $('.deletePresentationEntry').hide();
                });

                $(pastEventMarkers).click(function(e){
                    $(presentationEntryContainer).html('');
                    UpdateDailyPresentationNumber(0);
                    GetDateFromEventTokenParentPutInDateInput(e);
                    $('.deletePresentationEntry').hide();
                    $('.modifyPresentationEntry').hide();
                    $('.addPresentationEntry').hide();
                });
            });
        });
    }

    function GenerateDefaultPresentationNodes(numberOfNodes)
    {
        for(var i =0; i < numberOfNodes; i++)
        {
            presentationEntryContainer.append("<div class='presentationEntry" + i +"'>"+predefinedPresentationNode + "</div>");
        }
    }

    function GetDateFromEventTokenParentPutInDateInput(e)
    {
        var date = null,
            dayNumber = null;
        e.preventDefault();
        e.stopImmediatePropagation();

        if($(e.target).hasClass('eventMarkerLabel'))
            e.target= $(e.target).parent();

        date = $(e.target).parent().attr("data-date");
        dayNumber = $(e.target).siblings().html();

        var result = BuildDayDateString(date,dayNumber),
            updatedDate ="<option selected >" + result + "</option>";
        $(dateSelect).html(updatedDate);
    }

    function BuildDayDateString(date,dayNumber)
    {
        date += " 12:00:00";
        var dateString = new Date(date),
            dayIndex = dateString.getDay(),
            monthIndex = dateString.getMonth(),
            year = dateString.getFullYear();

        dateString = GetDayNameString(dayIndex) +" " +  ParseMonthIndex(monthIndex)+ '/' + dayNumber +
           '/'+ year;
        return dateString;
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

    function ParseMonthIndex(month)
    {
       return month+1;
    }

    function GetMonthlySchedule(month,year,callback)
    {
        var payload = { month: month, year: year };
        payload = JSON.stringify(payload);
        $.ajax({
            method: "POST",
            url: "../_serverSide/readMonthlySchedule.php",
            data: payload,
            async: true,
            timeout:0,
            contentType: 'application/json; charset=utf-8'
        })
        .done(function( msg ) {
            return callback(msg);
        });
    }

    function GetScheduleTables(callback)
    {
        var payload = { "t":"t"};
        payload = JSON.stringify(payload);
        $.ajax({
            method: "POST",
            url: "../_serverSide/readPresentationTables.php",
            data: payload,
            async: true,
            timeout:0,
            contentType: 'application/json; charset=utf-8'
        })
            .done(function( msg ) {
                return callback(msg);
            });
    }

    function UpdateDailyPresentationNumber(number)
    {
        $(presentationNumberSpan).html(number);
    }


})(window, jQuery = window.jQuery || {} );