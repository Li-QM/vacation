<?php

namespace App\Http\Controllers\BA;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Http\Helper\BookingHelper;
use App\Models\Front\Rooms;
use App\Models\Front\RoomsPrice;
use App\Models\Front\Currency;
use App\Models\Front\Calendar;
use App\Models\Front\Reservation;
use App\Models\Front\SeasonalPrice;
use DB;
use Auth;

class BookingAutomationController extends Controller {
  /*
  * prop_id : 77044
  * ota_password : 123456
  * api_key : S1RJCA5214KB8355
  * prop_key : DEJQ6XIT5IIAPXTB
  */
  public function createAccount(Request $request) {
		$currentUser = User::find(Auth::id());
		$currentUser->prop_id = $request->prop_id;
		$currentUser->ota_password = $request->ota_password;
		$currentUser->api_key = $request->api_key;
		$currentUser->prop_key = $request->prop_key;
		$currentUser->is_bin_enable = $request->is_bin_enable;
		$currentUser->save();
		return ['success' => true];
	}

	public function getPropId() {
		$user = User::find(Auth::id());
		echo $user->prop_id;
	}
 
	public function getCredential() {
		$user = User::find(Auth::id());

		if(!isset($user->prop_id) || $user->prop_id == '') {
			echo "Booking Acccount Credential not registered";
		}
		else
		{
			echo "prop_id: [".$user->prop_id."] ota_password: [".$user->ota_password."] api_key: [".$user->api_key."] prop_key : [".$user->prop_key."]";
		}
	}
 
  public function getBaCredential() {
    $user = User::find(Auth::id());

    if(!isset($user->prop_id) || $user->prop_id == ''){
        return json_encode(['success' => false]);
    }
    else
    {
			$data = [
			'prop_id' => $user->prop_id,
			'ota_password' => $user->ota_password,
			'api_key' => $user->api_key,
			'prop_key' => $user->prop_key,
			'is_bin_enable' => $user->is_bin_enable,
			];

			return json_encode(['success' => true, 'data' => $data]);
    }
  }

  public function getPricing(Request $request, $roomid) {
		$response = BookingHelper::getProperty();
		$decode_res = json_decode($response, true);
		$props = [];
		$props[0] = $decode_res['getProperty'][0];
		$rooms = $props[0]['roomTypes'];
		$room_for_id = null;
		foreach ($rooms as $key => $room) {
			# code...
			if($room['roomId'] == $roomid)
			{
				$room_for_id = $room;
			}
		}

		$resData = null;
		$resData['default_currency'] = $props[0]['currency'];
		$resData['charge_per_night'] = $room_for_id['minPrice'] * 1;
		$resData['weekly_price'] = $room_for_id['minPrice'] * 7;
		$resData['monthly_price'] = $room_for_id['minPrice'] * 30;
		$resData['monthly_price'] = $room_for_id['minPrice'] * 2;
		$resData['cleaning_fee'] = $room_for_id['cleaningFee'];
		$resData['tax_rate'] = $room_for_id['taxPercent'];
		$resData['max_occupants'] = $room_for_id['maxPeople'];
		$resData['base_occupants'] = 2;

		$data = [
			'default_currency' => '',
			'charge_per_night' => '',
			'weekly_price' => '',
			'monthly_price' => '',
			'weekend_price' => '',
			'weekend_days' => '',
			'minimum_nights' => '',
			'cleaning_fee' => '',
			'cleaning_fee_calc' => '',
			'tax_rate' => '',
			'refund_damage_fee' => '',
			'max_occupants' => 15,
			'base_occupants' => 5,
			'charges_per_guest' => 10,
			'charges_per_guest' => 5,
		];

		dd($resData);
		return $resData;
	}

/*
*
* Get property data of the current user
*/
	public function getProperty() {
		$response = BookingHelper::getProperty();
		$decode_res = json_decode($response, true);
		$props = [];
		$props[0] = $decode_res['getProperty'][0];
		$rooms = $props[0]['roomTypes'];
		$room_for_id = $rooms[0];
		foreach ($rooms as $key => $room) {
			# code...
			if($room['roomId'] == "176579")
			{
			$room_for_id = $room;
			}
		}

		dd($props[0]);
	}

/*
*
* Get room data for roomid
*
*/
	public function getRoom($room_id) {

		// $room_id = "176579";
		$response = BookingHelper::getProperty();

		$decode_res = json_decode($response, true);
		
		$props = [];
		$props[0] = $decode_res['getProperty'][0];

		$rooms = $props[0]['roomTypes'];

		$room_for_id = null;
		foreach ($rooms as $key => $room) {
			# code...
			if($room['roomId'] == $room_id)
			{
				$room_for_id = $room;
			}
		}
		
		// $room_for_id['charge_per_night'] = $props[0]['currency'];
		dd($room_for_id);
		return $room_for_id;
	}

  /*
  *
  * Get availability
  *
  */
	public function getAvailability($roomid, $start, $end) {
		$response = BookingHelper::getAvailability($start, $end);

		$decode_res = json_decode($response, true);

		$room_data = null;
		foreach ($decode_res as $key => $value) {
			# code...
			if($key == $roomid)
			{
			$room_data = $value;
			dd($value);
			}
		}
		
		return $room_data;
  }

  public function getRoomDates($room_id) {
		$response = BookingHelper::getRoomDates($room_id);

		//dd($decode_res);
		return $response;
  }

  public function getRoomStatus(Request $request) {
		// echo "string";
		// $rooms = Rooms::find();
		$curreny = Currency::all();

		$firstroom = Rooms::first();
		$firstroom_price = $firstroom->room_price;
		$room_price = RoomsPrice::where(['room_id' => 10001])->get()->first();

		$room_price->night = 0;
		$room_price->week = 0;
		$room_price->month = 0;
		$room_price->cleaning = 0;
		$room_price->tax = 0;
		$room_price->weekend = 0;
		$room_price->save();

		dd($room_price);
	}

	public function getBookings() {
		$bookings = BookingHelper::getBookings();
		dd($bookings);
  }

	public function update() {
		$error_status = [];
		$response = BookingHelper::getProperty();
		$decode_res = json_decode($response, true);
		$props = [];
		$props[0] = $decode_res['getProperty'][0];
		$rooms_ba = $props[0]['roomTypes'];
		$rooms_vr = Rooms::where(['user_id' => Auth::id()])->get();

		/**
		 * Get basic info for each rooms which user has and save in VR database.
		 */
		for ($id=0; $id < count($rooms_ba); $id++) {
			$rba = $rooms_ba[$id];
			$rvr = Rooms::where(['ba_roomid' => $rba['roomId'], 'user_id' => Auth::id()])->get()->first();
			if($rvr == null) continue;
			$room_price = RoomsPrice::where(['room_id' => $rvr->id])->get()->first();
			$room_price->night = $rba['minPrice'];
			$room_price->week = $rba['minPrice'] * 7;
			$room_price->month = $rba['minPrice'] * 30;
			$room_price->weekend = $rba['minPrice'] * 2;
			$room_price->cleaning = $rba['cleaningFee'];
			$room_price->tax = $rba['taxPercent'];
			$room_price->minimum_stay = $rba['minStay'];
			$room_price->save();
		}

		/**
		 * Delete old calendar and seasonals info for every rooms of an user in VR database.
		 */
		$today = date("Y-m-d");
		$rooms = Rooms::where('user_id', Auth::id())->get();
		try {
			foreach($rooms as $room) {
				Calendar::where('room_id', $room->id)->where('end_date', '>', $today)->delete();
				SeasonalPrice::where('room_id', $room->id)->where('end_date', '>=', $today)->delete();
				Reservation::where('room_id', $room->id)->where('checkout', '>', $today)->delete();
			}
		}
		catch(exception $e) {
			$error_status = $e;
		}

		/* Update rates */
		$rates = BookingHelper::getAllRates();
		foreach($rates as $rate) {
			$room_id = Rooms::where(['ba_roomid' => $rate['roomId'], 'user_id' => Auth::id()])->get()->first()['id'];
			if($room_id == null) continue;
			$week = $rate['roomPrice'] * 7;
			$month = $rate['roomPrice'] * 30;

			$seasonal_price = [
				'room_id' => $room_id,    
				'rateId' => $rate['rateId'],    
				'seasonal_name'  => $rate['name'],
				'start_date' => $rate['firstNight'],
				'end_date' => $rate['lastNight'],
				'price'   => $rate['roomPrice'],
				'week' => $week,
				'month' =>$month,
				'guests' => $rate['extraPersonPriceEnable'],
				'additional_guest' => $rate['extraPersonPriceEnable'],
				'minimum_stay'   => $rate['minNights'],
				'strategy' => $rate['strategy'],
				'status' => 'imported'
			];

			SeasonalPrice::updateOrCreate(['room_id' => $room_id, 'seasonal_name' => $rate['name']], $seasonal_price);
		}

		//Update bookings
		$bookings = BookingHelper::getBookings();
		foreach ($bookings as $key => $booking) {
			// # add booking to database here code...
			$start_time = strtotime($booking['firstNight']);
			$last_time = strtotime($booking['lastNight'].'+ 1 days');

			/**
			 * There is apparent difference between last night and last date.
			 * Delete old calendar info for every rooms of an user in VR database.
			 */
			$start_date = date('Y-m-d',$start_time);
			$last_date = date('Y-m-d',$last_time);

			$begin = new \DateTime( $start_date );
			$end = new \DateTime( $last_date );

			$rvr = Rooms::where(['ba_roomid' => $booking['roomId'], 'user_id' => Auth::id()])->get()->first();

			if($rvr == null) continue;

			$requestid = $rvr['id'];
			$seasonal_name = $booking['guestFirstName'].$booking['guestName'];
			$guests =  $booking['numAdult'] + $booking['numChild'];
			$notes = $booking['notes'];
			$price = $booking['price'];
			$diff = abs($last_time - $start_time);
			$days = floor($diff / (60*60*24));
			$price = (float)$price/$days;

			$status = "Not available";

			if($booking['status'] == 4) {
				$status = "Blocked";
			}
			$reserveid = $booking['bookId'];

			$ba_status = 'Confirmed';
			if($booking['status']==4) {
				$ba_status = 'Black';
				$seasonal_name = $booking['guestTitle'];
			}
	
			if($booking['status']==0) continue;
		
			for($date = $begin; $date < $end; $date->modify('+1 day')) {
				$reservation = [
					'room_id' => $requestid,
					'date'  => $date,
					'seasonal_name' => $seasonal_name,
					'start_date' => $start_date,
					'end_date' => $last_date,
					'notes'   => $notes,
					'guests'   => $guests,
					'source' => 'Import',
					'price' => $price,
					'status' => $status,
					'reserveid' => $reserveid,
				];

				try {
					Calendar::updateOrCreate(['room_id' => $requestid, 'date' => $date], $reservation);
				}
				catch(exception $e) {
					$error_status = collect($error_status, $e);
				}
			}

			$price = (int)$price;

			$reservation = [
				'room_id' => $requestid,
				'reserveid' => $reserveid,
				'checkin' => $start_date,
				'checkout' => $last_date,
				'nights'   => $price,
				'number_of_guests'   => $guests,
				'status' => 'Accepted',
				'ba_status' =>  $ba_status,
				'title' => $seasonal_name,
				'currency_code' => 'USD'
			];

			try {
				DB::statement('SET FOREIGN_KEY_CHECKS=0;');
				Reservation::updateOrCreate(['reserveid' => $reserveid], $reservation);
				DB::statement('SET FOREIGN_KEY_CHECKS=1;');
			}
			catch(exception $e) {
				$error_status = collect($error_status, $e);
			}
		}

		if (empty($error_status)) {
			return array('success' => true);
		} else {
			return array('success' => false, 'error' => $error_status);
		}
  }

  public function setBaRoomId(Request $request) {
		$temp = Rooms::where(['ba_roomid' => $request['ba_roomid']])->get()->first();
		if($temp != null)
			return array('success' => false, 'message' => 'BA id already exists!');
		$roomid = $request['roomid'];
		$room = Rooms::where(['id' => $roomid, 'user_id' => Auth::id()])->get()->first();
		$room->ba_roomid = $request['ba_roomid'];
		$room->save();

		return array('success' => true, 'message' => 'success');
  }

  /*Get the ba_roomid for the selected room*/
  public function getBaRoomId(Request $request) {
		$roomid = $request['roomid'];
		$correspondRoom = Rooms::where(['id' => $roomid, 'user_id' => Auth::id()])->get()->first();
		
		if(!isset($correspondRoom->ba_roomid ) || $correspondRoom->ba_roomid == '')
		{
			return json_encode(['success' => false]);
		} else {
			return ['success' => true, "ba_roomid" => $correspondRoom->ba_roomid];
		}
  }

  /*Get listings that has ba_roomid*/
  public function getListingsHasBa() {
		$data['rooms_list'] = Rooms::user()->get();

		return array(
			'success' => true, 
			'data' => $data['rooms_list']
		);

		$lists = [];
		foreach ($data['rooms_list'] as $key => $room) {
			# code...
			if(isset($room->ba_roomid) && ($room->ba_roomid) != '')
			array_push($lists, $room);
		}

		return array(
			'success' => true, 
			'data' => $lists
		);
  }
}