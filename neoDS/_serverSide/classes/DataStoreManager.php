<?php

namespace DSCRSS;

use PDO;

$path = $_SERVER['DOCUMENT_ROOT'];
require_once($path . "/DSCRSS/neoDS/_serverSide/classes/pch.php");

class DataStoreManager
{
  private $_dbFilePath = null;
  private $_isInitialized = false;
  private $_pdo = null;
  public $config = null;


  public function Initialize($dbFilePath)
  {
    if ($this->_isInitialized)
      return;

    $this->_dbFilePath = $_SERVER['DOCUMENT_ROOT'] . $dbFilePath;
    $this->config = array('DB_FILE_PATH' => $this->_dbFilePath);

    if ($this->ConnectToDatabaseFile() == null)
      error_log("<b> Error : </b> DSCRSS:DataStoreManager : Unable to connect to Database. </br>");

    else {
      $this->_isInitialized = true;
      $this->_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      error_log("<b> Success : </b> DSCRSS:DataStoreManager : Successfully connected to Database. </br>");
    }
    error_log("    -----  <b> Attempted to load : </b>" . $this->config["DB_FILE_PATH"] . " ----- </br>");
  }

  private function ConnectToDatabaseFile()
  {
    if ($this->_pdo == null)
      try {
        $this->_pdo = new \PDO("sqlite:" . $this->config['DB_FILE_PATH']);
      } catch (\PDOException $e) {
        throw new MyDatabaseException($e->getMessage(), (int)$e->getCode());
      }

    return $this->_pdo;
  }

  public function SelectFromDatabase($targetColumns = '', $targetTabel = '', $where = '', $targetOrder = '', $limit = '')
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::SelectFromDatabase : Not Initialized.");
      return;
    }

    $selectQuery = $this->ConstructSelectQueryStructure($targetColumns, $targetTabel, $where, $targetOrder, $limit);

    try
    {
      $dbStream = $this->_pdo->query($selectQuery);
    }
    catch (\PDOException $e)
    {
      throw new MyDatabaseException($e->getMessage(), (int)$e->getCode());
    }

    $results = [];
    if ($dbStream)
      while ($r = $dbStream->fetchObject())
      {
        $results[] = $r;
      }
    else
      echo '{errorMessage: "No Results Matched"}';

    return $results;
  }

  private function ConstructSelectQueryStructure($targetColumns = '', $targetTabel = '', $where = '', $targetOrder = '', $limit = '')
  {
    $query = " SELECT " . $targetColumns . "FROM " . $targetTabel;

    if ($where != '')
      $query .= " WHERE " . $where;
    if ($targetOrder != '')
      $query .= " ORDER BY " . $targetOrder;
    if ($limit != '')
      $query .= " LIMIT " . $limit;

    return $query;
  }

  public function WriteNewPresentationToDatabase($targetTabel = '', $targetColumns = '', $values = '', $valueArray)
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::WriteToDatabase : Not Initialized.");
      return;
    }
    try
    {
      $insertQuery = $this->ConstructInsertQueryStructure($targetTabel, $targetColumns, $values);

      if (!$queryHandle = $this->_pdo->prepare("$insertQuery"))
        echo("error preparing statment " . $insertQuery);

      $queryHandle->bindParam(':StartTime', $valueArray[0]);
      $queryHandle->bindParam(':EndTime', $valueArray[1]);
      $queryHandle->bindParam(':Title', $valueArray[2]);
      $queryHandle->bindParam(':Location', $valueArray[3]);
      $queryHandle->bindParam(':PresenterName', $valueArray[4]);
      $queryHandle->bindParam(':ScreenLocation', $valueArray[5]);
      $queryHandle->bindParam(':ScheduledDate', $valueArray[6]);

      $rowCount = $queryHandle->execute();

      if ($rowCount > 0)
        return true;
      else
        return false;
    }
    catch (\PDOException $e)
    {
      echo "error message : " . $e->getMessage() . " error code : " . $e->getCode();
      throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }

  }

  private function ConstructInsertQueryStructure($targetTabel = '', $targetColumns = '', $values = '')
  {
    $query = " INSERT INTO " . $targetTabel . $targetColumns . " VALUES" . $values ;
    return $query;
  }
}