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
    dateSelect = null;

    $(document).ready(function() {

        InitializeCalendar();
        if(!calendarEl)
            return console.log("Error: Could not create Calendar : schedulingCalendar.js");

        calendar.render();
        CheckDatabaseForMonthlyEvents();

        setTimeout(function()
        {
            fullCalendarButton = document.getElementsByClassName('fc-button');
            $(fullCalendarButton).click(function(e){
                CheckDatabaseForMonthlyEvents();
            });

        },1000);
    });

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
        });
    }
    function CheckDatabaseForMonthlyEvents()
    {
        dayNumberSpans = $('.fc-day-number').filter(':parents(.fc-past-month)')
            .filter(':parents(.fc-other-month)').filter(':parents(.fc-future-month)');

        //TODO: Retrieve array of current presentations of the month.
        //Loop through the presentations and compare the day.
        for (var c = 0; c <= dayNumberSpans.length; c++)
        {
           if(false) //look for comparison
               nodeBuffer = "<span class=\"scheduledEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                   "SCI</span></span>";

           else if(false) //the day has a scheduled event that has passed.
               nodeBuffer = "<span class=\"archivedEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                   "SCI</span></span>";

           else
               nodeBuffer = "<span class=\"noEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                   "SCI</span></span>";

            $(dayNumberSpans[c]).after(nodeBuffer);
        }

        InitiatlizeEventMarkers(function(){

            var date = null,
                dayNumber = null;
            $(noEventMarkers).click(function(e){
                e.preventDefault();
                e.stopImmediatePropagation();

                if($(e.target).hasClass('eventMarkerLabel'))
                    e.target= $(e.target).parent();

                date = $(e.target).parent().attr("data-date");
                dayNumber = $(e.target).siblings().html();

                var result = BuildDayDateString(date,dayNumber),
                    updatedDate ="<option selected >" + result + "</option>";
                $(dateSelect).html(updatedDate);

            });

            $(scheduledEventMarkers).click(function(){

            });

            $(pastEventMarkers).click(function(){

            });
        });

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

})(window, jQuery = window.jQuery || {} );