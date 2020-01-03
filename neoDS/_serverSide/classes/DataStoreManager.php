<?php

namespace DSCRSS;

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
      echo "<b> Error : </b> DSCRSS:DataStoreManager : Unable to connect to Database. </br>";

    else
    {
      $this->_isInitialized = true;
      echo "<b> Success : </b> DSCRSS:DataStoreManager : Successfully connected to Database. </br>";
    }

    echo "    -----  <b> Attempted to load : </b>" . $this->config["DB_FILE_PATH"] . " ----- </br>";
  }

  private function ConnectToDatabaseFile()
  {
    if($this->_pdo == null)
      $this->_pdo = new \PDO("sqlite:".$this->config['DB_FILE_PATH']);

    return $this->_pdo;
  }
}