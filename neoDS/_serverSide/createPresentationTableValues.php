<?php

namespace DSCRSS;

header('Content-Type:application/json; charset=utf-8');
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");

$method = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'),true);

if(sizeof($requestPayload) > 2)
  return http_response_code(403);

$tableData = $requestPayload['tableData'];
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

        if($db->WriteNewTableEntry($tableData["tableName"], $tableData))
          $responseMessage =[
              "message"=>"<b>Table Entry Successfully Created!</b>",
              "code"=>200,
              "Index" => $db->GetLastInsertedIndex()];
        else
          $responseMessage =["message"=>"There was an error updating, ".$valueArray[2]. " contact your webservice admin.","code"=>500];

        break;
      }
      case 2: //Update
      {

       // echo "tableDataArray ->" .var_dump($tableData);

        if($db->UpdateExistingTableEntry($tableData["tableName"], $tableData))
          $responseMessage =["message"=>"<b> Table Entry Successfully Updated! </b> ","code"=>200,
              "index" => $tableData["index"]];
        else
          $responseMessage =["message"=>"There was an error updating the value, contact your webservice admin.","code"=>500];


        break;
      }

      case 3: //Delete
      {
        if($db->DeleteExistingTableEntry($tableData["tableName"], $tableData))
          $responseMessage =["message"=>"<b> Table Entry Successfully Deleted! </b> ","code"=>200];
        else
          $responseMessage =["message"=>"There was an error updating the value, contact your webservice admin.","code"=>500];
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