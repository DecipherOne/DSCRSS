jQuery.expr[':'].parents = function(a,i,m){
    return jQuery(a).parents(m[3]).length < 1;
};
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
    presentationNumberSpan = null,
    formTimeValues=[];

    $(document).ready(function() {

        InitializeFormTimeValues();
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

    function InitializeFormTimeValues()
    {
        formTimeValues = ["6:00","6:15","6:30","6:45",
            "7:00","7:15","7:30","7:45",
            "8:00","8:15","8:30","8:45",
            "9:00","9:15","9:30","9:45",
            "10:00","10:15","10:30","10:45",
            "11:00","11:15","11:30","11:45",
            "12:00","12:15","12:30","12:45",
            "13:00","13:15","13:30","13:45",
            "14:00","14:15","14:30","14:45",
            "15:00","15:15","15:30","15:45",
            "16:00","16:15","16:30","16:45",
            "17:00","17:15","17:30","17:45",
            "18:00","18:15","18:30","18:45",
            "19:00","19:15","19:30","19:45",
            "20:00","20:15","20:30","20:45",
            "21:00","21:15","21:30","21:45",
            "22:00","22:15","22:30","22:45",
            "23:00","23:15","23:30","23:45"];

        console.log("time Values : " + formTimeValues);
    }

    function InitializePredefinedPresentationNode()
    {
        var topControls = "<span class='deletePresentationEntry left'><span class='controlLabel'>-</span></span><span class='modifyPresentationEntry left'><span class='controlLabel'>Y</span></span>";
        var selects = '<select  class="schedulingToolSelect left startTimeSelect" ><option selected="">Start Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left endTimeSelect" ><option selected="">End Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left titleSelect" ><option selected="">Title</option></select>';
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
        scheduleTablesQueryResponse = GetScheduleTables(function(response)
        {
            return callback(response);
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
        RetrieveScheduleTablesFromDataStore(function(response){
            var presentationEntryLines = $('div [class^="presentationEntry"]');
            PopulatePresentationEntrySelects(presentationEntryLines,response,function(){
                PrepopulateDefaultDailySchedule(presentationEntryLines);
            });
        });
    }

    function PrepopulateDefaultDailySchedule(entries)
    {
        for(var c=0; c < entries.length; c++)
        {
            switch(c)
            {
                case 0:{
                    $(entries[c]).children(".startTimeSelect").val("9:30");
                    $(entries[c]).children(".endTimeSelect").val("10:00");
                    $(entries[c]).children(".titleSelect").val(39);
                    $(entries[c]).children(".locationSelect").val(16);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 1:{
                    $(entries[c]).children(".startTimeSelect").val("10:30");
                    $(entries[c]).children(".endTimeSelect").val("11:00");
                    $(entries[c]).children(".titleSelect").val(22);
                    $(entries[c]).children(".locationSelect").val(3);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 2:{
                    $(entries[c]).children(".startTimeSelect").val("12:00");
                    $(entries[c]).children(".endTimeSelect").val("13:00");
                    $(entries[c]).children(".titleSelect").val(47);
                    $(entries[c]).children(".locationSelect").val(15);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 3:{
                    $(entries[c]).children(".startTimeSelect").val("13:30");
                    $(entries[c]).children(".endTimeSelect").val("14:00");
                    $(entries[c]).children(".titleSelect").val(4);
                    $(entries[c]).children(".locationSelect").val(15);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 4:{
                    $(entries[c]).children(".startTimeSelect").val("14:00");
                    $(entries[c]).children(".endTimeSelect").val("14:30");
                    $(entries[c]).children(".titleSelect").val(36);
                    $(entries[c]).children(".locationSelect").val(15);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 5:{
                    $(entries[c]).children(".startTimeSelect").val("14:30");
                    $(entries[c]).children(".endTimeSelect").val("15:00");
                    $(entries[c]).children(".titleSelect").val(5);
                    $(entries[c]).children(".locationSelect").val(10);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 6:{
                    $(entries[c]).children(".startTimeSelect").val("15:30");
                    $(entries[c]).children(".endTimeSelect").val("16:00");
                    $(entries[c]).children(".titleSelect").val(18);
                    $(entries[c]).children(".locationSelect").val(10);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                case 7:{
                    $(entries[c]).children(".startTimeSelect").val("17:00");
                    $(entries[c]).children(".endTimeSelect").val("17:30");
                    $(entries[c]).children(".titleSelect").val(33);
                    $(entries[c]).children(".locationSelect").val(13);
                    $(entries[c]).children(".deploymentLocationSelect").val(1);
                    break;
                }
                default:{
                    break;
                }
            }

        }
    }

    function PopulatePresentationEntrySelects(entries,response,callback)
    {
        for(var c=0; c < entries.length; c++)
        {
            for(var d=0; d < formTimeValues.length; d++)
            {
                $(entries[c]).children(".startTimeSelect").append($('<option>', {
                    value: formTimeValues[d],
                    text: formTimeValues[d]
                }));

                $(entries[c]).children(".endTimeSelect").append($('<option>', {
                    value: formTimeValues[d],
                    text: formTimeValues[d]
                }));
            }

            for(var d=0; d < response['tables']['presentationTitles'].length; d++)
            {
                $(entries[c]).children(".titleSelect").append($('<option>', {
                    value:response['tables']['presentationTitles'][d]['index'],
                    text: response['tables']['presentationTitles'][d]['title']
                }));
            }

            for(var d=0; d < response['tables']['presentationLocation'].length; d++)
            {
                $(entries[c]).children(".locationSelect").append($('<option>', {
                    value:response['tables']['presentationLocation'][d]['index'],
                    text: response['tables']['presentationLocation'][d]['locationName']
                }));
            }

            for(var d=0; d < response['tables']['presenters'].length; d++)
            {
                $(entries[c]).children(".presenterSelect").append($('<option>', {
                    value:response['tables']['presenters'][d]['index'],
                    text: response['tables']['presenters'][d]['Name']
                }));
            }

            for(var d=0; d < response['tables']['deploymentLocations'].length; d++)
            {
                $(entries[c]).children(".deploymentLocationSelect").append($('<option>', {
                    value:response['tables']['deploymentLocations'][d]['index'],
                    text: response['tables']['deploymentLocations'][d]['deploymentLocation']
                }));
            }
        }

        return callback();
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
                    GenerateDefaultPresentationNodes(9,function(){
                        GetScheduleLabelsAndPopulateSelects();

                        $('.modifyPresentationEntry').hide();

                        $('button[class^="submitEventLineButton"]').click(function(e){
                            e.preventDefault();
                            e.stopImmediatePropagation();

                        });

                        $('#toolBar').removeClass('hidden');
                    });

                });

                $(scheduledEventMarkers).click(function(e){
                    $(presentationEntryContainer).html('');
                    UpdateDailyPresentationNumber(0);
                    GetDateFromEventTokenParentPutInDateInput(e);
                    $('.deletePresentationEntry').hide();
                    $('#toolBar').removeClass('hidden');
                });

                $(pastEventMarkers).click(function(e){
                    $(presentationEntryContainer).html('');
                    UpdateDailyPresentationNumber(0);
                    GetDateFromEventTokenParentPutInDateInput(e);
                    $('.deletePresentationEntry').hide();
                    $('.modifyPresentationEntry').hide();
                    $('#toolBar').addClass('hidden');
                });
            });
        });
    }

    function GenerateDefaultPresentationNodes(numberOfNodes, callback)
    {

        for(var i =0; i < numberOfNodes; i++)
        {
            var submitEventLineButton = "<button class='submitEventLineButton" + i + "' >Submit</button>";
            presentationEntryContainer.append("<div class='presentationEntry" + i +"'>"+predefinedPresentationNode +
                submitEventLineButton + "</div>");
        }

        return callback();
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