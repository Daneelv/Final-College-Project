<?php

require_once("genericFunctions.php");
require_once("db.php");
require_once("log.php");

class MessageInfo
{
	public $message_type_uuid='f51e2ce2-d8b1-11e2-a581-001cc01b57db';
	public $mobile_type_uuid='c2605bda-cf48-11e2-846b-001cc01b57db';
	public $country_type_uuid='04087326-defb-11e2-b354-001cc01b57db';
	public $system_type_uuid='d26ab7c8-cf48-11e2-a768-001cc01b57db';
	public $lesson_type_uuid='45c3fe14-d8cc-11e2-8ec9-001cc01b57db';
	public $group_type_uuid='395dc456-dd64-11e2-ae77-001cc01b57db';
	public $group_update_type_uuid='0b89e298-dd60-11e2-b511-001cc01b57db';
	public $overlay_type_uuid = '0e598978-098a-11e3-b3d9-3f1ad6655eb7';
	public $login_type_uuid='ba2ea72d-f777-4faa-a4b8-1bf5ec73071t';
	public $logout_type_uuid='ba2ea72d-f777-4faa-a4b8-1bf5ec73072t';
	public $articulate_lesson_type_uuid='ba2ea72d-f777-11e2-a4b8-001cc01b57db';
	
	public $message_info_format_version = 1;
	public $mobile_info_format_version = 1;
	public $country_info_format_version = 1;
	public $system_info_format_version = 1;
	public $lesson_info_format_version = 1;
	public $group_info_format_version = 1;
	public $assessments_format_version = 1;
	public $group_update_format_version = 1;
	public $overlay_format_version = 1;
	public $login_type_format_version = 1;
	public $logout_type_format_version = 1;
	public $articulate_lesson_info_format_version = 1;
	
	public $systems_training = 'Systems Training';
	public $group_training = 'Group Training';
	
	function save($message_uuid, $message, $directory) {
		$GF = new GenericFunctions;
		if (!file_exists('../tmp/outgoing_directory/')) {
			mkdir('../tmp/outgoing_directory/', 0777, true);
		}
		if (!file_exists('../tmp/outgoing_processed/')) {
			mkdir('../tmp/outgoing_processed/', 0777, true);
		}
		if (!file_exists('../tmp/outgoing_error/')) {
			mkdir('../tmp/outgoing_error/', 0777, true);
		}
		if (!file_exists('../library/assessments/')) {
			mkdir('../library/assessments/', 0777, true);
		}
		if (!file_exists('../library/overlays/')) {
			mkdir('../library/overlays/', 0777, true);
		}
		$json = $GF->prettyPrint(json_encode($message));
		$json = preg_replace( "/\"([1-9]\d*(.\d{1,2})?)\"/", '$1', $json );
		$json = preg_replace( "/\"trainer_code([1-9]\d*(.\d{1,2})?)\"/", '"$1"', $json );
		$json = preg_replace( "/\"emp(\d*(.\d{1,2})?)\"/", '"$1"', $json );
		$json = preg_replace( "/\"(true)\"/", '$1', $json );
		$json = preg_replace( "/\"(false)\"/", '$1', $json );
		$saved = file_put_contents($directory.$message_uuid.".json", $json);
		chmod($directory.$message_uuid.".json", 777);
		if ($saved === FALSE) {
			$LOG = new Log;
			$LOG->l(__FILE__, __LINE__,__FUNCTION__, "Could not save  ".$directory.$message_uuid.".json",Log::ERROR);
		} else {
			$LOG = new Log;
			$LOG->l(__FILE__, __LINE__,__FUNCTION__, "Saved  ".$directory.$message_uuid.".json",Log::DEBUG);
		}
	}
	function saveMessage($message_uuid, $message) {
		$this->save($message_uuid, $message, "../tmp/outgoing_directory/");
	}
	function saveAssessment($message_uuid, $message) {
		$this->save($message_uuid, $message, "../library/assessments/");
	}
	function saveOverlay($message_uuid, $message) {
		$this->save($message_uuid, $message, "../library/overlays/");
	}
}
?>