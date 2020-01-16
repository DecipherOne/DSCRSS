<?php

namespace DSCRSS;

header('Content-Type:application/json; charset=utf-8');
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");

$method = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'),true);

if(sizeof($requestPayload) > 2)
  return http_response_code(403);

$presentation = $requestPayload['presentation'];
$type = $requestPayload['type'];

$rowArray = [];
$valueArray = [];

$rowString = null;
$valueString = null;

switch($method)
{
  case "POST":
  {
      switch($type)
      {
        case 1: //Create
        {
          BuildDailyPresentationArrays($rowArray,$valueArray,$presentation,$rowString, $valueString);
          if($db->WriteNewPresentationToDatabase("scheduledPresentation", $rowString, $valueString, $valueArray))
            $responseMessage =["message"=>"Presentation : <b> ".$valueArray[2]."</b> successfully scheduled.","code"=>200];
          else
            $responseMessage =["message"=>"There was an error updating, ".$valueArray[2]. " contact your webservice admin.","code"=>500];

          break;
        }
        case 2: //Update
        {
          $adjustedPresentations = RemoveWhiteSpaceFromRowNames($presentation);
          if($db->UpdateExistingEntry("scheduledPresentation", $adjustedPresentations))
            $responseMessage =["message"=>"Presentation : <b> ".$presentation[2]['rowValue']."</b> successfully updated.","code"=>200];
          else
            $responseMessage =["message"=>"There was an error updating ".$presentation[2].", contact your webservice admin.","code"=>500];

          break;
        }

        case 3: //Delete
        {
          if($db->DeleteExistingEntry("scheduledPresentation", $presentation))
            $responseMessage =["message"=>"The Event has been removed from the schedule.","code"=>200];
          else
            $responseMessage =["message"=>"There was an error updating ".$presentation[2].", contact your webservice admin.","code"=>500];

          break;
        }
        default:
          break;
      }

    echo json_encode($responseMessage);
    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}

function BuildDailyPresentationArrays(&$rowArray,&$valueArray,$presentationArray,&$rowString, &$valueString)
{
  for( $i = 0; $i < sizeof($presentationArray); $i++)
  {
    $rowTitle = RemoveWhiteSpaceFromString($presentationArray[$i]["rowName"]);
    $rowValue = $presentationArray[$i]["rowValue"];

    if(sizeof($rowArray) == 0)
      $rowArray[0] = $rowTitle;
    else
      array_push($rowArray, $rowTitle);

    if(sizeof($valueArray) == 0)
      $valueArray[0] = $rowValue;
    else
      array_push($valueArray, $rowValue);
  }

  $rowString= "(";

  for($i = 0; $i < sizeof($rowArray); $i++)
  {
    if($i < (sizeof($rowArray)-1))
      $rowString .= $rowArray[$i] .', ';
    else
      $rowString .= $rowArray[$i] .')';
  }

  $valueString= "(";

  for($i = 0; $i < sizeof($valueArray); $i++)
  {
    if($i < (sizeof($valueArray)-1))
      $valueString .= ':'.$rowArray[$i] .', ';
    else
      $valueString .= ':'.$rowArray[$i] .')';
  }
}

function RemoveWhiteSpaceFromString($string)
{
  $string = str_replace(' ', '', $string);
  return $string;
}

function RemoveWhiteSpaceFromRowNames(&$presentationArray)
{
  for( $i = 0; $i < (sizeof($presentationArray)-1); $i++)
  {
    $rowTitle = RemoveWhiteSpaceFromString($presentationArray[$i]["rowName"]);
    $presentationArray[$i]["rowName"] = $rowTitle;
  }

  return $presentationArray;
}

?>