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
  return date("g:ia", strtotime($time));
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
      echo "        <div class='scheduleEntryGroup entryGroupTitle'>
                        <span class=\"presentationLabel\">
                          Program :
                      </span>
                      <span class=\"presentationEntry\">";
      echo                $response[$i]->Title;
      echo  "        </span></div> ";
      echo  "<div class='scheduleEntryGroup entryGroupStartTime'>        
                    <span class=\"presentationLabel\">
                          Begins :
                      </span>
                      <span class=\"presentationEntry\">";
      echo              ConvertTimeTo12HourFormat($response[$i]->StartTime);
      echo  "        </span> </div> ";
      echo  "       <div  class='scheduleEntryGroup entryGroupEndTime'>
                      <span class=\"presentationLabel\">
                          Ends :
                      </span>
                      <span class=\"presentationEntry\">";
      echo              ConvertTimeTo12HourFormat($response[$i]->EndTime);
      echo "          </span></div>";
      echo "<div class='scheduleEntryGroup entryGroupLocation'>
                      <span class=\"presentationLabel\">
                          Location :
                      </span>
                      <span class=\"presentationEntry\">";
      echo              $response[$i]->Location;
      echo "          </span></div> ";


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
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1"/>
  <title>Science Center of Iowa Daily Schedule </title>
  <script src="../js/3rdParty.min.js"></script>
  <link rel="stylesheet" type="text/css" href="../style/style.min.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
  <link rel="shortcut icon" href="https://www.sciowa.org/favicon-194x194.png" />
</head>
<body>

<div id="scheduleContainer" class="relativelyCentered">

    <div id="scheduleDisplayHeader">
      <div id="scheduleWelcomeMessage">
        <h2>Welcome to the Science Center of Iowa!</h2>
      </div>
      <div id="scheduleCurrentTime">
        <h2>00:00:00am</h2>
      </div>
      <div id="currentPresentation">
        <div class='scheduleEntryGroup entryGroupTitle'>
          <span class="presentationLabel">
            Happening Now :
          </span>
          <span class="presentationEntry">
            ---------------
          </span>
        </div>
        <div class='scheduleEntryGroup entryGroupLocation'>
          <span class="presentationLabel">
            Location :
          </span>
          <span class="presentationEntry">
            ---------------
          </span>
        </div>
        <div class='scheduleEntryGroup entryGroupEndTime'>
          <span class="presentationLabel">
            Ends :
          </span>
          <span class="presentationEntry">
             ---------------
          </span>
        </div>
      </div>
    </div>
  <div id="scheduleDisplayBody">
    <div id="nextPresentation" class="relativelyCentered">
      <div class='scheduleEntryGroup entryGroupTitle'>
        <span class="presentationLabel">
          Next Program :
        </span>
        <span class="presentationEntry">
           -----
        </span>
      </div>
      <div class='scheduleEntryGroup entryGroupStartTime'>
        <span class="presentationLabel">
          Begins :
        </span>
        <span class="presentationEntry">
          --:--
        </span>
      </div>
      <div class='scheduleEntryGroup entryGroupLocation'>
        <span class="presentationLabel">
          Location :
        </span>
        <span class="presentationEntry">
          -----
        </span>
      </div>
    </div>

    <span id="comingAttractionsHeader"><h2><u>Upcoming Programs</u></h2></span>
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
    <!--  <script src="../static_build/js/compiled/001.js"></script>-->
    </footer>
    </html>


