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
    schedulingPreviewLink = null;



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
        var topControls = "<span class='archivedPresentationEntry left'><span class='controlLabel'></span></span><span class='deletePresentationEntry left'><span class='controlLabel'></span></span><span class='modifyPresentationEntry left'><span class='controlLabel'></span></span>";
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
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 1:{
                    $(entries[c]).children(".startTimeSelect").val("10:30");
                    $(entries[c]).children(".endTimeSelect").val("11:00");
                    $(entries[c]).children(".titleSelect").val("Meet Stuffee");
                    $(entries[c]).children(".locationSelect").val("John Deere Adventure Theater, Main Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 2:{
                    $(entries[c]).children(".startTimeSelect").val("12:00");
                    $(entries[c]).children(".endTimeSelect").val("13:00");
                    $(entries[c]).children(".titleSelect").val("WHO-HD Live Weather Forecast");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 3:{
                    $(entries[c]).children(".startTimeSelect").val("13:30");
                    $(entries[c]).children(".endTimeSelect").val("14:00");
                    $(entries[c]).children(".titleSelect").val("Cold Blooded Critters");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 4:{
                    $(entries[c]).children(".startTimeSelect").val("14:00");
                    $(entries[c]).children(".endTimeSelect").val("14:30");
                    $(entries[c]).children(".titleSelect").val("Snapping Turtle Feeding");
                    $(entries[c]).children(".locationSelect").val("What on Earth?, Upper Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 5:{
                    $(entries[c]).children(".startTimeSelect").val("14:30");
                    $(entries[c]).children(".endTimeSelect").val("15:00");
                    $(entries[c]).children(".titleSelect").val("Dawn of the Space Age");
                    $(entries[c]).children(".locationSelect").val("Star Theater, Why the Sky?, Upper Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 6:{
                    $(entries[c]).children(".startTimeSelect").val("15:30");
                    $(entries[c]).children(".endTimeSelect").val("16:00");
                    $(entries[c]).children(".titleSelect").val("Iowa Skies Tonight");
                    $(entries[c]).children(".locationSelect").val("Star Theater, Why the Sky?, Upper Level");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
                    break;
                }
                case 7:{
                    $(entries[c]).children(".startTimeSelect").val("17:00");
                    $(entries[c]).children(".endTimeSelect").val("17:30");
                    $(entries[c]).children(".titleSelect").val("SCIENCE CENTER OF IOWA CLOSES");
                    $(entries[c]).children(".locationSelect").val("Thank you for visiting. Have a great night!");
                    $(entries[c]).children(".deploymentLocationSelect").val("Founders Hall");
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
        $(presentationEntryContainer).html('');
        $(headerMessageContainer).html('');
        $(schedulingPreviewLink).html("");
        PlaceSelectedDayClass(e.target);
        UpdateDailyPresentationNumber(0);
        GetDateFromEventTokenParentPutInDateInput(e);

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
            console.log("edit selections");
        });

        $(".submitAllPresentations").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#submitAllPresentationsButton").trigger("click");
        });

        $("#submitAllPresentationsButton").click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log("submit all presentations");
        });

        $('button[class^="submitEventLineButton"]').click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            BuildIndividualPayloadAndSubmit(e);
        });
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