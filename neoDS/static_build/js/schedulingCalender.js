"use strict";

(function SchedulingCalendar(window,$){

    var dayNumberSpans = null,
    calendarEl = null,
    calendar = null,
    nodeBuffer = null,
    fullCalendarButton = null;

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

    }

})(window, jQuery = window.jQuery || {} );