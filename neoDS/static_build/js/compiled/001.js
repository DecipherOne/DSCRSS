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
    formTimeValues=[],
    dailyScheduleEntry = [],
    headerMessageContainer = null,
    schedulingToolScreenLocationInput = null,
    targetedScreen = null,
    schedulingPreviewLink = null,
    editSelectsToolSelectTable = null,
    editSelectsToolSelectTableValue = null,
    editSelectsToolTableValueTextarea = null,
    editSelectsToolCreateNewValueTextarea = null,
    submitUpdateTableValue = null,
    submitDeleteTableValue = null,
    submitCreateTableValue = null;



    $(document).ready(function() {

        InitializeFormTimeValues();
        InitializePredefinedPresentationNode();
        InitializeTodaysDate();
        InitializeCalendar();

        if(!calendarEl)
            return;

        calendar.render();
        InitializeScreenLocationValues();
        schedulingPreviewLink = $("#schedulingPreviewLink");
        presentationEntryContainer = $('#presentationEntryContainer');
        presentationNumberSpan = $('#presentationNumberSpan');
        headerMessageContainer = $('#headerMessageContainer');

        CheckDatabaseForMonthlyEvents();
        fullCalendarButton = document.getElementsByClassName('fc-button');
        $(fullCalendarButton).click(function(e){
            CheckDatabaseForMonthlyEvents(e);
        });
    });

    function InitializeEditSelectsToolValues()
    {
        editSelectsToolSelectTable = $("#editSelectsToolSelectTable");
        editSelectsToolSelectTableValue = $("#editSelectsToolSelectTableValue");
        editSelectsToolTableValueTextarea = $("#editSelectsToolTableValueTextarea");
        editSelectsToolCreateNewValueTextarea = $("#editSelectsToolCreateNewValueTextarea");
        submitCreateTableValue = $("#submitCreateTableValue");
        submitDeleteTableValue = $("#submitDeleteTableValue");
        submitUpdateTableValue = $("#submitUpdateTableValue");

        setTimeout(function(){
            editSelectsToolSelectTable.trigger("change");
        },150);

        $(editSelectsToolSelectTable).on("change",function(){
            GetCurrentPresentationTables(function(tables){
                PopulateEditSelectsToolValueToEditSelect(tables);
                UpdateEditSelectsTextAreaBasedOnSelectedValues();
            });
        });

        $(editSelectsToolSelectTableValue).on("change", function() {
            UpdateEditSelectsTextAreaBasedOnSelectedValues();
        });

        $(editSelectsToolCreateNewValueTextarea).on("focus", function() {
            $(submitCreateTableValue).removeAttr("disabled");
        });

        $(submitCreateTableValue).click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            $(e.target).attr("disabled","disabled");

            if($(editSelectsToolCreateNewValueTextarea).val().length <= 1)
                return;

            var targetTable = DetermineTargetedTableForModification(),
                payload = BuildTableDataPayload(targetTable,1),
                index = null;

            ModifySelectTableEntry(payload,function(response){
                $(editSelectsToolCreateNewValueTextarea).val("");
                $(headerMessageContainer).html(response['message']);
                index = response["index"];
                $(editSelectsToolSelectTable).trigger("change");
                $(editSelectsToolSelectTableValue).val(index);
                $(editSelectsToolSelectTableValue).trigger("change");

            });
        });

        $(submitUpdateTableValue).click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            $(e.target).attr("disabled","disabled");
            $(submitDeleteTableValue).attr("disabled","disabled");

            var targetTable = DetermineTargetedTableForModification(),
                payload = BuildTableDataPayload(targetTable,2);

            ModifySelectTableEntry(payload,function(response){

                $(headerMessageContainer).html(response['message']);
                $(editSelectsToolSelectTable).trigger("change");
                setTimeout(function(){
                    $(editSelectsToolSelectTableValue).val(response["index"]);
                    $(editSelectsToolSelectTableValue).trigger("change");
                },100);
            });

        });

        $(submitDeleteTableValue).click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            $(e.target).attr("disabled","disabled");
            $(submitUpdateTableValue).attr("disabled","disabled");

            var targetTable = DetermineTargetedTableForModification(),
                payload = BuildTableDataPayload(targetTable,3),
                confirmDelete = null;

            confirmDelete =  window.confirm("Are you sure you want to delete this value?");

            if(confirmDelete)
                ModifySelectTableEntry(payload,function(response){
                    $(headerMessageContainer).html(response['message']);
                    $(editSelectsToolSelectTable).trigger("change");
                });
        });
    }

    function BuildTableDataPayload(tableName,type)
    {
        var builtDataObject = [],
            rowValue = $(editSelectsToolTableValueTextarea).val(),
            rowIndex = $(editSelectsToolSelectTableValue).val();

        if(type==1)
            rowValue = $(editSelectsToolCreateNewValueTextarea).val();

        switch(tableName)
        {
            case "presentationTitles": //titles
            {
                builtDataObject = {"tableData":{"tableName": tableName,
                        "title":rowValue,"index":rowIndex},"type" : type};
                break;
            }
            case "presentationLocations": //locations
            {
                builtDataObject = {"tableData":{"tableName": tableName,
                    "locationName":rowValue,"index":rowIndex},"type" : type};
                break;
            }
            case "Presenters": //Presenters
            {
                builtDataObject = {"tableData":{"tableName": tableName,
                        "Name":rowValue,"index":rowIndex},"type" : type};
                break;
            }
        }




        return builtDataObject;
    }

    function DetermineTargetedTableForModification()
    {
        var selectedTable = $("#editSelectsToolSelectTable :selected").val();
        switch(selectedTable)
        {
            case "title":
            {
                return "presentationTitles";
                break;
            }
            case "presenterName":
            {
                return "Presenters";
                break;
            }
            case "location":
            {
                return "presentationLocations";
                break;
            }
        }
    }

    function UpdateEditSelectsTextAreaBasedOnSelectedValues()
    {
        var currentSelectionIndex = $(editSelectsToolSelectTableValue).val(),
            currentSelectedTable = $(editSelectsToolSelectTable).val(),
            currentSelectedTableIndex = 0;

        if(currentSelectedTable !=="presenterName")
        {
            if(currentSelectedTable === "title")
                currentSelectedTableIndex = 1;
            else if(currentSelectedTable === "location")
                currentSelectedTableIndex = 2;

            if(!CheckForNonEditableSelectValue(currentSelectionIndex,currentSelectedTableIndex))
            {
                currentSelectedTable = $("#editSelectsToolSelectTableValue :selected").text();
                $(submitUpdateTableValue).removeAttr("disabled");
                $(submitDeleteTableValue).removeAttr("disabled");
                $(editSelectsToolTableValueTextarea).val(currentSelectedTable);
            }
            else
            {
                $(editSelectsToolTableValueTextarea).val("Due to schedule generation, this value can not be edited.");
                $(submitUpdateTableValue).attr("disabled","disabled");
                $(submitDeleteTableValue).attr("disabled", "disabled");
            }
        }
        else
        {
            currentSelectedTable = $("#editSelectsToolSelectTableValue :selected").text();
            $(submitUpdateTableValue).removeAttr("disabled");
            $(submitDeleteTableValue).removeAttr("disabled");
            $(editSelectsToolTableValueTextarea).val(currentSelectedTable);
        }
    }

    function CheckForNonEditableSelectValue(index, type)
    {
        var titleIndecies = [39,22,47,4,36,5,18,33],
            locationIndecies = [16,3,15,10,13];

        switch(type)
        {
            case 1:
            {
                for(var i=0; i < titleIndecies.length; i++)
                {
                    if(titleIndecies[i]===parseInt(index))
                        return true;
                }
                break;
            }

            case 2 :
            {
                for(var i=0; i < locationIndecies.length; i++)
                {
                    if(locationIndecies[i]===parseInt(index))
                        return true;
                }
                break;
            }

            default:
                break;
        }

        return false;
    }

    function InitializeScreenLocationValues()
    {
        schedulingToolScreenLocationInput = $("#schedulingToolScreenLocationInput");
        targetedScreen = $(schedulingToolScreenLocationInput).val();
        $(schedulingToolScreenLocationInput).on("change",function(){
            targetedScreen = $(schedulingToolScreenLocationInput).val();
            $('.selectedDay').children(".relativelyCentered").trigger("click");
        });
    }

    function InitializeFormTimeValues()
    {
        formTimeValues = ["06:00","06:15","06:30","06:45",
            "07:00","07:15","07:30","07:45",
            "08:00","08:15","08:30","08:45",
            "09:00","09:15","09:30","09:45",
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
    }

    function InitializePredefinedPresentationNode()
    {
        var topControls = "<span class='archivedPresentationEntry left'><span class='controlLabel'></span></span>" +
            "<span class='deletePresentationEntry left'><span class='controlLabel'></span></span>" +
            "<span class='modifyPresentationEntry left'><span class='controlLabel'></span></span>";
        var selects = '<select  class="schedulingToolSelect left startTimeSelect" ><option>Start Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left endTimeSelect" ><option >End Time</option></select>';
        selects +=  '<select  class="schedulingToolSelect left titleSelect" ><option >Title</option></select>';
        selects +=  '<select  class="schedulingToolSelect left locationSelect"><option>Location</option></select>';
        selects +=  '<select  class="schedulingToolSelect left presenterSelect"><option>Presenter Name</option></select>';

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

    function ScheduledDateHasPassed(scheduledDate, testDate)
    {
        if(scheduledDate ==='' && testDate === '')
            return false;

        var dateObjectA = new Date(scheduledDate + " 12:00:00"),
        dateObjectB = new Date(testDate + " 12:00:00");

        dateObjectA = dateObjectA.getTime();
        dateObjectB = dateObjectB.getTime();

        return parseInt(dateObjectB) > parseInt(dateObjectA);

    }

    function ScheduledDateIsToday(scheduledDate, testDate)
    {
        if(scheduledDate ==='' && testDate === '')
            return false;

        var dateObjectA = new Date(scheduledDate + " 12:00:00"),
            dateObjectB = new Date(testDate + " 12:00:00");

        dateObjectA = dateObjectA.getTime();
        dateObjectB = dateObjectB.getTime();

        return parseInt(dateObjectB) == parseInt(dateObjectA);
    }


    function GetScheduleLabelsAndPopulateDailySchedule(dailySchedule)
    {
        RetrieveScheduleTablesFromDataStore(function(response) {
            var presentationEntryLines = $('div [class^="presentationEntry"]');
            PopulatePresentationEntrySelects(presentationEntryLines,response,function(){
                PopulateTodaysSchedule(presentationEntryLines, dailySchedule);
            });
        });
    }

    function PopulateTodaysSchedule(entries, dailySchedule)
    {
        for(var c=0; c < entries.length; c++)
        {
            var buttonID = ".submitEventLineButton"+c;
            $(entries[c]).children(".startTimeSelect").val(dailySchedule[c]['StartTime']).attr("disabled","disabled");
            $(entries[c]).children(".endTimeSelect").val(dailySchedule[c]['EndTime']).attr("disabled","disabled");
            $(entries[c]).children(".titleSelect").val(dailySchedule[c]['Title']).attr("disabled","disabled");
            $(entries[c]).children(".locationSelect").val(dailySchedule[c]['Location']).attr("disabled","disabled");
            $(entries[c]).children(".deploymentLocationSelect").val(dailySchedule[c]['ScreenLocation']).attr("disabled","disabled");
            $(entries[c]).children(".presenterSelect").val(dailySchedule[c]['PresenterName']).attr("disabled","disabled");
            $(entries[c]).children(buttonID).attr("disabled","disabled").attr("Index",dailySchedule[c]["Index"]);
            $(entries[c]).addClass("scheduled");
        }
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
                    $(entries[c]).children(".startTimeSelect").val("09:30");
                    $(entries[c]).children(".endTimeSelect").val("10:00");
                    $(entries[c]).children(".titleSelect").val("Storytime Under the Stars");
                    $(entries[c]).children(".locationSelect").val("Why the Sky?, Upper Level");
                    break;
                }
                case 1:{
                    $(entries[c]).children(".startTimeSelect").val("10:30");
                    $(entries[c]).children(".endTimeSelect").val("11:00");
                    $(entries[c]).children(".titleSelect").val("Meet Stuffee");
                    $(entries[c]).children(".locationSelect").val("John Deere Adventure Theater, Main Level");
                    break;
                }
                case 2:{
                    $(entries[c]).children(".startTimeSelect").val("12:00");
                    $(entries[c]).children(".endTimeSelect").val("13:00");
                    $(entries[c]).children(".titleSelect").val("WHO-HD Live Weather Forecast");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    break;
                }
                case 3:{
                    $(entries[c]).children(".startTimeSelect").val("13:30");
                    $(entries[c]).children(".endTimeSelect").val("14:00");
                    $(entries[c]).children(".titleSelect").val("Cold Blooded Critters");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    break;
                }
                case 4:{
                    $(entries[c]).children(".startTimeSelect").val("14:00");
                    $(entries[c]).children(".endTimeSelect").val("14:30");
                    $(entries[c]).children(".titleSelect").val("Snapping Turtle Feeding");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    break;
                }
                case 5:{
                    $(entries[c]).children(".startTimeSelect").val("14:30");
                    $(entries[c]).children(".endTimeSelect").val("15:00");
                    $(entries[c]).children(".titleSelect").val("Dawn of the Space Age");
                    $(entries[c]).children(".locationSelect").val("Star Theater, Why the Sky?, Upper Level");
                    break;
                }
                case 6:{
                    $(entries[c]).children(".startTimeSelect").val("15:30");
                    $(entries[c]).children(".endTimeSelect").val("16:00");
                    $(entries[c]).children(".titleSelect").val("Iowa Skies Tonight");
                    $(entries[c]).children(".locationSelect").val("Star Theater, Why the Sky?, Upper Level");
                    break;
                }
                case 7:{
                    $(entries[c]).children(".startTimeSelect").val("17:00");
                    $(entries[c]).children(".endTimeSelect").val("17:30");
                    $(entries[c]).children(".titleSelect").val("SCIENCE CENTER OF IOWA CLOSES");
                    $(entries[c]).children(".locationSelect").val("Thank you for visiting. Have a great night!");
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
                    value:response['tables']['presentationTitles'][d]['title'],
                    text: response['tables']['presentationTitles'][d]['title']
                }));
            }

            for(var d=0; d < response['tables']['presentationLocation'].length; d++)
            {
                $(entries[c]).children(".locationSelect").append($('<option>', {
                    value:response['tables']['presentationLocation'][d]['locationName'],
                    text: response['tables']['presentationLocation'][d]['locationName']
                }));
            }

            for(var d=0; d < response['tables']['presenters'].length; d++)
            {
                $(entries[c]).children(".presenterSelect").append($('<option>', {
                    value:response['tables']['presenters'][d]['Name'],
                    text: response['tables']['presenters'][d]['Name']
                }));
            }
        }
        return callback();
    }

    function CheckDatabaseForMonthlyEvents(event,callback)
    {
        dayNumberSpans = $('.fc-day-number').filter(':parents(.fc-past-month)')
            .filter(':parents(.fc-other-month)').filter(':parents(.fc-future-month)');

        RetrievePresentationsFromDataStore(function(presentationsQueryResponse ){

            var calendarDateString = null,
                previouslyScheduledEvent = null,
                selectedDayString = null,
                calendarDayScheduleDayMatch = null,
                scheduledDate = null;

            for (var c = 0; c <= dayNumberSpans.length; c++)
            {
                if(presentationsQueryResponse.length >= 1)
                {
                    var foundMatch = false;

                    for(var i=0; i < presentationsQueryResponse.length; i++)
                    {
                        scheduledDate = presentationsQueryResponse[i]['ScheduledDate'];
                        selectedDayString = $(dayNumberSpans[c]).html();
                        previouslyScheduledEvent =  ScheduledDateHasPassed(scheduledDate,todaysDate);

                        var scheduleDaySubstring = presentationsQueryResponse[i]['ScheduledDate'].substring(8,10),
                            firstSubCharacter = scheduleDaySubstring[0];

                        if(firstSubCharacter === "0")
                            scheduleDaySubstring = scheduleDaySubstring[1];

                        calendarDayScheduleDayMatch = (scheduleDaySubstring === selectedDayString);

                        if(!previouslyScheduledEvent && calendarDayScheduleDayMatch)
                        {
                            nodeBuffer = "<span class=\"scheduledEventCircleMarker relativelyCentered topMargin20\"><span class='eventMarkerLabel'>" +
                                "SCI</span></span>";

                            foundMatch = true;
                        }
                        else if(calendarDayScheduleDayMatch)
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

                    UpdateSchedulingHeader(e);
                    $("#schedulingToolScreenLocationInput").removeAttr("disabled");

                    if(CheckForPassedCalendarDay(e))
                    {
                        HidePresentationToolBar();
                        return;
                    }

                    GenerateDefaultPresentationNodes(8,function(){
                        GetScheduleLabelsAndPopulateSelects();
                        $('.modifyPresentationEntry').hide();
                        $('.archivedPresentationEntry').hide();
                        ShowPresentationToolBar();
                        AddControlClickEventHandlers();
                    });
                });

                $(scheduledEventMarkers).click(function(e){

                    UpdateSchedulingHeader(e);
                    $("#schedulingToolScreenLocationInput").removeAttr("disabled");
                    var day = $(this).prev().html(),
                        month = new Date;
                    month = month.getMonth()+1;

                    if(day.length===1)
                        day = "0"+day;
                    calendarDateString = currentYear + "-" + currentMonth + "-" + day;

                    GetPresentationsForDayFromMonthRecord(presentationsQueryResponse,calendarDateString,function(dailyScheduleEntry){
                        dailyScheduleEntry = ParseEventsForTargetedScreen(dailyScheduleEntry,targetedScreen);
                        var numberOfNodes = dailyScheduleEntry.length;
                        if(!numberOfNodes)
                        {
                            GenerateDefaultPresentationNodes(8,function(){
                                GetScheduleLabelsAndPopulateSelects();
                                $('.modifyPresentationEntry').hide();
                                $('.archivedPresentationEntry').hide();
                                ShowPresentationToolBar();
                                AddControlClickEventHandlers();
                            });
                            return;
                        }

                        if(dailyScheduleEntry.length > 1)
                            BuildPreviewLink(month,currentYear,day,targetedScreen);

                        GenerateDefaultPresentationNodes(numberOfNodes,function(){
                            UpdateDailyPresentationNumber(numberOfNodes);
                            GetScheduleLabelsAndPopulateDailySchedule(dailyScheduleEntry);
                            $('.deletePresentationEntry').hide();
                            $('.archivedPresentationEntry').hide();
                            $('.modifyPresentationEntry').show();
                            ShowPresentationToolBar();
                            AddControlClickEventHandlers();
                        });
                    });
                });

                $(pastEventMarkers).click(function(e){

                    UpdateSchedulingHeader(e);
                    $("#schedulingToolScreenLocationInput").removeAttr("disabled");
                    var day = $(this).prev().html(),
                        month = new Date;
                    month = month.getMonth()+1;
                    if(day.length===1)
                        day = "0"+day;
                    calendarDateString = currentYear + "-" + currentMonth + "-" + day;

                    GetPresentationsForDayFromMonthRecord(presentationsQueryResponse,calendarDateString,function(dailyScheduleEntry){
                        dailyScheduleEntry = ParseEventsForTargetedScreen(dailyScheduleEntry,targetedScreen);
                        var numberOfNodes = dailyScheduleEntry.length;
                        if(dailyScheduleEntry.length > 1)
                            BuildPreviewLink(month,currentYear,day,targetedScreen);
                        GenerateDefaultPresentationNodes(numberOfNodes,function(){
                            UpdateDailyPresentationNumber(numberOfNodes);
                            GetScheduleLabelsAndPopulateDailySchedule(dailyScheduleEntry);
                            $('.deletePresentationEntry').hide();
                            $('.modifyPresentationEntry').hide();
                            $('.archivedPresentationEntry').show();
                            $(presentationEntryContainer).append('<span class="relativelyCentered">This day is in the past and can not be altered.</span>');
                            HidePresentationToolBar();
                            AddControlClickEventHandlers();
                        });
                    });
                });
            });
        });

        if(callback)
            return callback();
    }

    function ParseEventsForTargetedScreen(eventEntries,screen)
    {
        var matchingEvents = [];

        for(var i=0; i < eventEntries.length; i++)
        {
            if(eventEntries[i]['ScreenLocation'] === screen)
                if(matchingEvents.length ==0)
                    matchingEvents[0] = eventEntries[i];
                else
                    matchingEvents.push(eventEntries[i]);
        }

        return matchingEvents;
    }

    function BuildPreviewLink(month,year,day,screen)
    {
        var textForLink = "Preview This Schedule";
        var payload = {day:day, month:month, year:year, screen:screen},
            url = "../_serverSide/readDailySchedule.php?day="+ payload["day"] +"&month=" +
                payload["month"] + "&year=" + payload["year"] + "&screen='" + payload["screen"] + "'&previewMode=true";

        $(schedulingPreviewLink).html(textForLink);
        $(schedulingPreviewLink).unbind("click");
        $(schedulingPreviewLink).click(function(){
            window.open(url,"_blank");
        });

    }

    function UpdateSchedulingHeader(e)
    {
        ClearSchedulingHeaderDynamicData();
        PlaceSelectedDayClass(e.target);
        GetDateFromEventTokenParentPutInDateInput(e);

    }

    function ClearSchedulingHeaderDynamicData()
    {
        $(presentationEntryContainer).html('');
        $(headerMessageContainer).html('');
        $(schedulingPreviewLink).html("");
        UpdateDailyPresentationNumber(0);
    }
    function HidePresentationToolBar()
    {
        $('#toolBar').addClass('hidden');
    }

    function ShowPresentationToolBar()
    {
        $('#toolBar').removeClass('hidden');
    }

    function CheckForPassedCalendarDay(e)
    {
        var selectedDayString = $(e.target).parent().attr("data-date");

        if(ScheduledDateHasPassed(selectedDayString,todaysDate) && !ScheduledDateIsToday(todaysDate,selectedDayString))
        {
            $("#presentationEntryContainer").html("<br/><span class='relativelyCentered'> This day is in the past and can not be altered.</span> </br> ");
            return true;
        }

        return false;
    }

    function PlaceSelectedDayClass(target)
    {
        $(".selectedDay").removeClass("selectedDay");
        $(target).parent().addClass("selectedDay");
    }

    function GetPresentationsForDayFromMonthRecord(dbRecords,dateString, callback)
    {
        dailyScheduleEntry = [];

        for(var i=0; i < dbRecords.length; i++)
            if(dbRecords[i]["ScheduledDate"]=== dateString)
                if(!dailyScheduleEntry.length)
                    dailyScheduleEntry[0] = dbRecords[i];
                else
                    dailyScheduleEntry.push(dbRecords[i]);

        return callback(dailyScheduleEntry);
    }

    function AddControlClickEventHandlers()
    {

        $('.deletePresentationEntry').click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();

            var isScheduled = $(this).parent().hasClass("scheduled"),
                existingEntryIndex = $(e.target).siblings('button[class^="submitEventLineButton"]').attr("index");

            if(isScheduled)
            {
                var deleteEntry = window.confirm("You sure you want to delete this entry? "), //TODO :Make your own confirmation dialog lazy.
                     selectedDate = $(".selectedDay").attr("data-date"),
                    message = null;
                if(deleteEntry)
                {
                    DeleteExistingEntry(existingEntryIndex,function(response){
                        message = response['message'];
                        RefreshCalendar();
                        setTimeout(function(){
                            CheckDatabaseForMonthlyEvents(e,function(){
                                $("td[data-date='"+selectedDate+"']").addClass("selectedDay");
                                setTimeout(function(){
                                    $(".selectedDay").children("span").trigger("click");
                                    $(headerMessageContainer).html(message);
                                },100);
                            });
                        },100);

                    });
                }
                else
                {
                    var selects = $(this).siblings("select"),
                        button = $(this).siblings("button");
                    DisableSubmittedPresentationControls(selects,button);
                    $(this).hide();
                }
            }
            else
                $(this).parent().remove();
        });

        $('.modifyPresentationEntry').click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var lineItemComponents = $(e.target).parent().children();

            $(e.target).parent().children(".deletePresentationEntry").show();
            $(e.target).hide();

            $(lineItemComponents).removeAttr("disabled");
        });

        $(".addEntry").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#addEntryButton").trigger("click");
        });

        $("#addEntryButton").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var isScheduled = $(this).parent().hasClass("scheduled");
            AppendPresentationNode(e);
        });

        $(".editSelections").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#editSelectionsButton").trigger("click");
        });

        $("#editSelectionsButton").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            HidePresentationToolBar();
            ClearSchedulingHeaderDynamicData();
            $("#schedulingToolScreenLocationInput").attr("disabled","disabled");
            $(".selectedDay").removeClass("selectedDay");
            LoadEditSelectsForm();
            InitializeEditSelectsToolValues();
            GetCurrentPresentationTables(function(tables){
                PopulateEditSelectsToolValueToEditSelect(tables);
            });
        });

        $('button[class^="submitEventLineButton"]').click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            BuildIndividualPayloadAndSubmit(e);
        });
    }

    function GetCurrentPresentationTables(callback)
    {
        RetrieveScheduleTablesFromDataStore(function(tables){
            return callback(tables);
        });

        return;
    }

    function PopulateEditSelectsToolValueToEditSelect(tableValues)
    {
        var targetedTable = $(editSelectsToolSelectTable).val(),
            selectedValues = null;

        $(editSelectsToolSelectTableValue).html("");

        switch(targetedTable)
        {
            case "title":
            {
                selectedValues = tableValues["tables"]["presentationTitles"];
                for(var i = 0; i < selectedValues.length; i++)
                {
                    $(editSelectsToolSelectTableValue).append($('<option>', {
                        value: selectedValues[i]["index"],
                        text: selectedValues[i]["title"]
                    }));
                }
                break;
            }
            case "presenterName":
            {
                selectedValues = tableValues["tables"]["presenters"];
                for(var i = 0; i < selectedValues.length; i++)
                {
                    $(editSelectsToolSelectTableValue).append($('<option>', {
                        value: selectedValues[i]["index"],
                        text: selectedValues[i]["Name"]
                    }));
                }
                break;
            }
            case "location":
            {
                selectedValues = tableValues["tables"]["presentationLocation"];
                for(var i = 0; i < selectedValues.length; i++)
                {
                    $(editSelectsToolSelectTableValue).append($('<option>', {
                        value: selectedValues[i]["index"],
                        text: selectedValues[i]["locationName"]
                    }));
                }
                break;
            }
            default:
                break;
        }
    }

    function LoadEditSelectsForm()
    {
        var editSelectsForm = null;

        $(presentationEntryContainer).html("");

        editSelectsForm = "<fieldset id='scheduledPresentationsFieldSet'>" +
            "<div class='schedulingToolHeaderItem'><label id='editSelectsToolSelectTableLabel' for='editSelectsToolSelectTable'>Select Which Table To Edit</label>" +
            "<select class='schedulingToolSelect' id='editSelectsToolSelectTable'>" +
            "<option value='title'>Title</option>" +
            "<option value='presenterName'>Presenter</option>" +
            "<option value='location'>Location</option> " +
            "</select></div> "+
            "<div class='schedulingToolHeaderItem' id='updateTableValues'><label id='editSelectsToolSelectTableValueLabel' for='editSelectsToolSelectTableValue'>Select Which Value To Edit</label>" +
            "<select class='schedulingToolSelect' id='editSelectsToolSelectTableValue'></select>" +
            "<textarea id='editSelectsToolTableValueTextarea' maxlength=\"255\"></textarea>"+
            "<button id=\"submitUpdateTableValue\" disabled=\"disabled\">Update</button>" +
            "<button id=\"submitDeleteTableValue\" disabled=\"disabled\">Delete</button></div>"+
            "<div class='schedulingToolHeaderItem' id='createNewTableValue'><label id='editSelectsToolCreateNewValueLabel' for='editSelectsToolCreateNewValueTextarea'>Add A New Value</label>" +
            "<textarea id='editSelectsToolCreateNewValueTextarea' maxlength=\"255\"></textarea>"+
            "<button id=\"submitCreateTableValue\" disabled=\"disabled\">Create</button></div>"+
            " </fieldset>";

        $(presentationEntryContainer).html(editSelectsForm);

    }

    function VerifyRequiredFieldsAreSet(valueArray)
    {
        for(var i=0; i<valueArray.length; i++)
            if(valueArray[i]["rowName"]===valueArray[i]["rowValue"])
                if(valueArray[i]["rowName"]==="Presenter Name")
                    continue;
                else
                    return false;
        return true;
    }

    function BuildIndividualPayloadAndSubmit(e)
    {

        var selects = $(e.target).siblings('select'),
            payLoad = [],
            entryString = [],
            selectedDate = $('.selectedDay').attr("data-date"),
            existingEntryIndex = $(e.target).attr("index");

        $(e.target).parent().addClass("scheduled");

        for(var i=0; i < selects.length; i++)
        {
            var titleString =  $(selects[i]).find("option:first").html();
                entryString.push({ "rowName" : titleString, "rowValue" : $(selects[i]).val()});
        }

        entryString.push({"rowName" : "ScreenLocation","rowValue": targetedScreen});
        entryString.push({"rowName" : "ScheduledDate","rowValue": selectedDate});

        if(!VerifyRequiredFieldsAreSet(entryString))
            return alert("The only non required Field is Presenter Name. Please update your selection");

        if($(e.target).attr("index"))
        {
            entryString.push({"rowName":"Index","rowValue": existingEntryIndex});
            payLoad = {"presentation":entryString,"type":2};
        }
        else
            payLoad = {"presentation":entryString,"type":1};

        CreateNewIndividualPresentation(payLoad,function(response){
            RefreshCalendar();
            setTimeout(function(){
                CheckDatabaseForMonthlyEvents(e);
                $("td[data-date='"+selectedDate+"']").addClass("selectedDay");
                $(headerMessageContainer).html(response['message']);
                DisableSubmittedPresentationControls(selects,e.target);
                $(e.target).attr("index",response["Index"]);
            },100);

        });
    }

    function RefreshCalendar()
    {
        $('.fc-next-button').trigger("click");
        $('.fc-prev-button').trigger("click");
    }

    function DisableSubmittedPresentationControls(select,submitButton)
    {
        $(select).attr("disabled","disabled");
        $(submitButton).attr("disabled","disabled");
        $(submitButton).siblings('.deletePresentationEntry').hide();
        $(submitButton).siblings('.modifyPresentationEntry').show();
    }

    function AppendPresentationNode(e)
    {
        var index = null,
            submitEventLineButton = null,
            selectionString = null,
            presentationClassReference = null;

        index = $('#presentationEntryContainer div:last-child').attr('class');
        if(index === undefined || index === null)
            index = 0;
        else
        {
            index = index.replace("presentationEntry",'');
            index = parseInt(index);
        }

        index +=1;
        presentationClassReference = "presentationEntry"+index;
        submitEventLineButton = "<button class='submitEventLineButton" + index + "' >Submit</button>";
        presentationEntryContainer.append("<div class='" + presentationClassReference +"'>"+predefinedPresentationNode +
            submitEventLineButton + "</div>");

        selectionString = $("."+presentationClassReference);

        RetrieveScheduleTablesFromDataStore(function(response){
            PopulatePresentationEntrySelects(selectionString,response,function(){
                AddControlClickEventHandlers();
                $(selectionString).children('.modifyPresentationEntry').hide();
                $(selectionString).children('.archivedPresentationEntry').hide();
                return;
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
            dayNumber = null,
            result = null,
            updatedDate = null;

        e.preventDefault();
        e.stopImmediatePropagation();

        if($(e.target).hasClass('eventMarkerLabel'))
            e.target= $(e.target).parent();

        date = $(e.target).parent().attr("data-date");
        dayNumber = $(e.target).siblings().html();

        result = BuildDayDateString(date,dayNumber);
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

    function ModifySelectTableEntry(payload, callback)
    {
        var payload = JSON.stringify(payload),
            method = "POST";
        $.ajax({
            method: method,
            url: "../_serverSide/createPresentationTableValues.php",
            data: payload,
            async: true,
            timeout:0,
            contentType: 'application/json; charset=utf-8'
        })
        .done(function( msg ) {
            return callback(msg);
        });
    }

    function DeleteExistingEntry(index,callback)
    {
        var payload = {"presentation":{"rowName":"Index","rowValue":index},"type":3},
            method = "POST";
        payload = JSON.stringify(payload);
        $.ajax({
            method: method,
            url: "../_serverSide/createDailyPresentations.php",
            data: payload,
            async: true,
            timeout:0,
            contentType: 'application/json; charset=utf-8'
        })
        .done(function( msg ) {
            return callback(msg);
        });
    }

    function CreateNewIndividualPresentation(payload, callback)
    {
        var payload = JSON.stringify(payload),
            method = "POST";
        $.ajax({
            method: method,
            url: "../_serverSide/createDailyPresentations.php",
            data: payload,
            async: true,
            timeout:0,
            contentType: 'application/json; charset=utf-8'
        })
        .done(function( msg ) {
            return callback(msg);
        });
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
"use strict";

(function DailySchedule(window,$){

    var pageLinkBoxOffice = null,
        pageLinkFounders = null,
        pageLinkJDAT = null,
        pageLinkStar = null,
        pageLinkTools = null,
        scheduleCurrentTime = null,
        todaysEvents = null,
        comingAttractionsScrollArea = null,
        scrollAreaHeight = null,
        currentPresentation = null,
        nextPresentation = null,
        numberOfVisibleEvents = 0,
        previouslyPassedIndex = null,
        loopTime = null,
        previousLoopTime = null,
        previewMode = null;

    $(document).ready(function()
    {
        InitializeLocalReferences(function(){

            InitializeNavigationClickEvents();

            if(!todaysEvents.length)
                return;

            InitializeScheduleClock();
            scrollAreaHeight = 300;
            setInterval(ScrollComingAttractions,33);

            if(!previewMode)
            {
                ParseEventsForNowShowingAndUpNext();
                setInterval(ParseEventsForNowShowingAndUpNext,1000);
            }

        });
    });

    function CheckForPreviewParameter()
    {
        var preview = GetParameterByName("previewMode",window.location);
        if(preview)
            return true;

        return false;
    }

    function GetParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

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
        pageLinkTools = $("#pageLinkTools");
        scheduleCurrentTime = $("#scheduleCurrentTime");
        todaysEvents = $(".scheduleCalendarEntry");
        numberOfVisibleEvents = todaysEvents.length;
        comingAttractionsScrollArea = $("#comingAttractionsScrollArea");
        currentPresentation = $("#currentPresentation");
        nextPresentation = $("#nextPresentation");
        previewMode = CheckForPreviewParameter();

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
            dateTimeString += "pm";
        else
            dateTimeString += "am";

        dayName = dateTime.getDay();
        dayName = GetDayNameString(dayName);
        if(previewMode)
        {
            var day = GetParameterByName("day",window.location),
                month = GetParameterByName("month",window.location),
                year = GetParameterByName("year",window.location);

            return " Preview Mode : " + month + "/" + day + "/" + year + " 12:00:00am";
        }

        return dayName + " " + dateTimeString;
    }

    function RefreshPageEveryFifteenMinutes()
    {
        var minutes = new Date();
        minutes = minutes.getMinutes();

        if(minutes === 30|| minutes === 0 || minutes === 45|| minutes === 15)
            window.location.reload();
    }

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
            convertedEventStartTime += ":00";
            convertedEventEndTime = Convert12HourTo24Hour(eventEndTime);
            convertedEventEndTime += ":00";

            var date = new Date(),
                dateString = date.getFullYear() + "-" + (parseInt(date.getMonth())+1) + "-" + date.getDate();

            var eventStartTimeStamp = Date.parse(dateString + " " + convertedEventStartTime),
                eventEndTimeStamp = Date.parse(dateString + " " + convertedEventEndTime),
                currentTimeStamp = Date.parse(dateString + " " + timeString);


            if(currentTimeStamp >= eventStartTimeStamp  && currentTimeStamp < eventEndTimeStamp && !$(todaysEvents[i]).hasClass("hidden"))
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
        lastEventDivBounds = null;

        if(todaysEvents === null && todaysEvents === undefined || numberOfVisibleEvents===1)
        {
            if(!$(todaysEvents[todaysEvents.length-1]).hasClass("hidden"))
            {
                $(todaysEvents[todaysEvents.length-1]).addClass("hidden");
                $("#comingAttractionsContainer").addClass("hidden");
                $("#comingAttractionsHeader").addClass("hidden");
            }

            return;
        }


        if(previousLoopTime)
            loopTime = Date.now() - previousLoopTime;
        else
            loopTime = 1;

        scrollAreaHeight -=  0.018 * loopTime;

        for(var i=0; i < todaysEvents.length; i++)
        {
            if($(todaysEvents[i]).hasClass("hidden"))
                continue;

            bottomBounds = 400 + (100 * i);
            lastEventDivBounds = $(todaysEvents[todaysEvents.length-1]).offset().top + 80;

            if(lastEventDivBounds < topBounds)
            {
                $(todaysEvents[i]).css("top", bottomBounds);
                RefreshPageEveryFifteenMinutes();

                if(i >= (numberOfVisibleEvents/2)&& numberOfVisibleEvents >= 3)
                    if(i===0)
                        scrollAreaHeight = 220;
                    else
                        scrollAreaHeight = 220 + (i*10);
                else if(numberOfVisibleEvents === 1)
                    scrollAreaHeight = 0;
                else
                    scrollAreaHeight = 220 + (i*10);
            }
            else
                $(todaysEvents[i]).css("top", scrollAreaHeight);
        }

        previousLoopTime = Date.now();
    }

})(window, jQuery = window.jQuery || {} );