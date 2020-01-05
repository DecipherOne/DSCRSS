<?php
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");

$db = new \DSCRSS\DataStoreManager();
$db->Initialize("/DSCRSS/neoDS/_dataStore/_presentationSchedule.sqlite3");

ReadAllPresentations($db);


function ReadAllPresentations($db)
{
  $presentations = $db->SelectFromDatabase(" * "," scheduledPresentation ");

  foreach($presentations as $pres)
  {
    echo "</br> Entry # : ".$pres->spIndex;
    echo "</br> Scheduled Date : ".$pres->scheduledDate;
    echo "</br> Day : ".$pres->dayName;
    echo "</br> Start Time : ".$pres->startTime;
    echo "</br> End Time : ".$pres->endTime;
    echo "</br> Title : ".$pres->title;
    echo "</br> Location : ".$pres->location;
    echo "</br> Presenter : ".$pres->presenterName;
    echo "</br></br>";
  }
}
