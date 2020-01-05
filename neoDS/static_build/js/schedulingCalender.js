"use strict";

(function SchedulingCalendar(window,$){

    var calendarEl = null,
        calendar = null;

    $(document).ready(function() {
        calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'dayGrid' ,'interaction'],
        });
        if(calendarEl)
            calendar.render();
    });

    //Call : OnContentLoad, OnChangeOfMonth
    // Will gather all fc-day-number class objects, <span>
    // for each number, check retrieved database array
    // for day match
    // If match, span that matches,add a new span with following classes
    //<span class="archivedEventCircleMarker relativelyCentered topMargin20">
    //These will serve as the scheduling markers on the calendar
    function CheckDatabaseForMonthlyEvents()
    {

    }

})(window, jQuery = window.jQuery || {} );