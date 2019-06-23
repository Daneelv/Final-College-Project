<?php 

 require_once("db.php");
 require_once("genericFunctions.php");
 require_once("message.config.php");
 //require_once("exportLessonResults.php");
 
 class API
 {
	
	private $DB = NULL;
	private $genericFunctions = NULL;
	private $_content_type = "application/json";
	private $LOG = NULL;
	//private $generateResults = NULL;
	public function __construct() {
		$this->DB = new DB;
		$this->genericFunctions = new GenericFunctions;
		$this->LOG = new Log;
		//$this->generateResults = new generateResults;
	}
	
	function processApi() {
			$json = @file_get_contents('php://input');
			$array = json_decode($json, true);
			
			$func = $array["func"];
			if((int)method_exists($this,$func) > 0) {
				if ($func=="login") {
					$this->$func();
				} else {
					$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "Function being called ".$func,Log::DEBUG);
					if(isset($array["session_key"])){
						$dbResult = $this->DB->checkSessionKeyDB($array["session_key"]);	
						$size = sizeof($dbResult);			
						if($size > 0)
						{	
							if(!array_key_exists("error", $dbResult))
							{
								$session_key = $dbResult[0]["session_key"];
								$this->$func();
							}							
						}
					}
				}
				$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "this->response('',401);",Log::DEBUG);
				$this->response('',401);
			} else {
				$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "this->response('',404);",Log::DEBUG);
				$this->response('',404);
			}	
	}
	
	function login() {
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$sEmail_Address = $array["email_address"];
		$sPassword = $array["password"]; 
		
		$dbResult = $this->DB->loginDB($sEmail_Address, $sPassword);
		$size = sizeof($dbResult);
		
		$result = array();
		if($size > 0)
		{		
			if(!array_key_exists("error", $dbResult))
			{
				$session_key = md5(microtime().rand());
				$dbResult_s = $this->DB->setSessionKeyDB($session_key, $sEmail_Address);				
				
				$result["details"]["user_name"] = $dbResult[0]["sUserFirstName"];
				$result["details"]["user_lastname"] = $dbResult[0]["sUserLastName"];
				$result["details"]["user_email"] = $dbResult[0]["sUserEmail"];
				
				$result["usergroup"] = Array();
				$result["usergroup"]["usergroup_name"] = $dbResult[0]["sUserGroupName"];
				$result["usergroup"]["usergroup_uid"] = $dbResult[0]["UserGroup_fkUserGroupUID"];
				
				
				$result["session_key"] = $session_key;
				
				$this->response($this->json($result), 200);
			}
			else 
			{
				$this->response($this->json($result), 204);
			}
		}		
	}
	
	function logOut() {
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$sCourse_id = $array["session_key"];
	    $result = array();		
		
		$dbResult = $this->DB->logOutDB($session_key);
		
		$this->response($this->json($result), 200);
	}

	function getAllUserGroups() {
		$dbResult = $this->DB->getAllUserGroups();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result = $dbResult;
			}
			else
			{
				$result = $dbResult;
			}
		}
		return $result;
	}
	
	function getAllGenerics() {
		$dbResult = $this->DB->getAllGenerics();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(array_key_exists("error", $dbResult))
			{
				return $dbResult;
			}
			else
			{
				return $dbResult;
			}

		}	
	}
	
	function getWebsiteDetails() {
		$result = array();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Collecting website details", Log::INFO);
		
		$result["chart_categories"] = $this->getAllChartCategories();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["chart_categories"])." chart categories", Log::INFO);
		
		$result["genres"] = $this->getAllGenres();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["genres"])." genres", Log::INFO);
	
		$result["stores"] = $this->getAllStores();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["stores"])." stores", Log::INFO);
		
		$result["user_groups"] = $this->getAllUserGroups();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["user_groups"])." user groups", Log::INFO);
		
		$result["users"] = $this->getAllUsers();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["users"])." users", Log::INFO);
		
		$result["generics"] = $this->getAllGenerics();
		$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Retrieved ".count($result["generics"])." assessments", Log::INFO);
		
		$this->response($this->json($result), 200);
	}

	function getSalesByFilter(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$stores = $array["stores"];
		$media = $array["media"];
		$chart_categories = $array["chart_categories"];
		$genre = $array["genre"];
		$startDate = $array["startDate"];
		$endDate = $array["endDate"];
			
		$dbResult = $this->DB->getAllSales($stores, $media, $chart_categories, $genre, $startDate, $endDate);
		
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["sales"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 200);
	}

	function getAllSales(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$startDate = $array["startDate"];
		$endDate = $array["endDate"];
		
		$dbResult = $this->DB->getAllSales(null, null, null, null, $startDate, $endDate);
		
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["sales"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($dbResult), 200);
	}

	function getAllStores() {
		$dbResult = $this->DB->getAllStores();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result = $dbResult;
			}
			else
			{
				$result = $dbResult;
			}
		}
		return $result;
	}

	function addStore(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$store = $array["store"];
		
		if ($store["pkStoreUID"] == "") {
			$store["pkStoreUID"] = $this->genericFunctions->gen_uuid();
		}
		
		$dbResult = $this->DB->addStore($store["pkStoreUID"], $store["sStoreName"], $store["sStoreDescription"], $store["sStoreContactNumber"], $store["sStoreEmail"], $store["sAddress1"], $store["sAddress2"], $store["sAddress3"], $store["sAddressCityTown"], $store["sPostalCode"], $store["sAddressType"], $store["blsArchived"], $store["sArchivedReason"]);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->DB->getAllStores();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["stores"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function deleteStore(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();
		
		$pkStoreUID = $array["pkStoreUID"];
		
		$dbResult = $this->DB->deleteStore($pkStoreUID);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}

		$dbResult = $this->DB->getAllStores();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["stores"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}
	
	function getAllMedia(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$dbResult = $this->DB->getAllMedia();
		
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["media"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}
	
	function getMediaByFilter() {
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$genre = $array["genre"];
		$chart = $array["chart"];
		
		if($genre == "" && $chart == ""){
			$dbResult = $this->DB->getAllMedia();
		}else if($genre != "" && $chart == ""){
			$dbResult = $this->DB->getMediaByGenre($genre);
		}else if($genre == "" && $chart != ""){
			$dbResult = $this->DB->getMediaByChart($chart);
		} else {
			$dbResult = $this->DB->getMediaByAllFilters($genre, $chart);
		}
		
		
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["media"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 200);
	}
	
	function addMedia() {
		
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$media = $array["media"];
		
		if ($media["pkMediaUID"] == "") {
			$media["pkMediaUID"] = $this->genericFunctions->gen_uuid();
		}
		
		$dbResult = $this->DB->addMedia($media["pkMediaUID"], $media["sMediaName"], $media["sMediaDescription"], $media["Genre_fkGenreUID"], $media["Chart_fkChartUID"], $media["blsArchived"], $media["sArchivedReason"]);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->DB->getAllMedia();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["media"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}	

	function deleteMedia(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();
		
		$pkMediaUID = $array["pkMediaUID"];
		
		$dbResult = $this->DB->deleteMedia($pkMediaUID);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}

		$dbResult = $this->DB->getAllMedia();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["media"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}	
	
	function getAllChartCategories() {
		$dbResult = $this->DB->getAllChartCategories();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{	
			if(!array_key_exists("error", $dbResult))
			{
				$result = $dbResult;
			}
			else
			{
				$result = $dbResult;
			}
		}	
		return $result;
	}
	
	function addChartCategory(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$chartCategory = $array["chartCategory"];
		
		if ($chartCategory["pkChartCatUID"] == "") {
			$chartCategory["pkChartCatUID"] = $this->genericFunctions->gen_uuid();
		}
		
		$dbResult = $this->DB->addChartCategory($chartCategory["pkChartCatUID"], $chartCategory["sChartCategory"], $chartCategory["blsArchived"], $chartCategory["sArchivedReason"]);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->getAllChartCategories();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["chart_categories"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}
	
	function deleteChartCategory(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();
		
		$pkChartCatUID = $array["pkChartCatUID"];
		
		$dbResult = $this->DB->deleteChartCategory($pkChartCatUID);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->getAllChartCategories();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["chart_categories"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function getAllGenres() {
		$dbResult = $this->DB->getAllGenres();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result = $dbResult;
			}
			else
			{
				$result = $dbResult;
			}
		}		
		return $result;
	}

	function addGenre(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$genre = $array["genre"];
		
		if ($genre["pkGenreUID"] == "") {
			$genre["pkGenreUID"] = $this->genericFunctions->gen_uuid();
		}
		
		$dbResult = $this->DB->addGenre($genre["pkGenreUID"], $genre["sGenreName"], $genre["sGenreDesc"], $genre["blsArchived"], $genre["sArchivedReason"]);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->getAllGenres();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["genres"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function deleteGenre(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();
		
		$pkGenreUID = $array["pkGenreUID"];
		
		$dbResult = $this->DB->deleteGenre($pkGenreUID);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->getAllGenres();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["genres"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}
	
	function getAllUsers() {
		$dbResult = $this->DB->getAllUsers();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result = $dbResult;
			}
			else
			{
				$result = $dbResult;
			}
		}
		return $result;	
	}

	function addUser(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$user = $array["user"];
		
		if ($user["pkUserUID"] == "") {
			$user["pkUserUID"] = $this->genericFunctions->gen_uuid();
		}
		
		$dbResult = $this->DB->addUser($user["pkUserUID"], $user["sUserFirstName"], $user["sUserLastName"], $user["sUserEmail"], $user["sUserPassword"], $user["sUserContactNumber"], $user["UserGroup_fkUserGroupUID"]);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		
		$dbResult = $this->getAllUsers();
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["users"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function deleteUser(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();
		
		$pkUserUID = $array["pkUserUID"];
		
		$dbResult = $this->DB->deleteUser($pkUserUID);
		if(is_array($dbResult) && array_key_exists("error", $dbResult))
		{
			$this->response($this->json($dbResult), 500);
		}
		else
		{
			$dbResult = $this->DB->getAllUsers();
			$size = sizeof($dbResult);
			$result = array();
			
			if($size > 0)
			{
				if(!array_key_exists("error", $dbResult))
				{
					$result["users"] = $dbResult;
					$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
					$this->response($this->json($result), 200);
				}
				else
				{
					$result = $dbResult;
					$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
					$this->response($this->json($result), 500);
				}
			}
			$this->response($this->json($result), 204);
		}
	}	
	
	function updateAllGenerics() {
		$result["generics"] = $this->getAllGenerics();
		$this->response($this->json($result), 200);
	}

	function getPieChartData(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();


		$dbResult = $this->DB->getStoresChartData();
		$size = sizeof($dbResult);
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["stores_chart"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}

		$dbResult = $this->DB->getMediaChartData();
		$size = sizeof($dbResult);
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["media_data"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}

		$dbResult = $this->DB->getCategoryChartData();
		$size = sizeof($dbResult);
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["category_data"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}

		$dbResult = $this->DB->getGenreChartData();
		$size = sizeof($dbResult);
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$result["genre_data"] = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}


		$this->response($this->json($result), 200);
	}

	function getPieChartCategoryDrilldown(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();

		$dbResult_cat = $this->getAllChartCategories();
		$size = sizeof($dbResult_cat);

		for($i=0; $i<$size; $i++){
			$result[$i]["id"] = $dbResult_cat[$i]["name"];
			$result[$i]["name"] = $dbResult_cat[$i]["name"];
			$result[$i]["cat_uid"] = $dbResult_cat[$i]["uid"];
			$result[$i]["data"] = array();
		}

		$dbResult_sales = $this->DB->getSalesForStoresByCategory();
		$sales_size = sizeof($dbResult_sales);
		
		if($sales_size > 0)
		{
			if(!array_key_exists("error", $dbResult_sales))
			{
				for($i=0; $i<$sales_size; $i++){
					$item = $dbResult_sales[$i];
					for($p=0; $p<$size; $p++){
						if($result[$p]["cat_uid"] == $item["category"]){
							array_push($result[$p]["data"], $item);
						}
					}
				}

				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult_sales;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function getPieChartGenreDrilldown(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		$result = array();

		$dbResult_gen = $this->getAllGenres();
		$size = sizeof($dbResult_gen);

		for($i=0; $i<$size; $i++){
			$result[$i]["id"] = $dbResult_gen[$i]["name"];
			$result[$i]["name"] = $dbResult_gen[$i]["name"];
			$result[$i]["gen_uid"] = $dbResult_gen[$i]["uid"];
			$result[$i]["data"] = array();
		}

		$dbResult_sales = $this->DB->getSalesForStoresByGenre();

		$sales_size = sizeof($dbResult_sales);
		
		if($sales_size > 0)
		{
			if(!array_key_exists("error", $dbResult_sales))
			{
				for($i=0; $i<$sales_size; $i++){
					$item = $dbResult_sales[$i];
					for($p=0; $p<$size; $p++){
						if($result[$p]["gen_uid"] == $item["genre"]){
							array_push($result[$p]["data"], $item);
						}
					}
				}
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult_sales;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 204);
	}

	function getSalesForStore(){
		$json = @file_get_contents("php://input");
		$array = json_decode($json, true);
		
		$stores = $array["stores"];
		$startDate = $array["startDate"];
		$endDate = $array["endDate"];
			
		$dbResult = $this->DB->getSalesForAllStores($stores, $startDate, $endDate);
		
		// filter per store
		
		$size = sizeof($dbResult);
		$result = array();
		
		if($size > 0)
		{
			if(!array_key_exists("error", $dbResult))
			{
				$store_index = array();
				$result["store_sales"] = array();
				for($i=0; $i<$size; $i++){
					$item = $dbResult[$i];
					if(!in_array($item["sStoreName"], $store_index)){
						array_push($store_index, $item["sStoreName"]);
					}
					
					if(!array_key_exists(array_search($item["sStoreName"], $store_index), $result["store_sales"])){
						$result["store_sales"][array_search($item["sStoreName"], $store_index)] = array();
						$result["store_sales"][array_search($item["sStoreName"], $store_index)]["store_name"] = $item["sStoreName"];
						$result["store_sales"][array_search($item["sStoreName"], $store_index)]["data"] = array();
						array_push($result["store_sales"][array_search($item["sStoreName"], $store_index)]["data"], $item);
					}else {
						array_push($result["store_sales"][array_search($item["sStoreName"], $store_index)]["data"], $item);
					}
				}
				
				$result["store_index"] = $store_index;
				
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 200", Log::DEBUG);
				$this->response($this->json($result), 200);
			}
			else
			{
				$result = $dbResult;
				$this->LOG->l(__FILE__,__LINE__,__FUNCTION__, "Result 500", Log::DEBUG);
				$this->response($this->json($result), 500);
			}
		}
		$this->response($this->json($result), 200);
	}
	///// GENERIC FUNCTIONS

		function clearQuotation($input){
			return str_replace ("'","\\'", $input);
		}
	
		function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}	
	
		public function get_referer(){
			return $_SERVER['HTTP_REFERER'];
		}
		
		public function response($data,$status){
			$this->LOG->l(__FILE__, __LINE__,__FUNCTION__, "Status ".$status,Log::DEBUG);
			$this->_code = ($status)?$status:200;
			$this->set_headers();
			echo $data;
			exit;
		}
		
		private function get_status_message(){
			$status = array(
						100 => 'Continue',  
						101 => 'Switching Protocols',  
						200 => 'OK',
						201 => 'Created',  
						202 => 'Accepted',  
						203 => 'Non-Authoritative Information',  
						204 => 'No Content',  
						205 => 'Reset Content',  
						206 => 'Partial Content',  
						300 => 'Multiple Choices',  
						301 => 'Moved Permanently',  
						302 => 'Found',  
						303 => 'See Other',  
						304 => 'Not Modified',  
						305 => 'Use Proxy',  
						306 => '(Unused)',  
						307 => 'Temporary Redirect',  
						400 => 'Bad Request',  
						401 => 'Unauthorized',  
						402 => 'Payment Required',  
						403 => 'Forbidden',  
						404 => 'Not Found',  
						405 => 'Method Not Allowed',  
						406 => 'Not Acceptable',  
						407 => 'Proxy Authentication Required',  
						408 => 'Request Timeout',  
						409 => 'Conflict',  
						410 => 'Gone',  
						411 => 'Length Required',  
						412 => 'Precondition Failed',  
						413 => 'Request Entity Too Large',  
						414 => 'Request-URI Too Long',  
						415 => 'Unsupported Media Type',  
						416 => 'Requested Range Not Satisfiable',  
						417 => 'Expectation Failed',  
						500 => 'Internal Server Error',  
						501 => 'Not Implemented',  
						502 => 'Bad Gateway',  
						503 => 'Service Unavailable',  
						504 => 'Gateway Timeout',  
						505 => 'HTTP Version Not Supported');
			return ($status[$this->_code])?$status[$this->_code]:$status[500];
		}
		
		public function get_request_method(){
			return $_SERVER['REQUEST_METHOD'];
		}
		
		private function inputs(){
			switch($this->get_request_method()){
				case "POST":
					$this->_request = $this->cleanInputs($_POST);
					break;
				case "GET":
				case "DELETE":
					$this->_request = $this->cleanInputs($_GET);
					break;
				case "PUT":
					parse_str(file_get_contents("php://input"),$this->_request);
					$this->_request = $this->cleanInputs($this->_request);
					break;
				default:
					$this->response('',406);
					break;
			}
		}		
		
		private function cleanInputs($data){
			$clean_input = array();
			if(is_array($data)){
				foreach($data as $k => $v){
					$clean_input[$k] = $this->cleanInputs($v);
				}
			}else{
				if(get_magic_quotes_gpc()){
					$data = trim(stripslashes($data));
				}
				$data = strip_tags($data);
				$clean_input = trim($data);
			}
			return $clean_input;
		}		
		
		private function set_headers(){
			header("HTTP/1.1 ".$this->_code." ".$this->get_status_message());
			header("Content-Type:".$this->_content_type);
		}
 }

	$api = new API;
	$api->processApi();

?>