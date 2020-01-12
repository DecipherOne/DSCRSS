<?php

namespace DSCRSS;

use http\Exception;

$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");

class DataStoreManager
{
  private $_dbFilePath = null;
  private $_isInitialized = false;
  private $_pdo = null;
  public $config = null;


  public function Initialize($dbFilePath)
  {
    if($this->_isInitialized)
      return;

    $this->_dbFilePath = $_SERVER['DOCUMENT_ROOT'].$dbFilePath;
    $this->config = array('DB_FILE_PATH' => $this->_dbFilePath);

    if($this->ConnectToDatabaseFile()==null)
      error_log("<b> Error : </b> DSCRSS:DataStoreManager : Unable to connect to Database. </br>");

    else
    {
      $this->_isInitialized = true;
      error_log("<b> Success : </b> DSCRSS:DataStoreManager : Successfully connected to Database. </br>");
    }
    error_log("    -----  <b> Attempted to load : </b>" . $this->config["DB_FILE_PATH"] . " ----- </br>");
  }

  private function ConnectToDatabaseFile()
  {
    if($this->_pdo == null)
      try
      {
        $this->_pdo = new \PDO("sqlite:".$this->config['DB_FILE_PATH']);
      }
      catch(\PDOException $e)
      {
        throw new MyDatabaseException( $e->getMessage( ) , (int)$e->getCode( ) );
      }

    return $this->_pdo;
  }

  public function SelectFromDatabase($targetColumns='', $targetTabel='', $where='', $targetOrder = '', $limit='')
  {
    if(!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::SelectFromDatabase : Not Initialized.");
      return;
    }

    $selectQuery = $this->ConstructSelectQueryStructure($targetColumns, $targetTabel, $where, $targetOrder, $limit);

    //echo $selectQuery;
    try{
      $dbStream = $this->_pdo->query($selectQuery);
    }
    catch(\PDOException $e)
    {
      throw new MyDatabaseException( $e->getMessage( ) , (int)$e->getCode( ) );
    }

    $results = [];
    if($dbStream)
      while($r = $dbStream->fetchObject())
      {
        $results[] = $r;
      }
    else
      echo '{errorMessage: "No Results Matched"}';

    return $results;
  }

  private function ConstructSelectQueryStructure($targetColumns='', $targetTabel='',$where='', $targetOrder = '', $limit='')
  {
     $query = " SELECT ".$targetColumns . "FROM ". $targetTabel;

     if($where != '')
       $query .= " WHERE ". $where;
     if($targetOrder != '')
       $query .= " ORDER BY ". $targetOrder;
     if($limit != '')
       $query .= " LIMIT " .$limit;

     return $query;
  }

  public function WriteToDatabase($targetTabel='',$targetColumns='',$values='')
  {
    if(!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::WriteToDatabase : Not Initialized.");
      return;
    }

    $insertQuery = $this->ConstructInsertQueryStructure( $targetTabel, $targetColumns, $values);

    //echo $insertQuery;
    try{
      $dbStream = $this->_pdo->query($insertQuery);
    }
    catch(\PDOException $e)
    {
      throw new MyDatabaseException( $e->getMessage( ) , (int)$e->getCode( ) );
    }

    $results = [];
    if($dbStream)
      while($r = $dbStream->fetchObject())
      {
        $results[] = $r;
      }

    return $results;
  }

  private function ConstructInsertQueryStructure($targetTabel='', $targetColumns='', $values='')
  {
    $query = " INSERT INTO " . $targetTabel . " VALUES ".$targetColumns;

    echo $query;
    //return $query;
  }


}