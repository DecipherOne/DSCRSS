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
  <title>Science Center of Iowa Scheduling Tool </title>
  <script src="js/3rdParty.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style/style.min.css">
  <link rel="shortcut icon" href="https://www.sciowa.org/favicon-194x194.png" />
</head>
<body>

<div id="scheduleContainer" class="relativelyCentered">

     <h2>Science Center of Iowa Presentation Schedules</h2>

    <div id="scheduleBody">
        Please click on one of the links below to access the schedule displayed on the screen at the building location.
      <div id="schedulePageLinksContainer" class="topMargin20 bottomMargin20">
        <span id="pageLinkBoxOffice" class="schedulePageLink">Box Office</span>
        <span id="pageLinkFoundersHall" class="schedulePageLink">Founders Hall</span>
        <span id="pageLinkJDAT" class="schedulePageLink">John Deer Adventure Theater</span>
        <span id="pageLinkStar" class="schedulePageLink">Star Theater</span>
      </div>
    </div>
    <div id="scheduleFooter">
        <span id="pageLinkTools" class="schedulePageLink">Tools</span>
    </div>
</div>
</body>
<footer>
  <script src="js/001.min.js"></script>
</footer>
</html>