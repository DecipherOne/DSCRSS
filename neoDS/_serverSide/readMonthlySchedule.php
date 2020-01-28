<?php
header('Content-Type:application/json; charset=utf-8');
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");



$method = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'),true);

switch($method) {
  case "POST":
  {
    $month = $requestPayload['month'];
    $year = $requestPayload['year'];

    $query = $year."-".$month."%";

    $monthsPresentations = $db->SelectFromDatabase(" * "," scheduledPresentation ",
        " scheduledDate LIKE '".$query."'");

    $response = $monthsPresentations;

    echo json_encode($response);
    break;
  }
  default:
  {
    http_response_code(403);
    echo " You do not have permission to access this resource.";
  }
}