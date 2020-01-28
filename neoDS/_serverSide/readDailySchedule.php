<?php
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
header('charset=utf-8');

$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
  case "GET":
  {
    $month = $_GET['month'];
    $year = $_GET['year'];
    $day = $_GET['day'];
    $screen = '';
    $where = '';

    if(((int)$month) <= 9)
      $month = "0".$month;

    $query = $year."-".$month."-".$day;

    if(isset($_GET['screen']) && $_GET['screen'] != '" "')
    {
      $screen = $_GET['screen'];
      $where = "ScreenLocation = ".$screen ." AND ScheduledDate = '".$query."'";
    }
    else
      $where = " ScheduledDate = '".$query."'";

    $daysPresentations = $db->SelectFromDatabase(" * "," scheduledPresentation ",
        $where, " StartTime ASC ");

    $response = $daysPresentations;

    if(sizeof($response) < 1)
      $response =["message"=>"No events matched."];
    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}
?>

<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
  <title>Science Center of Iowa Daily Schedule </title>
  <script src="js/3rdParty.min.js"></script>
  <link rel="stylesheet" type="text/css" href="../style/style.min.css">
  <link rel="shortcut icon" href="https://www.sciowa.org/favicon-194x194.png" />
</head>
<body>

<div id="scheduleContainer" class="relativelyCentered">
  <h2>Science Center of Iowa Presentation Schedules</h2>
    <div id="scheduleDisplayHeader">
    </div>
  <div id="scheduleDisplayBody">
  </div>
  <div id="scheduleFooter">

  </div>
</div>
</body>
<footer>
  <script src="js/001.min.js"></script>
</footer>
</html>


