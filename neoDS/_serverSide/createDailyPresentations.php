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
        case 1: //single presentation
        {

          BuildDailyPresentationArrays($rowArray,$valueArray,$presentation,$rowString, $valueString);
          $db->WriteNewPresentationToDatabase("scheduledPresentation", $rowString, $valueString, $valueArray);

          break;
        }
        case 2: //array of presentations
        {
          break;
        }
        default:
          break;
      }

    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}

function BuildDailyPresentationArrays(&$rowArray,&$valueArray,$presentationArray,&$rowString,
  &$valueString)
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



?>