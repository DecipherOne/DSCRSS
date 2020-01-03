<?php
$path=  $_SERVER['DOCUMENT_ROOT'];
require_once($path."/DSCRSS/neoDS/_serverSide/classes/pch.php");

$db = new \DSCRSS\DataStoreManager();
$db->Initialize("/DSCRSS/neoDS/_dataStore/_presentationSchedule.sqlite3");