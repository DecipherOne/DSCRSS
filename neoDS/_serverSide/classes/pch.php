<?php

namespace DSCRSS;
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once $path.'/vendor/autoload.php';
require_once $path.'/DSCRSS/neoDS/_serverSide/classes/DataStoreManager.php';



//Project Globals
$db = new \DSCRSS\DataStoreManager();
$db->Initialize("/DSCRSS/neoDS/_dataStore/_presentationSchedule.sqlite3");