"use strict";

(function SchedulingCalendar(window,$){

    document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');

        var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'dayGrid' ]
        });

        calendar.render();
    });

})(window, jQuery = window.jQuery || {} );