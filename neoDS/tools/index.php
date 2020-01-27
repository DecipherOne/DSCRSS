<?php
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <title>Science Center of Iowa Daily Schedule </title>
    <script src="../js/3rdParty.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../style/style.min.css">
    <link rel="shortcut icon" href="https://www.sciowa.org/favicon-194x194.png"/>
</head>
<body>
<div id="scheduleContainer" class="relativelyCentered">
    <div id="scheduleHeader" class="bottomMargin20">
        <span class="left" id="schedulingToolLegend">
            <div id="legendTitle">Legend</div>
            <div id="todayMarkerContainer">
                <span id="legendTodayMarker"></span>
                Current Day
            </div>
            <div id="selectedDayMarkerContainer">
                <span id="legendSelectedDayMarker"></span>
                Selected Day
            </div>
            <div id="archivedMarkerContainer">
                <span id="legendArchivedMarker"></span>
                Past Scheduled Events
            </div>
            <div id="eventMarkerContainer">
                <span id="legendScheduledEventMarker"></span>
                Scheduled Events
            </div>
            <div id="noEventMarkerContainer">
                <span id="legendUnscheduledDayMarker"></span>
                No Scheduled Events
            </div>
        </span>
        <div  id="headerTitleContainer">
            <h3>Science Center of Des Moines Digital Scheduling</h3>
        </div>
        <div id="headerMessageContainer" class="absolutelyCentered halfWidth">
        </div>
    </div>
    <div id='calendar' class="halfWidth left"></div>
    <div id="schedulingFormContainer" class="halfWidth left">
        <div id="dailySchedulingForm">
            <div id="dailyScheduleFormHeader">
                <fieldset id="schedulingToolFieldset">
                    <label id="schedulingToolDateLabel" class="left" for="schedulingToolDateInput">
                        Date
                    </label>
                    <select id="schedulingToolDateSelect" class="schedulingToolSelect left" disabled>
                        <option selected>Day - 00/00/0000</option>
                    </select>
                    <div id="schedulingToolNumberOfPresentations"><span id="presentationNumberSpan">0</span>
                        Presentations Scheduled.
                    </div>
                </fieldset>
            </div>
            <div id="presentationScrollContainer">
                <fieldset id="scheduledPresentationsFieldSet">
                    <div id="presentationEntryContainer">
                    </div>
                </fieldset>
            </div>
            <div id="toolBar" class="relativelyCentered hidden">
                <div class="toolbarSlot addEntry left">
                    <button id="addEntryButton">Add Presentation</button>
                </div>
                <div class="toolbarSlot editSelections left">
                    <button id="editSelectionsButton">Edit Selections</button>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<footer>
    <!-- <script src="../js/001.min.js"></script> -->
    <script src="../static_build/js/compiled/001.js"></script>
    <h6>Donated By : Will Canada circa 2020 <a href="http://decipherone.com" target="_blank">DecipherOne</a>
        in partnership with <a href="http://grandconsulting.com/" target="_blank">Grand Consulting</a></h6>
</footer>
</html>