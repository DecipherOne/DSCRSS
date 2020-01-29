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
    $haveResults = false;

    if($month==0) //Pull in todays schedules if a specific day wasn't requested
    {
       $month =  date("m");
       $day = date("d");
       $year = date("Y");
    }

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
    else
      $haveResults = true;

    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}

function ParseAndOutputResults($response,$haveResults)
{

  if($haveResults)
    for($i =0; $i < sizeof($response); $i++)
    {
      if($i % 2==0)
        echo "<div class='scheduleCalendarEntry '>";
      else
        echo "<div class='scheduleCalendarEntry gray'>";

      echo  "        <span class=\"presentationLabel\">
                          Begins @
                      </span>
                      <span class=\"presentationEntry\">";
      echo          $response[$i]->StartTime;
      echo  "</span>
                      <span class=\"presentationLabel\">
                          Ends @
                      </span>
                      <span class=\"presentationEntry\">";
      echo        $response[$i]->EndTime;
      echo "</span>
                        <span class=\"presentationLabel\">
                          Presentation :
                      </span>
                      <span class=\"presentationEntry\">";
      echo          $response[$i]->Title;
      echo  "</span>
                      <span class=\"presentationLabel\">
                          Building Location :
                      </span>
                      <span class=\"presentationEntry\">";
      echo        $response[$i]->Location;
      echo "</span>
                  </div> ";
    }
  else
    echo " No Scheduled presentation for this day and screen.";
}
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

    <div id="scheduleDisplayHeader">
      <div id="scheduleWelcomeMessage">
        <h2>Welcome To The Science Center of Iowa</h2>
      </div>
      <div id="scheduleCurrentTime">
        <h2>00:00:00am</h2>
      </div>
      <div id="currentPresentation">
        <span class="presentationLabel">
          Current Presentation :
        </span>
        <span class="presentationEntry">
          The Presentation that is happening now
        </span>
        <span class="presentationLabel">
          Ends @ :
        </span>
        <span class="presentationEntry">
          00:00pm
        </span>
      </div>
    </div>
  <div id="scheduleDisplayBody">
      <?php
        ParseAndOutputResults($response, $haveResults);
      ?>
  </div>
  <div id="scheduleFooter">

  </div>
</div>
</body>
<footer>
  <script src="../js/001.min.js"></script>
</footer>
</html>


