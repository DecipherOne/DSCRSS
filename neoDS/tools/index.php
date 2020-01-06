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
  <link rel="shortcut icon" href="https://www.sciowa.org/favicon-194x194.png" />
</head>
<body>
<div id="scheduleContainer" class="relativelyCentered">
  <div id="scheduleHeader" class="bottomMargin20">
    <h3>Des Moines Science Center Responsive Scheduling System</h3>
  </div>
  <div id='calendar' class="halfWidth left"></div>
  <div id="schedulingFormContainer" class="halfWidth left">
      <form id="dailySchedulingForm">
          Scheduling From : What's on the Docket?
        <fieldset id="schedulingToolFieldset">
          <label id="schedulingToolDateLabel" for="schedulingToolDateInput">
            Date :
          </label>
          <select id="schedulingToolDateSelect" class="schedulingToolSelect" disabled>
                <option selected >Day - 00/00/0000</option>
          </select>
        </fieldset>
      </form>
  </div>
</div>
</body>
<footer>
  <script src="../js/001.min.js"></script>
  <h6>Donated By : Will Canada circa 2020 <a href="http://decipherone.com" target="_blank">DecipherOne</a>
  in partnership with <a href="http://grandconsulting.com/" target="_blank">Grand Consulting</a> </h6>
</footer>
</html>