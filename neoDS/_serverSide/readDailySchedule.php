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

    if(isset($_GET['month']))
      $month = $_GET['month'];
    else
      $month = 0;

    if(isset($_GET['year']))
      $year = $_GET['year'];
    else
      $year = 0;

    if(isset($_GET['day']))
      $day = $_GET['day'];
    else
      $day = 0;

    $screen = '';
    $where = '';
    $haveResults = false;

    if($month==0 || $day == 0 || $year == 0) //Pull in todays schedules if a specific day wasn't requested
    {
       $month =  date("m");
       $day = date("d");
       $year = date("Y");
    }
    else if(((int)$month) <= 9)
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

function ConvertTimeTo12HourFormat($time)
{
  return date("g:i a", strtotime($time));
}

function ParseAndOutputResults($response,$haveResults)
{

  if($haveResults)
    for($i =0; $i < sizeof($response); $i++)
    {
        $index = $i+1;
      if($i % 2==0)
        echo "<div class='scheduleCalendarEntry gray' index='$index'>";
      else
        echo "<div class='scheduleCalendarEntry ' index='$index'>";

      echo  "<div class='scheduleEntryGroup entryGroupStartTime'>        
                    <span class=\"presentationLabel\">
                          Begins @
                      </span>
                      <span class=\"presentationEntry\">";
      echo              ConvertTimeTo12HourFormat($response[$i]->StartTime);
      echo  "        </span>
             </div>
             <div  class='scheduleEntryGroup entryGroupEndTime'>
                      <span class=\"presentationLabel\">
                          Ends @
                      </span>
                      <span class=\"presentationEntry\">";
      echo              ConvertTimeTo12HourFormat($response[$i]->EndTime);
      echo "          </span>
             </div>
             <div class='scheduleEntryGroup entryGroupTitle'>
                        <span class=\"presentationLabel\">
                          Presentation :
                      </span>
                      <span class=\"presentationEntry\">";
      echo                $response[$i]->Title;
      echo  "        </span>
             </div>
             <div class='scheduleEntryGroup entryGroupLocation'>
                      <span class=\"presentationLabel\">
                          Where :
                      </span>
                      <span class=\"presentationEntry\">";
      echo              $response[$i]->Location;
      echo "          </span>
             </div> ";


      if($response[$i]->PresenterName != "Presenter Name")
      {
        echo " <div class='scheduleEntryGroup entryGroupLocation'>
                        <span class=\"presentationLabel\">
                            Presented By :
                        </span>
                        <span class=\"presentationEntry\">";
        echo              $response[$i]->PresenterName;
        echo "          </span>
               </div>
                    </div> ";
      }

        else
          echo "</div>";
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
        <div class='scheduleEntryGroup'>
          <span class="presentationLabel">
            Now Showing :
          </span>
          <span class="presentationEntry">
            Enjoy your day!
          </span>
        </div>
        <div class='scheduleEntryGroup'>
          <span class="presentationLabel">
            Where :
          </span>
          <span class="presentationEntry">
            Every Where!
          </span>
        </div>
        <div class='scheduleEntryGroup'>
          <span class="presentationLabel">
            Ends @ :
          </span>
          <span class="presentationEntry">
            00:00pm
          </span>
        </div>
      </div>
    </div>
  <div id="scheduleDisplayBody">
    <div id="nextPresentation" class="relativelyCentered">
      <div class='scheduleEntryGroup'>
        <span class="presentationLabel">
          Up Next :
        </span>
        <span class="presentationEntry">
           Next Presentation
        </span>
      </div>
      <div class='scheduleEntryGroup'>
        <span class="presentationLabel">
          Begins @ :
        </span>
        <span class="presentationEntry">
          00:00pm
        </span>
      </div>
      <div class='scheduleEntryGroup'>
        <span class="presentationLabel">
          Where :
        </span>
        <span class="presentationEntry">
          Star Theater
        </span>
      </div>
    </div>

    <span id="comingAttractionsHeader"><h2><u>Coming Attractions</u></h2></span>
    <div id="comingAttractionsContainer">
      <div id="comingAttractionsScrollArea">
        <?php
          ParseAndOutputResults($response, $haveResults);
        ?>
      </div>
    </div>
  </div>
  <div id="scheduleFooter">

  </div>
</div>
</body>
<footer>
  <script src="../js/001.min.js"></script>
</footer>
</html>


