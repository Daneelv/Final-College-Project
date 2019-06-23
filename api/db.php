<?php
require_once('config.php');
require_once('log.php');

ini_set('memory_limit', '-1');

class DB
{	
	private $Conf=NULL;
	private $sCRLF="\r\n";
	private $config;
	private $aLink = NULL;
	private $success = TRUE;
	private $LOG = NULL;
	private $genericFunctions = NULL;
	
	public function __construct() {
		$config = new Config;
		$this->LOG = new Log;
		$this->genericFunctions = new GenericFunctions;
		$this->Conf=array();
		$this->Conf["database"]["host"]=$config->server;
		$this->Conf["database"]["databasename"]=$config->dbase;
		$this->Conf["database"]["username"]=$config->user;
		$this->Conf["database"]["password"]=$config->password;
		$this->Conf["database"]["system_source_uuid"]=$config->system_source_uuid;
		$db = $this->Conf["database"];
		$this->aLink=mysqli_connect($db["host"],$db["username"],$db["password"],$db["databasename"]);
		if (mysqli_connect_errno()) {
			$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "CONNECT ERROR ".mysqli_connect_error(),Log::ERROR);
		}
		mysqli_autocommit($this->aLink, FALSE);
	}
	
	function __destruct() {
		if (!$this->success) {
			$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "mysqli_rollback(this->aLink)",Log::DEBUG);
			mysqli_rollback($this->aLink);
		} else {
			$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "mysqli_commit(this->aLink)",Log::DEBUG);
			mysqli_commit($this->aLink);
		}
		mysqli_close($this->aLink);
   }
	
	function doSQL($sQuery){
		$callers=debug_backtrace();
		$this->LOG->l($callers[1]['file'], __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::DEBUG);
		global $Conf;
		$aOutput=array();
		$pattern = '/INSERT/i';
		  
		$sQuery=str_replace("&nbsp;","",$sQuery);
		$sQueryCut=substr($sQuery,0,1500);
		if($aResult=@mysqli_query($this->aLink, $sQuery))
		{
			if(preg_match($pattern,$sQuery))
			{
				$mp = mysqli_insert_id($this->aLink);
				@mysqli_free_result($aResult);
				return $mp;
			}
			while ($aRow=@mysqli_fetch_array($aResult,MYSQL_BOTH)){
				$aOutput[]=$aRow;
			}
			return $aOutput;
		} else {
			$callers=debug_backtrace();
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL ERROR ".mysqli_error($this->aLink),Log::ERROR);
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::INFO);
			$this->success = false;
			$response = array();
			$response["error"] = mysqli_error($this->aLink);
			return $response;
		}
	}
	
	function doJSON($sQuery){
		$callers=debug_backtrace();
		$this->LOG->l($callers[1]['file'], __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::DEBUG);
		global $Conf;
		$aOutput=array();
		$pattern = '/INSERT/i';
		  
		$sQuery=str_replace("&nbsp;","",$sQuery);
		$sQueryCut=substr($sQuery,0,1500);
		  
		if($aResult=@mysqli_query($this->aLink, $sQuery))
		{
			$size = mysqli_num_rows($aResult);
			$rs = array();
			
			for ($i = 0; $i < $size; $i++) {
				$rs[] = mysqli_fetch_assoc($aResult);
				// you don�t really need to do anything here.
			}
			$json = json_encode($rs);
			
			if(preg_match($pattern,$sQuery))
			{
				$mp = mysqli_insert_id($this->aLink);
				@mysqli_free_result($aResult);
				mysqli_close($this->aLink);
				return $mp;
			}
			return $json;
		} else {
			$callers=debug_backtrace();
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL ERROR ".mysqli_error($this->aLink),Log::ERROR);
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::INFO);
			$this->success = false;
			$response = array();
			$response["error"] = mysqli_error($this->aLink);
			return $response;
		}
	}
	
	function doArray($sQuery){
		$callers=debug_backtrace();
		$this->LOG->l($callers[1]['file'], __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::DEBUG);
		global $Conf;
		$aOutput=array();
		$pattern = '/INSERT/i';
		  
		$sQuery=str_replace("&nbsp;","",$sQuery);
		$sQueryCut=substr($sQuery,0,1500);
		 
		if($aResult=@mysqli_query($this->aLink, $sQuery))
		{
			$size = mysqli_num_rows($aResult);
			$rs = array();
			
			for ($i = 0; $i < $size; $i++) {
				$rs[] = mysqli_fetch_assoc($aResult);
				// you dont really need to do anything here.
			}
			
			if(preg_match($pattern,$sQuery))
			{
				$mp = mysqli_insert_id($this->aLink);
				@mysqli_free_result($aResult);
				mysqli_close($this->aLink);
				return $mp;
			}
			return $rs;
		} else {
			$callers=debug_backtrace();
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL ERROR ".mysqli_error($this->aLink),Log::ERROR);
			$this->LOG->l(__FILE__, __LINE__,$callers[1]['function'], "SQL QUERY [".$sQuery."]",Log::INFO);
			$this->success = false;
			$response = array();
			$response["error"] = mysqli_error($this->aLink);
			return $response;
		}
	}
	
	function replaceWithNULL($input) {
		if ($input == '') {
			return "NULL";
		} else {
			return "'".$input."'";
		}
	}
	function cleanInput($input) {
		global $Conf;
		return mysqli_real_escape_string($this->aLink, $input);
	}
	
	function loginDB($email_address, $password){
		$sql = "SELECT u.*, ug.sUserGroupName
				FROM tusers u
				JOIN tusergroup ug
				ON u.UserGroup_fkUserGroupUID = ug.pkUserGroupUID
				WHERE sUserEmail='" . $email_address . "' 
				AND sUserPassword='" . $password . "'";
		return $this->doSQL($sql);
	}
	
	function logOutDB($session_key) {
		$sql = "UPDATE tusers SET sUserSessionKey = NULL, dDateUpdated=NOW() WHERE session_key = '" . $session_key . "'";
		return $this->doSQL($sql);
	}
	
	function setSessionKeyDB($session_key, $email_address){	
		$sql = "UPDATE tusers SET sUserSessionKey='" . $session_key . "', dDateUpdated=NOW() WHERE sUserEmail = '" . $email_address . "'";
		return $this->doSQL($sql);
	}
	
	function checkSessionKeyDB($session_key){
		$sql = "SELECT sUserSessionKey as session_key FROM tusers WHERE sUserSessionKey = '" . $session_key . "'";
		return $this->doSQL($sql);
	}
	
	function getAllUserGroups(){
		$sql = "SELECT `pkUserGroupUID` as uid, `sUserGroupName` as name, `sUserGroupDescription`, `dDateCreated`, `dDateUpdated` FROM `tusergroup` WHERE 1";
		return $this->doArray($sql);
	}
	
	function getAllGenerics(){
		/* SITE OVERVIEW COUNT CALLS */
		$sql = "SELECT COUNT(*) total_stores FROM tstores WHERE 1;";
		$rs = $this->doArray($sql);
		$result['total_stores'] = $rs[0]['total_stores'];
		
		$sql = "SELECT COUNT(*) total_media FROM tmedia WHERE 1;";
		$rs = $this->doArray($sql);
		$result['total_media'] = $rs[0]['total_media'];
		
		$sql = "SELECT COUNT(*) total_chart_categories FROM tchartCategory WHERE 1;";
		$rs = $this->doArray($sql);
		$result['total_chart_categories'] = $rs[0]['total_chart_categories'];
		
		$sql = "SELECT COUNT(*) total_genres FROM tgenre WHERE 1";
		$rs = $this->doArray($sql);
		$result['total_genres'] = $rs[0]['total_genres'];
		
		$sql = "SELECT COUNT(*) total_users FROM tusers WHERE 1;";
		$rs = $this->doArray($sql);
		$result['total_users'] = $rs[0]['total_users'];	
		
		$sql = "SELECT COUNT(*) total_user_groups FROM tusergroup WHERE 1;";
		$rs = $this->doArray($sql);
		$result['total_user_groups'] = $rs[0]['total_user_groups'];
		
		/* TOP 5 MEDIA SOLD */
		$sql = "SELECT SUM(ts.`sAmount`) `TotalCopiesSold` FROM `tsales` ts";
		$rs = $this->doArray($sql);
		$result['total_copies_sold'] = $rs[0]['TotalCopiesSold'];	
		
		$sql = "SELECT tm.sMediaName as name, SUM(ts.`sAmount`) `CopiesSold`
				FROM `tsales` ts 
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				WHERE ts.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tm.sMediaName
				ORDER BY `CopiesSold` DESC
				LIMIT 5";

		$rs = $this->doArray($sql);
		$result['weekly_top_5_sold'] = $rs;	

		$sql = "SELECT tst.`sStoreName` as name, SUM(ts.`sAmount`) `TotalSales`
				FROM `tsales` ts 
				JOIN `tstores` tst
				ON ts.`Store_fkStoreUID` = tst.`pkStoreUID`
				WHERE ts.`dDateCreated` BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tst.`sStoreName`
				ORDER BY `TotalSales` DESC
				LIMIT 5";

		$rs = $this->doArray($sql);
		$result['weekly_top_5_store_sales'] = $rs;	
		
		
		/* RECENT CHANGES CALLS */
		$sql = "SELECT `sStoreName` as name, `sAddressCityTown` as city, `dDateCreated` as date
				FROM `tstores` 
				WHERE dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				ORDER BY `dDateCreated` DESC;";
		$rs = $this->doArray($sql);
		$result['weekly_store_updates'] = $rs;
		
		$sql = "SELECT `sMediaName` as name, `sGenreName` as genreName, `sChartCategory` as categoryName, `tmedia`.`dDateCreated` as date 
				FROM `tmedia`
				JOIN `tgenre`
				ON `tmedia`.`Genre_fkGenreUID` = `tgenre`.`pkGenreUID`
				JOIN `tchartcategory`
				ON `tmedia`.`Chart_fkChartUID` = `tchartcategory`.`pkChartCatUID`
				WHERE `tmedia`.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				ORDER BY `tmedia`.`dDateCreated` DESC;";
		$rs = $this->doArray($sql);
		$result['weekly_media_updates'] = $rs;
		
		$sql = "SELECT `sChartCategory` as name, `dDateCreated` as date
				FROM `tchartcategory` 
				WHERE dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				ORDER BY `dDateCreated` DESC;";
		$rs = $this->doArray($sql);
		$result['weekly_category_updates'] = $rs;
		
		$sql = "SELECT `sGenreName` as name, `dDateCreated` as date
				FROM `tgenre`
				WHERE dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				ORDER BY `dDateCreated` DESC;";
		$rs = $this->doArray($sql);
		$result['weekly_genre_updates'] = $rs;
		
		$sql = "SELECT u.`sUserFirstName` as firstName, u.`sUserLastName` as lastName, u.`sUserEmail` as emailAddress, u.`dDateCreated` as date, ug.sUserGroupName as userGroup
				FROM tusers u
				JOIN tusergroup ug
				ON u.UserGroup_fkUserGroupUID = ug.pkUserGroupUID
				WHERE u.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				ORDER BY u.`dDateCreated` DESC;";
		$rs = $this->doArray($sql);
		$result['weekly_user_updates'] = $rs;
		
		
		return $result;
	}

	function getAllSales($stores, $media, $chart_categories, $genre, $startDate, $endDate){
		$sql = "SELECT ts.`pkSalesUID` as uid, ts.`sWeekOfSales` as weekOfSales, ts.`sAmount` as amount, ts.`Media_fkMediaUID` as mediaUID, tm.`sMediaName` as mediaName, ts.`Store_fkStoreUID` as storeUID, tst.`sStoreName` as storeName, tc.`pkChartCatUID` as chartUID , tc.`sChartCategory` as chartCategory, tg.`pkGenreUID` as genreUID, `sGenreName` as genreName
				FROM `tsales` ts
				JOIN `tmedia` tm
				ON  ts.`Media_fkMediaUID` = tm.`pkMediaUID`
				JOIN `tstores` tst
				ON ts.`Store_fkStoreUID` = tst.`pkStoreUID`
				JOIN `tchartcategory` tc
				ON tm.`Chart_fkChartUID` = tc.`pkChartCatUID`
				JOIN `tgenre` tg
				ON tm.`Genre_fkGenreUID` = tg.`pkGenreUID` ";
		
		$sql_where = "WHERE 1 ";
		if($stores != null){
			$sql_where = $sql_where . " AND ts.`Store_fkStoreUID` = '" . $stores . "'";
		}
		if($media != null){
			$sql_where = $sql_where . " AND ts.`Media_fkMediaUID` = '" . $media . "'";
		}
		if($chart_categories != null){
			$sql_where = $sql_where . " AND tc.`pkChartCatUID` = '" . $chart_categories . "'";
		}
		if($genre != null){
			$sql_where = $sql_where . " AND tg.`pkGenreUID` = '" . $genre . "'";
		}
		if($startDate != null && $endDate != null){
			$sql_where = $sql_where . " AND `sWeekOfSales` BETWEEN '" . $startDate . "' AND '" . $endDate . "'";
		}
		
		$sql = $sql . $sql_where . " ORDER BY weekOfSales ASC";
		
		return $this->doArray($sql);
	}

	function getAllStores(){
		$sql = "SELECT `pkStoreUID` as uid, `sStoreName` as name, `sStoreDescription`, `sStoreContactNumber`, `sStoreEmail`, `sAddress1`, `sAddress2`, `sAddress3`, `sAddressCityTown`, `sPostalCode`, `sAddressType`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tstores` WHERE 1
				ORDER BY name ASC";
		return $this->doArray($sql);
	}

	function addStore($pkStoreUID, $sStoreName, $sStoreDescription, $sStoreContactNumber, $sStoreEmail, $sAddress1, $sAddress2, $sAddress3, $sAddressCityTown, $sPostalCode, $sAddressType, $blsArchived, $sArchivedReason){
		$sStoreDescription = $sStoreDescription != ""? "'" . $sStoreDescription . "'" : 'NULL'; 
		$sStoreContactNumber = $sStoreContactNumber != ""? "'" . $sStoreContactNumber . "'" : 'NULL'; 
		$sAddress2 = $sAddress2 != ""? "'" . $sAddress2 . "'" : 'NULL'; 
		$sAddress3 = $sAddress3 != ""? "'" . $sAddress3 . "'" : 'NULL'; 
		$sPostalCode = $sPostalCode != ""? "" . $sPostalCode . "" : 'NULL'; 
		$sAddressType = $sAddressType != ""? "'" . $sAddressType . "'" : 'NULL'; 
		
		$sql = "INSERT INTO `tstores`
				(`pkStoreUID`, `sStoreName`, `sStoreDescription`, `sStoreContactNumber`, `sStoreEmail`, `sAddress1`, `sAddress2`, `sAddress3`, `sAddressCityTown`, `sPostalCode`, `sAddressType`, `dDateCreated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) 
				VALUES ('" . $pkStoreUID . "', '" . $sStoreName . "', " . $sStoreDescription . ", " . $sStoreContactNumber . ", '" . $sStoreEmail . "', '" . $sAddress1 . "', " . $sAddress2 . ", " . $sAddress3 . ", '" . $sAddressCityTown . "', " . $sPostalCode . ", " . $sAddressType . ", NOW(), '". $blsArchived . "', NULL, '" . $sArchivedReason . "') 
				ON DUPLICATE KEY UPDATE  sStoreName = '".$sStoreName."', sStoreDescription = ".$sStoreDescription.", sStoreContactNumber = ".$sStoreContactNumber.", sStoreEmail = '".$sStoreEmail."',sAddress1 = '".$sAddress1."',sAddress2 = ".$sAddress2.",sAddress3 = ".$sAddress3.",sAddressCityTown = '".$sAddressCityTown."',sPostalCode = ".$sPostalCode.",sAddressType = ".$sAddressType.", `dDateUpdated` = NOW(), blsArchived = '".$blsArchived."', `dDateArchived` = NULL, sArchivedReason = '" . $sArchivedReason . "'";

		return $this->doSQL($sql);
	}

	function deleteStore($pkStoreUID){
		$sql = "DELETE FROM `tstores` WHERE pkStoreUID = '" . $pkStoreUID . "'";
		return $this->doSQL($sql);	
	}
	
	function getAllMedia(){
		$sql = "SELECT `pkMediaUID` as uid, `sMediaName` as name, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tmedia` WHERE 1
				ORDER BY name ASC";
		return $this->doArray($sql);
	}
	
	function getMediaByGenre($genre){
		$sql = "SELECT `pkMediaUID` as uid, `sMediaName` as name, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tmedia`
				WHERE `Genre_fkGenreUID` = '" . $genre . "'";
		return $this->doArray($sql);
	}
	
	function getMediaByChart($chart){
		$sql = "SELECT `pkMediaUID` as uid, `sMediaName` as name, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tmedia`
				WHERE `Chart_fkChartUID` = '" . $chart . "'";
		return $this->doArray($sql);
	}
	
	function getMediaByAllFilters($genre, $chart){
		$sql = "SELECT `pkMediaUID` as uid, `sMediaName` as name, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tmedia` 
				WHERE `Genre_fkGenreUID` = '" . $genre . "'
				AND `Chart_fkChartUID` = '" . $chart . "'
				ORDER BY name ASC";
		return $this->doArray($sql);
	}
	
	function addMedia($pkMediaUID, $sMediaName, $sMediaDescription, $Genre_fkGenreUID, $Chart_fkChartUID, $blsArchived, $sArchivedReason){		
		$sql = "INSERT INTO `tmedia`
				(`pkMediaUID`, `sMediaName`, `sMediaDescription`, `Genre_fkGenreUID`, `Chart_fkChartUID`, `dDateCreated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) 
				VALUES ('" . $pkMediaUID . "', '" . $sMediaName . "', '" . $sMediaDescription . "', '" . $Genre_fkGenreUID . "', '" . $Chart_fkChartUID . "', NOW(), '". $blsArchived . "', NULL, '" . $sArchivedReason . "') 
				ON DUPLICATE KEY UPDATE  sMediaName = '".$sMediaName."', sMediaDescription = '".$sMediaDescription."', Genre_fkGenreUID = '".$Genre_fkGenreUID."', Chart_fkChartUID = '".$Chart_fkChartUID."', `dDateUpdated` = NOW(), blsArchived = '".$blsArchived."', `dDateArchived` = NULL, sArchivedReason = '" . $sArchivedReason . "'";
		return $this->doSQL($sql);
	}
	
	function deleteMedia($pkMediaUID){
		$sql = "DELETE FROM `tmedia` WHERE pkMediaUID = '" . $pkMediaUID . "'";
		return $this->doSQL($sql);		
	}
	
	function getAllChartCategories(){
		$sql = "SELECT `pkChartCatUID` as uid, `sChartCategory` as name, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tchartcategory` WHERE 1
				ORDER BY name ASC";
		return $this->doArray($sql);
	}
	
	function addChartCategory($pkChartCatUID, $sChartCategory, $blsArchived, $sArchivedReason){
		$sql = "INSERT INTO `tchartcategory`
				(`pkChartCatUID`, `sChartCategory`, `dDateCreated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) 
				VALUES ('" . $pkChartCatUID . "', '" . $sChartCategory . "', NOW(), '". $blsArchived . "', NULL, '" . $sArchivedReason . "') 
				ON DUPLICATE KEY UPDATE  sChartCategory = '".$sChartCategory."', `dDateUpdated` = NOW(), blsArchived = '".$blsArchived."', `dDateArchived` = NULL, sArchivedReason = '" . $sArchivedReason . "'";
		return $this->doSQL($sql);
	}
	
	function deleteChartCategory($pkChartCatUID){
		$sql = "DELETE FROM `tchartcategory` WHERE pkChartCatUID = '" . $pkChartCatUID . "'";
		return $this->doSQL($sql);		
	}

	function getAllGenres(){
		$sql = "SELECT `pkGenreUID` as uid, `sGenreName` as name, `sGenreDesc`, `dDateCreated`, `dDateUpdated`, `blsArchived`, `dDateArchived`, `sArchivedReason` 
				FROM `tgenre` WHERE 1
				ORDER BY name ASC";
		return $this->doArray($sql);
	}

	function addGenre($pkGenreUID, $sGenreName, $sGenreDesc, $blsArchived, $sArchivedReason){
		$sql = "INSERT INTO `tgenre`
				(`pkGenreUID`, `sGenreName`, `sGenreDesc`, `dDateCreated`, `blsArchived`, `dDateArchived`, `sArchivedReason`) 
				VALUES ('" . $pkGenreUID . "', '" . $sGenreName . "', '" . $sGenreDesc . "', NOW(), '". $blsArchived . "', NULL, '" . $sArchivedReason . "') 
				ON DUPLICATE KEY UPDATE  sGenreName = '".$sGenreName."', sGenreDesc = '".$sGenreDesc."', `dDateUpdated` = NOW(), blsArchived = '".$blsArchived."', `dDateArchived` = NULL, sArchivedReason = '" . $sArchivedReason . "'";
		return $this->doSQL($sql);
	}

	function deleteGenre($pkGenreUID){
		$sql = "DELETE FROM `tgenre` WHERE pkGenreUID = '" . $pkGenreUID . "'";
		return $this->doSQL($sql);		
	}

	function getAllUsers(){
		$sql = "SELECT u.`pkUserUID` as uid, u.`sUserFirstName`, u.`sUserLastName`, u.`sUserEmail`, u.`sUserPassword`, u.`sUserContactNumber`, u.`UserGroup_fkUserGroupUID`, u.`dDateCreated`, u.`dDateUpdated`, u.`sUserSessionKey`, ug.sUserGroupName
				FROM tusers u
				JOIN tusergroup ug
				ON u.UserGroup_fkUserGroupUID = ug.pkUserGroupUID
				ORDER BY sUserFirstName ASC";
		return $this->doArray($sql);
	}
	
	function addUser($pkUserUID, $sUserFirstName, $sUserLastName, $sUserEmail, $sUserPassword, $sUserContactNumber, $UserGroup_fkUserGroupUID){	
		$sUserContactNumber = $sUserContactNumber != ""? "'" . $sUserContactNumber . "'" : 'NULL'; 
		
		$sql = "INSERT INTO `tusers`
				(`pkUserUID`, `sUserFirstName`, `sUserLastName`, `sUserEmail`, `sUserPassword`, `dDateCreated`, `sUserContactNumber`, `UserGroup_fkUserGroupUID`) 
				VALUES ('" . $pkUserUID . "', '" . $sUserFirstName . "', '" . $sUserLastName . "', '" . $sUserEmail . "', '" . $sUserPassword . "', NOW(), ". $sUserContactNumber . ", '" . $UserGroup_fkUserGroupUID . "') 
				ON DUPLICATE KEY UPDATE  sUserFirstName = '".$sUserFirstName."', sUserLastName = '".$sUserLastName."', sUserEmail = '".$sUserEmail."', sUserPassword = '".$sUserPassword."', `dDateUpdated` = NOW(), sUserContactNumber = ".$sUserContactNumber.", UserGroup_fkUserGroupUID = '" . $UserGroup_fkUserGroupUID . "'";
		return $this->doSQL($sql);
	}
	
	function deleteUser($pkUserUID){
		$sql = "DELETE FROM `tusers` WHERE pkUserUID = '" . $pkUserUID . "'";
		return $this->doSQL($sql);	
	}

	// get total sales for all stores over the past week
	function getStoresChartData(){
		$sql = "SELECT tst.`sStoreName` as name, SUM(ts.`sAmount`) `TotalSales`
				FROM `tsales` ts 
				JOIN `tstores` tst
				ON ts.`Store_fkStoreUID` = tst.`pkStoreUID`
				WHERE ts.`dDateCreated` BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tst.`sStoreName`
				ORDER BY `TotalSales` DESC";

		return $this->doArray($sql);
	}

	// get top 10 sales for media over the past week
	function getMediaChartData(){
		$sql = "SELECT tm.sMediaName as name, SUM(ts.`sAmount`) `CopiesSold`, tg.sGenreName as genreName
				FROM `tsales` ts 
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tgenre tg
				ON tm.Genre_fkGenreUID = tg.pkGenreUID
				WHERE ts.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tm.sMediaName
				ORDER BY `CopiesSold` DESC
				LIMIT 10";

		return $this->doArray($sql);
	}

	// get sales for all categories over the past week
	function getCategoryChartData(){
		$sql = "SELECT tc.sChartCategory as name, SUM(ts.`sAmount`) `TotalSales`
				FROM `tsales` ts 
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tchartcategory tc
				ON tm.Chart_fkChartUID = tc.pkChartCatUID
				WHERE ts.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tc.sChartCategory
				ORDER BY `TotalSales` DESC";

		return $this->doArray($sql);
	}

	// get genres for genres over the past week
	function getGenreChartData(){
		$sql = "SELECT tg.sGenreName as name, SUM(ts.`sAmount`) `TotalSales`
				FROM `tsales` ts 
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tgenre tg
				ON tm.Genre_fkGenreUID = tg.pkGenreUID
				WHERE ts.dDateCreated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tg.sGenreName
				ORDER BY `TotalSales` DESC";

		return $this->doArray($sql);
	}

	// used for drilldown on category pie chart
	function getSalesForStoresByCategory(){
		$sql = "SELECT tst.`sStoreName` as name, SUM(ts.`sAmount`) TotalSales, tc.pkChartCatUID as category
				FROM `tsales` ts 
				JOIN `tstores` tst
				ON ts.`Store_fkStoreUID` = tst.`pkStoreUID`
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tchartcategory tc
				ON tm.Chart_fkChartUID = tc.pkChartCatUID
				WHERE ts.`dDateCreated` BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tst.`sStoreName`, category
				ORDER BY ts.`sAmount` DESC";
		
		return $this->doArray($sql);
	}

	// used for drilldown on genre pie chart
	function getSalesForStoresByGenre(){
		$sql = "SELECT tst.`sStoreName` as name, SUM(ts.`sAmount`) TotalSales, tg.pkGenreUID as genre
				FROM `tsales` ts 
				JOIN `tstores` tst
				ON ts.`Store_fkStoreUID` = tst.`pkStoreUID`
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tgenre tg
				ON tm.Genre_fkGenreUID = tg.pkGenreUID
				WHERE ts.`dDateCreated` BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
				GROUP BY tst.`sStoreName`, genre
				ORDER BY ts.`sAmount` DESC";
		
		return $this->doArray($sql);
	}

	// get all sales for for all stores between a specified start and end date 
	function getSalesForAllStores($pkStoreUID, $startDate, $endDate){
		$sql = "SELECT ts.pkSalesUID as uid, tm.pkMediaUID, tm.sMediaName, tst.pkStoreUID, tst.sStoreName, tc.pkChartCatUID, tc.sChartCategory, tg.pkGenreUID, tg.sGenreName, ts.`sAmount`, ts.sWeekOfSales as date
				FROM `tsales` ts 
				JOIN tmedia tm
				ON ts.Media_fkMediaUID = tm.pkMediaUID
				JOIN tchartcategory tc
				ON tm.Chart_fkChartUID = tc.pkChartCatUID
				JOIN tgenre tg
				ON tm.Genre_fkGenreUID = tg.pkGenreUID
				JOIN tstores tst
				ON ts.Store_fkStoreUID = tst.pkStoreUID
				WHERE ts.sWeekOfSales BETWEEN '" . $startDate . "' AND '" . $endDate . "'";

		if($pkStoreUID != null){
			$sql = $sql. " AND ts.Store_fkStoreUID = '" . $pkStoreUID . "'";
		}

		$sql = $sql. " GROUP BY uid ORDER by date DESC";

		return $this->doArray($sql);
	}
}
?>