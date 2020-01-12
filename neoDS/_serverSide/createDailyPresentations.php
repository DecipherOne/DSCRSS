<?php
header('Content-Type:application/json; charset=utf-8');
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");



$method = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'),true);

switch($method) {
  case "POST":
  {

    switch($requestPayload["type"])
    {
      case 1: //single presentation
      {

        break;
      }
      case 2: //array of presentations
      {
        break;
      }
      default:
        break;
    }
   // $db->WriteToDatabase()
    $response = array('tables' => array('message'=>'poop'));
    echo json_encode($requestPayload );
    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}

function BuildDailyPresentationValueArray()
{}

?>