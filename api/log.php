<?php

require_once("genericFunctions.php");
require_once("db.php");
require_once("config.php");

class Log
{
	const DEBUG = 0;
	const INFO = 1;
	const WARNING = 2;
	const ERROR = 3;
	
	private $conf = null;
	
	public function __construct()
	{
		$this->conf = new Config;
		if (!file_exists(__DIR__.'/../log/')) {
			mkdir(__DIR__.'/../log/', 0777, true);
		}
	}
	
	function l($filename, $line, $function, $message, $type) {
		if ($function == '') {
			$function = "global";
		}
		$message=basename($filename)."(".$line.")::[".$function."] ".$message;
		if ($type >= $this->conf->log_level) {
			switch ($type) {
				case self::DEBUG: /*DEBUG*/
					$message = "DEBUG: ".$message;
					break;
				case self::INFO: /*INFO*/
					$message = "INFO: ".$message;
					break;
				case self::WARNING: /*WARNING*/
					$message = "WARNING: ".$message;
					break;
				case self::ERROR: /*ERROR*/
					$message = "ERROR: ".$message;
					break;
				default:
					$message = "DEBUG: ".$message;
					break;
			}
			$this->write($message);
		}
	}
	
	function write($message) {
		$fp = fopen(__DIR__."/../log/error.log", "a" );
		/*  Lock the file for writing  */
		if ( flock( $fp, LOCK_EX ) ) {
            /* concatenate your error variables for 
                      insertion into text file      */
			$date = date('Y-m-d H:i:s');
            $concat = "[".$date."] ".$message."\n";

            /*  fputs() and fwrite() are the same thing
                 we're writing to the file that we opened
                 with the string above                    */
            fputs( $fp, $concat );
            /* forces write on buffered output */
            fflush( $fp );
            /* Unlock the file to close it */
            flock( $fp, LOCK_UN );
            fclose( $fp );
		}
	}
}
?>