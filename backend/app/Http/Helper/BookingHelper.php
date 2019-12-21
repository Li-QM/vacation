<?php

/**
 * Facebook Helper
 *
 * @package     Makent
 * @subpackage  Helper
 * @category    Helper
 * @author      Trioangle Product Team
 * @version     1.5.4
 * @link        http://trioangle.com
 */

namespace App\Http\Helper;


use App\User;
use Auth;
/**
 * Class FacebookHelper
 *
 * @package App\Http\Helper
 */

class BookingHelper
{
	/**
     * Constructor to Set Facebook instance in Global variable
     */
	public function __construct()
	{
		
	}

	public static function isAvailable() 
	{
		$currentUser = User::find(Auth::id());
		if(empty($currentUser->api_key) || 
				empty($currentUser->prop_id) || 
				empty($currentUser->ota_password) || 
				empty($currentUser->prop_key)){
			return false;
		}
		return true;
	}

	/**
	 * function OTA_HotelAvail
	 *
	 * @param roomid : roomid
	 * @param start : start date
	 * @param end : end date
	 */

	public static function shout(){
		echo "shout in a very loud voice";
	}
	public function OTA_HotelAvail($roomid, $start, $end)
	{
		$currentUser = User::find(Auth::id());

		if(!isset($currentUser->prop_id) || !isset($currentUser->ota_password)){
			return ['success' => false];
		}

		$username = $currentUser->prop_id;
		$password = $currentUser->ota_password;

		$url = "https://manage.bookingautomation.com/api/ota/OTA_HotelAvail";
		$echotoken = time();

		$xml = '<OTA_HotelAvailRQ xmlns="http://www.opentravel.org/OTA/2003/05" EchoToken="'.$echotoken.'" Version="1.0">
		  <AvailRequestSegments>
		    <AvailRequestSegment>
		      <StayDateRange Start="'.$start.'" End="'.$end.'" />
		      <RoomStayCandidates>
		        <RoomStayCandidate RoomTypeCode="'.$roomid.'" />
		      </RoomStayCandidates>
		    </AvailRequestSegment>
		  </AvailRequestSegments>
		</OTA_HotelAvailRQ>';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/xml'));
		curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
		$return = curl_exec($ch);
		curl_close($ch);

		header ("Content-Type: text/xml; charset=utf-8");
		return ['success' => true, 'data' => $return];
	}

	//JSON functions

	


	/**
	 * function getAccount
	 *
	 */
	public function getAccount()
	{
		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key)){
			return ['success' => false];
		}

		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;


		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getAccount";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return ['success' => true, 'data' => $result];
	}


	/**
	 * function getAccount
	 *
	 */
	public function getProperties()
	{
		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key)){
			return ['success' => false];
		}

		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;

		$data = array();
		$data['authentication'] = $auth;


		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getProperties";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return ['success' => true, 'data' => $result];
	}

	/**
	 * function getAccount
	 *
	 */
	public function getPropertyContent()
	{
		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key) ){
			return ['success' => false];
		}

		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;


		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getProperties";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return ['success' => true, 'data' => $result];
	}

	public static function getRates($roomid) {

		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key) ){
			return ['success' => false];
		}

		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;
		$data['roomid'] = $roomid;

		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getRates";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return ['success' => true, 'data' => $result];
	}

	public static function getAllRates() {

		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key) ){
			return ['success' => false];
		}

		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;

		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getRates";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		$decode_res = json_decode($result, true);
		return $decode_res;
	}


	/*
	* Get information related to the property
	*/
	public static function getProperty()
	{
		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key)){
			return ['success' => false];
		}
		$authentication = array();
		$authentication['apiKey'] = $currentUser->api_key;
		$authentication['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $authentication;

		$data['roomIds'] = ["176579"];
		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getProperty";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return $result;	
	}

	public static function getAvailability($checkin, $checkout)
	{
		$currentUser = User::find(Auth::id());
		$data = array();
		$data["checkIn"] = $checkin;
		$data["checkOut"] = $checkout;
		$data["propId"] = $currentUser->prop_id;
		$data["numAdult"] = "2";
		$data["numChild"] = "0";
		$data["ignoreAvail"] = true; 
		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getAvailabilities";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		return $result;	
	}

	/*
	*
	*
	*
	*
	*/
	public static function getRoomDates($roomid){
		$auth = array();
		$currentUser = User::find(Auth::id());

		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;

		$data['roomId'] = $roomid;

		$data['from'] = date('Ymd', strtotime('+1 day'));
		$data['to'] = date('Ymd', strtotime('+30 days'));

		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getRoomDates";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);

        $decode_res = json_decode($result, true);
        return $decode_res;
	}

	public static function getBookings(){
		$auth = array();
		$currentUser = User::find(Auth::id());
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data = array();
		$data['authentication'] = $auth;

		/* Restrict the bookings using any combination of the following */

		$data['includeInvoice'] = false;
		$data['includeInfoItems'] = false;

		$json = json_encode($data);

		$url = "https://manage.bookingautomation.com/api/json/getBookings";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		$decode_res = json_decode($result, true);
        return $decode_res;
	}

	public static function setBooking($data) {
		$auth = array();
		$currentUser = User::find(Auth::id());
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;

		$data['authentication'] = $auth;

		/* Restrict the bookings using any combination of the following */

		$data['includeInvoice'] = false;
		$data['includeInfoItems'] = false;

		$json = json_encode($data);
		$url = "https://manage.bookingautomation.com/api/json/setBooking";

		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		$decode_res = json_decode($result, true);
        return $decode_res;
	}

	public static function setRate($data) {

		$currentUser = User::find(Auth::id());
		
		if(!isset($currentUser->api_key) || !isset($currentUser->prop_key) ){
			return ['success' => false];
		}
	
		$auth = array();
		$auth['apiKey'] = $currentUser->api_key;
		$auth['propKey'] = $currentUser->prop_key;
	
		$data['authentication'] = $auth;
	
		$json = json_encode($data);
		$url = "https://manage.bookingautomation.com/api/json/setRate";
	
		$ch=curl_init();
		curl_setopt($ch, CURLOPT_POST, 1) ;
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$result = curl_exec($ch);
		curl_close ($ch);
		$decode_res = json_decode($result, true);
		return $decode_res;
	}
	
}
