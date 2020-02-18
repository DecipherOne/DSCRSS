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
      throw new \PDOException($e->getMessage(), (int)$e->getCode());
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

   // echo "Final Query -> " .$query;
    return $query;
  }

  public function WriteNewPresentationToDatabase($targetTabel = '', $targetColumns = '', $values = '', $valueArray)
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::WriteNewPresentationToDatabase : Not Initialized.");
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

  public function DeleteExistingEntry($targetTabel = '', $valueArray)
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::UpdateExistingEntry : Not Initialized.");
      return;
    }
    try
    {
      $deleteQuery = " DELETE FROM " .$targetTabel ." WHERE \"Index\" =:Index ";

      if (!$queryHandle = $this->_pdo->prepare($deleteQuery))
        echo("error preparing statment " . $deleteQuery);

      $index = $valueArray["rowValue"];

      $queryHandle->bindParam(':Index', $index, PDO::PARAM_INT);

      $success = $queryHandle->execute();

      if ($success)
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

  public function DeleteExistingTableEntry($targetTabel = '', $tableData)
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::UpdateExistingEntry : Not Initialized.");
      return;
    }
    try
    {
      $deleteQuery = " DELETE FROM " .$targetTabel ." WHERE \"index\" =:index ";

      if (!$queryHandle = $this->_pdo->prepare($deleteQuery))
        echo("error preparing statment " . $deleteQuery);

      $index = $tableData["index"];

      $queryHandle->bindParam(':index', $index, PDO::PARAM_INT);

      $success = $queryHandle->execute();

      if ($success)
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

  public function UpdateExistingTableEntry($targetTabel = '', $tableData)
  {
    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::UpdateExistingEntry : Not Initialized.");
      return;
    }
    try
    {

      $query = " UPDATE " .$targetTabel;

      switch($targetTabel)
      {
        case "presentationLocations":
        {
          $query .= " SET locationName = :locationName";
          break;
        }
        case "presentationTitles":
        {
          $query .= " SET title = :title";
          break;
        }
        case "Presenters":
        {
          $query .= " SET Name = :Name";
          break;
        }
        default:
        {
          break;
        }
      }

      $query .=" WHERE \"index\" =:index ";

      if (!$queryHandle = $this->_pdo->prepare($query))
        echo("error preparing statment " . $query);

      $index = $tableData["index"];

      switch($targetTabel)
      {
        case "presentationLocations":
        {
          $queryHandle->bindParam(':locationName', $tableData["locationName"]);
          break;
        }
        case "presentationTitles":
        {
          $queryHandle->bindParam(':title', $tableData["title"]);
          break;
        }
        case "Presenters":
        {
          $queryHandle->bindParam(':Name', $tableData["Name"]);
          break;
        }
        default:
        {
          break;
        }
      }

      $queryHandle->bindParam(':index', $index, PDO::PARAM_INT);
      $success = $queryHandle->execute();

      if ($success)
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

  public function UpdateExistingEntry($targetTabel = '', $presentation)
  {

    if (!$this->_isInitialized)
    {
      error_log(" Unable to DataStoreManager::UpdateExistingEntry : Not Initialized.");
      return;
    }
    try
    {
      $updateQuery = $this->ConstructUpdateQueryStructure($targetTabel, $presentation);

      if (!$queryHandle = $this->_pdo->prepare($updateQuery))
        echo("error preparing statment " . $updateQuery);

      $index = $presentation[7]["rowValue"];

      $queryHandle->bindParam(':StartTime', $presentation[0]["rowValue"]);
      $queryHandle->bindParam(':EndTime', $presentation[1]["rowValue"]);
      $queryHandle->bindParam(':Title', $presentation[2]["rowValue"]);
      $queryHandle->bindParam(':Location', $presentation[3]["rowValue"]);
      $queryHandle->bindParam(':PresenterName', $presentation[4]["rowValue"]);
      $queryHandle->bindParam(':ScreenLocation', $presentation[5]["rowValue"]);
      $queryHandle->bindParam(':ScheduledDate', $presentation[6]["rowValue"]);
      $queryHandle->bindParam(':Index', $index, PDO::PARAM_INT);

      $success = $queryHandle->execute();

      if ($success)
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

  private function ConstructUpdateQueryStructure($targetTabel = '')
  {
    $query = " UPDATE " .$targetTabel;
    $query .= " SET StartTime = :StartTime, EndTime = :EndTime, Title = :Title,";
    $query .= " Location = :Location, PresenterName = :PresenterName,";
    $query .= " ScreenLocation = :ScreenLocation, ScheduledDate = :ScheduledDate";
    $query .=" WHERE \"Index\" =:Index ";

    return $query;
  }

  public function GetLastInsertedIndex()
  {
    return $this->_pdo->lastInsertId();
  }
}