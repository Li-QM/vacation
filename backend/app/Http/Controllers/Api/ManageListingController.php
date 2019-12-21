<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Front\PaymentGateway;
use App\Models\Front\SubscribeList;
use App\Http\Requests;
use App\Models\Front\PropertyType;
use App\Models\Front\PropertyTypeLang;
use App\Models\Front\Language;
use App\Models\Front\RoomType;
use App\Models\Front\RoomsBed;
use App\Models\Front\RoomsBath;
use App\Models\Front\Rooms;
use App\Models\Front\RoomsAddress;
use App\Models\Front\BedType;
use App\Models\Front\RoomsStepsStatus;
use App\Models\Front\Country;
use App\Models\Front\Amenities;
use App\Models\Front\AmenitiesType;
use App\Models\Front\RoomsPhotos;
use App\Models\Front\RoomsPrice;
use App\Models\Front\RoomsDescription;
use App\Models\Front\RoomsDescriptionLang;
use App\Models\Front\Calendar;
use App\Models\Front\SeasonalPrice;
use App\Models\Front\Currency;
use App\Models\Front\Reservation;
use App\Models\Front\SavedWishlists;
use App\Models\Front\Messages;
use App\Models\Front\SiteSettings;
use App\Models\Front\RoomsPriceRules;
use App\Models\Front\RoomsAvailabilityRules;
use App\Models\Front\ImportedIcal;
use App\Http\Helper\PaymentHelper;
use App\Http\Start\Helpers;
use App\Models\Front\User;
use App\Models\Front\Subscription;
use App\Models\Front\Subscriptions;
use App\Models\Front\Membershiptype;
use App\Models\Front\RoomsApprovedStatus;
use App\Models\Front\Metas;
use App\Models\Front\UsersPhoneNumbers;
use Illuminate\Routing\Route;
use Illuminate\Validation\Rule;
use App\Events\ProcessPhotos;
use App\Http\Helper\StripeHelper;
use App\Mail\ReservationEmailNotification;
use Event;
use Log;
use Auth;
use DB;
use Mail;
use DateTime;
use Session;
use Image;
use Validator;
use App\Rules\NoneBedSelected;
use Carbon\Carbon;
use App\Traits\MetaHelpers;
use Cloudder;
use Twilio;
/**
 * @group Room Management
 * 
 * APIs for manage listings
 */
class ManageListingController extends Controller
{
    public function __construct(Request $request){
        // return $request->all();
        if($request->secret_api_key){
            $user = User::where('public_api_key', $request->api_key)->first();

            if($user->secret_api_key != $request->secret_api_key){
                return response()->json(array(
                    'status' => 'error',
                    'message' => 'Secret API key does not match.'
                ), 500);
            }
            else{
                $this->user = $user;
            }
        }
        else{
            return response()->json(array(
                'status' => 'error',
                'message' => 'No API secret Key'
            ), 500);
        }
    }
    /**
     * Create a Room
     * 
     * @bodyParam latitude double required The latitute of ther listing. More descriptions.
     * @bodyParam longitude double required The longitude of ther listing. More descriptions.
     * @bodyParam active_accommodates int required The accommodate of ther listing. More descriptions.
     * @bodyParam active_home_type int required The home type of ther listing. More descriptions.
     * 
     * @response 
     * {
     *      "status": "success",
     *      "data": {
     *          "room_id": 11623,
     *          "redirect_url": "https://vacation.rentals/manage-listing/11623/basics"
     *      }
     *  }
     */
    public function createRoom(Request $request){
        $rooms = new Rooms;
		$property_type = PropertyType::find($request->active_home_type)->name;
	 
		$URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$request->latitude,$request->longitude&key=AIzaSyA34nBk3rPJKXaNQaSX4YiLFoabX3DhkXs";
        $data = file_get_contents($URL);
        $geoAry = json_decode($data,true);
        $street = ''; $city_addr = ''; $state_addr = '';$country_addr=''; $route_addr =''; $postal_code =''; $country_code = '';
        foreach($geoAry['results'][0]['address_components'] as $result){
            if(in_array('street_number', $result['types'])){
                $street = $result['long_name'];
            }
            if(in_array('administrative_area_level_2', $result['types'])){
                $city_addr = $result['long_name'];
            }
            if(in_array('administrative_area_level_1', $result['types'])){
                $state_addr = $result['long_name'];
            }
            if(in_array('country', $result['types'])){
                $country_code = $result['short_name'];
                $country_addr = $result['long_name'];
            }
            if(in_array('route', $result['types'])){
                $route_addr = $result['long_name'];
            }
            if(in_array('postal_code', $result['types'])){
                $postal_code = $result['long_name'];
            }
        }
		$rooms->user_id       = $this->user->id;
		$rooms->name          = $property_type .' in '.$city_addr . ' ' . $state_addr; // Assign temporary name
		$rooms->sub_name      = $property_type .' in '.$city_addr;
		$rooms->property_type = $request->active_home_type;
		$rooms->room_type     = 1;//Set default room type to 1
		$rooms->accommodates  = $request->active_accommodates;
		$rooms->calendar_type = 'Always';
		$rooms->plan_type = 5;     // set to "No Subscription" which means that plan is undecided yet.
		$rooms->booking_type = "request_to_book";
		$rooms->save(); // Store data to rooms Table
		$rooms_address = new RoomsAddress;
		$rooms_address->room_id        = $rooms->id;
		$rooms_address->address_line_1 = $street ? $street.', ' : '';
		$rooms_address->address_line_1.= $route_addr;
		$rooms_address->city           = $city_addr;
		$rooms_address->state          = $state_addr;
		$rooms_address->country        = $country_code;
		$rooms_address->postal_code    = $postal_code;
		$rooms_address->latitude       = $request->latitude;
		$rooms_address->longitude      = $request->longitude;

		$rooms_address->save(); // Store data to rooms_address Table

		$this->updateSlug($rooms->id);

		$rooms_price = new RoomsPrice;

		$rooms_price->room_id       = $rooms->id;
		$rooms_price->currency_code = Session::get('currency') ? Session::get('currency') : 'USD';

		$rooms_price->save();   // Store data to rooms_price table

		$rooms_status = new RoomsStepsStatus;
		$rooms_status->calendar = 1;
		$rooms_status->room_id = $rooms->id;
		$rooms_status->save();  // Store data to rooms_steps_status table
		$rooms_approved_status = new RoomsApprovedStatus;
		$rooms_approved_status->room_id = $rooms->id;
		$rooms_approved_status->save();
		$rooms_description = new RoomsDescription;
		$rooms_description->room_id = $rooms->id;
		$rooms_description->save(); // Store data to rooms_description table
		return array(
                'status' => 'success',
                'data' => [
                    'room_id' => $rooms->id,
                    'redirect_url' => url('manage-listing/'.$rooms->id.'/basics')
                ]
			);
    }
    public function updateSlug($room_id, $slug = null) {
		$room = Rooms::find($room_id);
		$room->slug = $slug;
		$room->save();
	}

    /**
     * Create or Update bedroom
     * 
     * @bodyParam room_id int required Room id of listing. More descriptions.
     * @bodyParam babycrib int More descriptions. More descriptions.
     * @bodyParam bedroom_id int if exist bedroomid More descriptions.
     * @bodyParam bedroom_name string required More descriptions.
     * @bodyParam bunkbed int More descriptions.
     * @bodyParam murphy int More descriptions.
     * @bodyParam nochildbed int More descriptions.
     * @bodyParam noof_king int More descriptions.
     * @bodyParam noof_double int More descriptions.
     * @bodyParam nooqueen int More descriptions.
     * @bodyParam nosleepsofa int More descriptions.
     * @bodyParam twinsingle int More descriptions.
     * 
     * @response
     * {
     *      "status": "success",
     *      "message": "Add Successfully.",
     *      "result": {
     *          "room_id": "11623",
     *          "bedroom_name": "child bedroom",
     *          "bedroom_details": "{\"king\":\"4\",\"queen\":\"2\",\"double\":null,\"single\":\"4\",\"bunk\":\"2\",\"child\":\"4\",\"sleepsofa\":\"3\",\"murphy\":\"3\",\"babycrib\":\"1\"}",
     *          "id": 5873
     *      }
     *  }
     */
    public function addupdatebedroom(Request $request){
		$params = ['nooqueen','noofdouble','twinsingle','bunkbed','nochildbed','nosleepsofa','murphy','babycrib'];
		$rules    = [
			'bedroom_name' => 'required',
			'noof_king'    => ['integer', new NoneBedSelected($params)],
			'nooqueen' 		 => 'integer',
			'noofdouble' 	 => 'integer',
			'twinsingle'   => 'integer',
			'bunkbed'    	 => 'integer',
			'nochildbed' 	 => 'integer',
			'nosleepsofa'  => 'integer',
			'murphy'		   => 'integer',
			'babycrib'		 => 'integer',
		];

		$attributes = [
			'bedroom_name'  => 'Bedroom Name',
			'noof_king'     => 'King',
			'nooqueen'      => 'Queen',
			'noofdouble'    => 'Double',
			'twinsingle'    => 'Twin / Single',
			'bunkbed'       => 'Bunk bed',
			'nochildbed'    => 'Clild bed',
			'nosleepsofa'   => 'Sleep sofa / futon',
			'murphy'        => 'Murphy bed',
			'babycrib'      => 'Baby crib'
		];

		$validator = Validator::make($request->all(), $rules, [], $attributes);
		if($validator->fails()) {
			$errors = @$validator->errors()->getMessages();
			return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
		}

		$bed=new RoomsBed;
		if($request->room_id){
			$bed=Roomsbed::find($request->room_id);
		}
		$bed->room_id=$request->room_id;
		$bed->bedroom_name=$request->bedroom_name;
		$bed->bedroom_details=json_encode(array('king'=>$request->noof_king,'queen'=>$request->nooqueen,'double'=>$request->noofdouble,'single'=>$request->twinsingle,'bunk'=>$request->bunkbed,'child'=>$request->nochildbed,'sleepsofa'=>$request->nosleepsofa,'murphy'=>$request->murphy,'babycrib'=>$request->babycrib));
		$res=$bed->saveOrFail();
		$this->update_room_bedrooms($request->room_id);

		$this->update_status($request->room_id); // This function for update steps count in rooms_steps_count table

		if($res){
			if($request->room_id){
				return response()->json(array("status" => 'success', "message"=>"Update Successfully.", 'result' => $bed));
			}
			else{
				return response()->json(array("status" => 'success', "message"=>"Add Successfully.", 'result' => $bed));
			}
			
		}else{
			return response()->json(array("message"=>"Add Faild."));
		}
		return 'success';
    }
    public function update_room_bedrooms($id) {
		$result_rooms = Rooms::whereId($id)->first();

		$bedrooms= RoomsBed::where('room_id', $id)->get()->count();
		$bedrooms ?? 0;

		$result_rooms->bedrooms = $bedrooms;

		$result_rooms->save();
    }
    public function update_status($id)
	{
		// echo $id;exit;
		$result_rooms = Rooms::whereId($id)->first();

		$rooms_status = RoomsStepsStatus::find($id);
	 
		if(!$rooms_status){
			$rooms_status = new RoomsStepsStatus;
			$rooms_status->room_id = $id;
			// 
		}
		$bedrooms= RoomsBed::where('room_id', $id)->get()->count();
		$bathrooms= RoomsBath::where('room_id', $id)->get()->count();
		if(@$result_rooms->name != '' && @$result_rooms->summary != '' )
		{
			// var_dump($rooms_status);exit;
			$rooms_status->description = 1;
		}
		else
		{
			$rooms_status->description = 0;
		}

		if($bedrooms > 0)
		{
			$rooms_status->basics = 1;
		}
		else
		{
			$rooms_status->basics = 0;
		}
		$photos_count = RoomsPhotos::where('room_id', $id)->count();

		if($photos_count > 0)
		{
			$rooms_status->photos = 1;
		}
		else
		{
			$rooms_status->photos = 0;
		}

		$price = RoomsPrice::find($id);

		if($price != NULL)
		{
			if($price->night != 0)
			{
				$rooms_status->pricing = 1;
			}
			else
			{
				$rooms_status->pricing = 0;
			}
		}

		if($result_rooms->calendar_type != NULL)
		{
			$rooms_status->calendar = 1;
		}

		if($result_rooms->cancel_message != NULL)
		{
			$rooms_status->terms = 1;
		}
		else
		{
			$rooms_status->terms = 0;
		}

		if($result_rooms->plan_type == 5)       // check if plan type is "No Subscription"
		{
			$rooms_status->plans = 1;
		}
		else
		{
			$rooms_status->plans = 1;
		}

		$rooms_status->save(); // Update Rooms Steps Count

		return true;
	}
    
    /**
     * Create or Update bathroom
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam bathroom_id int If exist bathroom id More descriptions.
     * @bodyParam bathfeature array ["Toilet", "Tub", "Bidet", "Jetted tub", "Shower", "Outdoor Shower"] More descriptions.
     * @bodyParam bathroom_name string required More descriptions.
     * @bodyParam bathroom_type string required from ['Half', 'Full', 'Shower'] More descriptions.
     * 
     * @response
     * {
     *      "message": "Add Successfully.",
     *      "status": "success",
     *      "result": {
     *          "room_id": "11623",
     *          "bathroom_name": "child bath room",
     *          "bathroom_type": "Half",
     *          "bathfeature": "Toilet, Tub,Bidet,Jetted tub, Shower, Outdoor Shower",
     *          "id": 3450
     *      }
     *  }
     */
    public function addupdatebathroom(Request $request){
		$rules    = [
			'bathroom_name'   => 'required',
			'bathroom_type'   => 'required|in:Full,Half,Shower',
		];
		$attributes = [
			'bathroom_name'   => 'Bathroom Name',
			'bathroom_type'   => 'Bathroom Type',
			'bathfeature'     => 'Bathroom Feature'
		];
		$validator = Validator::make($request->all(), $rules, [], $attributes);
		if($validator->fails()) {
			$errors = @$validator->errors()->getMessages();
			return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
		}
		$bath=new RoomsBath;
		if($request->room_id){
			$bath=RoomsBath::find($request->room_id);
		}
		$bath->room_id=$request->room_id;
		$bath->bathroom_name=$request->bathroom_name;
		$bath->bathroom_type=$request->bathroom_type;
		$bath->bathfeature=$request->bathfeature;
		$res=$bath->saveOrFail();
		$this->update_room_bathrooms($request->room_id);
		if($res){
			return response()->json(array("message"=>"Add Successfully.", 'status' => 'success', 'result' => $bath));
		}else{
			return response()->json(array("message"=>"Add Faild."));
		}
    }
    public function update_room_bathrooms($id) {
		$result_rooms = Rooms::whereId($id)->first();
		$count = 0;
		$bathrooms= RoomsBath::where('room_id', $id)->get();

		if($bathrooms->count() > 0) {
			foreach($bathrooms as $bathroom) {
				if($bathroom->bathroom_type == "Full") {
					$count ++;
				} elseif($bathroom->bathroom_type == "Half" || $bathroom->bathroom_type == "Shower") {
					$count += 0.5;
				}
			}
		}

		$result_rooms->bathrooms = $count;

		$result_rooms->save();
    }
    
    /**
     * Delete bedroom
     * 
     * @bodyParam bedid: 5870 More descriptions.
     * @bodyParam room_id: 11623 More descriptions.
     * 
     * @response successfully
     * {
     *       "message": "Deleted.",
     *       "status": "success",
     *       "bedrooms": [
     *           {
     *               "id": 5872,
     *               "room_id": 11623,
     *               "bedroom_name": "child bedroom",
     *               "bedroom_details": "{\"king\":\"4\",\"queen\":\"2\",\"double\":null,\"single\":\"4\",\"bunk\":\"2\",\"child\":\"4\",\"sleepsofa\":\"3\",\"murphy\":\"3\",\"babycrib\":\"1\"}"
     *           },
     *           {
     *               "id": 5873,
     *               "room_id": 11623,
     *               "bedroom_name": "child bedroom",
     *               "bedroom_details": "{\"king\":\"4\",\"queen\":\"2\",\"double\":null,\"single\":\"4\",\"bunk\":\"2\",\"child\":\"4\",\"sleepsofa\":\"3\",\"murphy\":\"3\",\"babycrib\":\"1\"}"
     *           }
     *       ]
     *   }
     * 
     * @response faild
     * {
     *      "message": "Faild."
     *  } 
     */
    public function deletebedroom(Request $request){
		$res=Roomsbed::where('id', $request->bedid)->delete();
		$this->update_room_bedrooms($request->room_id);
		$bedrooms=RoomsBed::where('room_id',$request->room_id)->get();
		if($res){
			return response()->json(array("message"=>"Deleted.", 'status' => 'success', 'bedrooms' => $bedrooms));
		}
		return response()->json(array("message"=>"Faild."));
    }
    
    /**
     * Delete bathroom
     * 
     * @bodyParam bathid: 3443 More descriptions.
     * @bodyParam room_id: 11623 More descriptions.
     * 
     * @response successfully
     * {  
     *  "message":"Deleted.",
     *  "status":"success",
     *  "bathrooms":[  
     *          {  
     *              "id":3444,
     *              "room_id":11623,
     *              "bathroom_name":"ddd",
     *              "bathroom_type":"Half",
     *              "bathfeature":"Toilet,Tub,Bidet,Jetted tub,Shower,Outdoor Shower"
     *          },
     *          {  
     *              "id":3445,
     *              "room_id":11623,
     *              "bathroom_name":"child bedroom",
     *              "bathroom_type":"Half",
     *              "bathfeature":null
     *          },
     *          {  
     *              "id":3450,
     *              "room_id":11623,
     *              "bathroom_name":"child bedroom",
     *              "bathroom_type":"Half",
     *              "bathfeature":"Toilet, Tub,Bidet,Jetted tub, Shower, Outdoor Shower"
     *          }
     *      ]
     *  }
     * 
     * @response faild
     * {
     *      "message": "Faild."
     *  } 
     */
    public function deletebathroom(Request $request){
	    $res=Roomsbath::where('id', $request->bathid)->delete();
		$this->update_room_bathrooms($request->room_id);
		$bathrooms=RoomsBath::where('room_id',$request->room_id)->get();
		if($res){
			return response()->json(array("message"=>"Deleted.",'status' => 'success', 'bathrooms' => $bathrooms));
		}
		return response()->json(array("message"=>"Faild."));
    }
    
    /**
     * Update listing
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam name string  More descriptions.
     * @bodyParam summary string  More descriptions.
     * @bodyParam video string  Youtube video url. More descriptions.
     * @bodyParam booking_type string  More descriptions.
     * @bodyParam room_type string  More descriptions.
     * 
     * @response
     * {
     *      address_url: "https://vacation.rentals/shanghai-shi-1-bedroom-1-bathroom-apartment/11623"
     *      room_id: "11623"
     *      steps_count: 4
     *      success: "true"
     *      video: ""
     * }
     */
    public function update_rooms(Request $request )
	{

		$data  = $request->exept('room_id');
		$data  = json_decode($data);


		if($request->current_tab)
		{

			if($request->current_tab == 'en')
			{
				$rooms = Rooms::find($request->room_id); // Where condition for Update
			}
			else
			{

				$des_id = RoomsDescriptionLang::where('room_id', $request->room_id)->where('lang_code', $request->current_tab)->first()->id;

				$rooms = RoomsDescriptionLang::find($des_id);

			}

		}
		else
		{
			$rooms = Rooms::find($request->room_id);
		}

		$email = '';
		
		foreach($data as $key=>$value)
		{
            if($key != 'room_id'){
                if($key != 'video')
				$rooms->$key =$this->helper->url_remove($value);     // Dynamic Update
                else {
                    $search     = '#(.*?)(?:href="https?://)?(?:www\.)?(?:youtu\.be/|youtube\.com(?:/embed/|/v/|/watch?.*?v=))([\w\-]{10,12}).*#x';
                    $count      = preg_match($search, $value);
                    $rooms      = Rooms::find($request->room_id);
                    if($count == 1) {
                        $replace    = 'https://www.youtube.com/embed/$2';
                        $video      = preg_replace($search,$replace,$value);
                        $rooms->$key = $video;
                    }
                    else {
                        return json_encode(['success'=>'false', 'steps_count' => $rooms->steps_count]);
                    }
                }

                if($key == 'booking_type')
                    $rooms->$key = (!empty($value)) ? $value : NULL;

                if($key == 'room_type')
                    $rooms->sub_name = RoomType::single_field($value, 'name').' in '.RoomsAddress::single_field($request->room_id, 'city');

                if($key == 'status' && $value == 'Listed'){
                    $email = 'Listed';

                }

                if($key == 'status' && $value == 'Unlisted'){
                    $email = 'Unlisted';
                    $rooms->recommended='No';
                }
            }
		}

		$rooms->save(); // Save rooms data to rooms table
		if($email == 'Listed' && $rooms->approved_status != "1") {
		}
		if(($email =='Unlisted') && $rooms->approved_status != "1") {
		} else{
			$this->update_status($request->room_id); // This function for update steps count in rooms_steps_count table
		}
		$address_url = url($rooms->address_url.'/'.$rooms->id);
		return json_encode(['success'=>'true', 'steps_count' => $rooms->steps_count, 'video' => $rooms->video, 'address_url' => $address_url, 'room_id' => $request->room_id]);
    }
    


    /**
     * Update listing Description
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam current_tab string More descriptions.
     * @bodyParam space string More descriptions.
     * @bodyParam access string More descriptions.
     * @bodyParam interaction string More descriptions.
     * @bodyParam notes string More descriptions.
     * @bodyParam house_rules string More descriptions.
     * @bodyParam neighborhood_overview string More descriptions.
     * @bodyParam transit string More descriptions.
     * 
     * 
     * @response
     * {
     *      success : true
     * }
     */
    public function update_description(Request $request)
	{
		$data           = @$request->except('room_id');
		$data           = json_decode($data);
		$request->current_tab = @$request->current_tab  ?: 'en';
		if(@$request->current_tab != 'en')
		{
			$roomlang          = RoomsDescriptionLang::where('room_id',@$request->room_id)->where('lang_code',@$request->current_tab)->first();
			if($roomlang !='')
			{
				$roomlang->room_id = @$request->room_id;
				$roomlang->lang_code = @$request->current_tab;
				foreach ($data as $key => $value)
				{
					$roomlang->$key =  $value;
				}
				$roomlang->save();
			}else
			{  $roomlang = new RoomsDescriptionLang;
				$roomlang->room_id = @$request->room_id;
				$roomlang->lang_code = @$request->current_tab;
				foreach ($data as $key => $value)
				{
					$roomlang->$key =  $value;
				}
				$roomlang->save();
			}
		}else{
			$price          = @RoomsDescription::find(@$request->room_id);
			if($price != '')
			{
				$price->room_id = @$request->room_id;

				foreach ($data as $key => $value)
				{
					$price->$key =  $value;
				}
				$price->save();
			}else
			{   $price          = new RoomsDescription;
				$price->room_id = @$request->room_id;
				foreach ($data as $key => $value)
				{
					$price->$key =  $value;
				}

				$price->save();
			}
		}
		foreach ($data as $key => $value)
		{
			if($key == 'space'){
				$field = 'The Space';
			}elseif ($key == 'access') {
				$field = 'Guest Access';
			}elseif ($key == 'interaction') {
				$field = 'Interaction with Guests';
			}elseif ($key == 'notes') {
				$field = 'Other Things to Note';
			}elseif ($key == 'house_rules') {
				$field = 'House Rules';
			}elseif ($key == 'neighborhood_overview') {
				$field = 'Overview';
			}elseif ($key == 'transit') {
				$field = 'Getting Around';
			}else{
				$field = '';
			}
			if($field != ''){
			}
		}

		return json_encode(['success'=>'true']);
    }
    
    /**
     * Location verify
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam country string required More descriptions.
     * @bodyParam address_line_1 string required More descriptions.
     * @bodyParam address_line_2 string required More descriptions.
     * @bodyParam city string required More descriptions.
     * @bodyParam state string required More descriptions.
     * @bodyParam postal_code string required More descriptions.
     * @bodyParam latitude double required More descriptions.
     * @bodyParam longitude double required More descriptions.
     * 
     * @response
     * {
     *      address_line_1: "Ye Qian Lu"
     *      address_line_2: ""
     *      address_url: "https://vacation.rentals/shanghai-shi-1-bedroom-1-bathroom-apartment/11623"
     *      city: ""
     *      country: "CN"
     *      country_name: "China"
     *      latitude: 31.1456616
     *      longitude: 121.2263254
     *      postal_code: "201601"
     *      room_id: 11623
     *      state: "Shanghai Shi"
     *      steps_count: 3
     * }
     */
    public function finish_address(Request $request )
	{
		$data  = $request->except('room_id');

		$data  = json_decode($data); // AngularJS data decoding

		$rooms = RoomsAddress::find($request->room_id); // Where condition for Update

		foreach($data as $key=>$value)
		{
			$rooms->$key = $value;          // Dynamic Update
		}

		$rooms->save();

		$rooms_status = RoomsStepsStatus::find($request->room_id);

		$rooms_status->location = 1;

		$rooms_status->save();

		$data_result = RoomsAddress::find($request->room_id);
		$room = Rooms::find($request->room_id);
		$address_url = url($room->address_url.'/'.$room->id);
		$data_result['address_url'] = $address_url;

		return json_encode($data_result);
    }
    
    /**
     * Update Amenities
     * 
     * @bodyParam room_id More descriptions.
     * @bodyParam amenities string ids combined by comma More descriptions.
     * 
     * @response
     * {
     *      "success":"true"
     * }
     */
    public function update_amenities(Request $request )
	{
		$rooms = Rooms::find($request->room_id);

		$rooms->amenities = $request->amenities;

		$rooms->save();

		return json_encode(['success'=>'true']);
    }

    /**
     * Upload Photos
     * @bodyParam room_id int required More descriptions.
     * @bodyParam photos[] binary array required More descriptions.
     * @response
     * 
     */
    public function add_photos(Request $request )
	{
		$room = Rooms::find($request->room_id);
		$uploaded = RoomsPhotos::where('room_id',$request->room_id)->first();
		if($uploaded)
			$photos_count = $uploaded->photos_count;
		else
			$photos_count = 0;
		if(isset($_FILES["photos"]["name"]))
		{

			$rows = array();
			$err = array();
           
			$total_cnt_to_upload = count($_FILES["photos"]["error"]);
			$processes_per_img = 5;
			$progress_step = 1 / ($total_cnt_to_upload * $processes_per_img);
			session()->put('upload_progress_step', $progress_step);
			$progress = 0;
			session()->put('upload_progress', $progress);

			$file_names = array();

			foreach($_FILES["photos"]["error"] as $key=>$error)
			{
				$room = Rooms::find($request->room_id);
				$uploaded = RoomsPhotos::where('room_id',$request->room_id)->first();
				if($uploaded)
					$photos_count = $uploaded->photos_count;
				else
					$photos_count = 0;

				$tmp_name = $_FILES["photos"]["tmp_name"][$key];

				$name = str_replace(' ', '_', $_FILES["photos"]["name"][$key]);

				$size = $_FILES["photos"]["size"][$key];


				$ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));

				$name = time() . '_' . random_int( 100, 999) . $key;// . '_.' . $ext;

				$filename = dirname($_SERVER['SCRIPT_FILENAME']).'/images/rooms/'.$request->room_id;

				if(!file_exists($filename))
				{
					if ( ! mkdir( dirname( $_SERVER['SCRIPT_FILENAME'] ) . '/images/rooms/' . $request->room_id, 0777, true ) && ! is_dir( dirname( $_SERVER['SCRIPT_FILENAME'] ) . '/images/rooms/' . $request->room_id ) ) {
						throw new \RuntimeException( sprintf( 'Directory "%s" was not created', dirname( $_SERVER['SCRIPT_FILENAME'] ) . '/images/rooms/' . $request->room_id ) );
					}
				}
				$max_limit_of_img_size = 10;     // 7 Mbyte
				if($size > $max_limit_of_img_size * 1024 * 1024) {       // restrict file size to 7 Mb
					$rows['error'] = array('error_title' => ' Photo Error', 'error_description' => trans('messages.lys.filesize_exceed_error', ['max_limit' => $max_limit_of_img_size]));
					$result = RoomsPhotos::where('room_id',$request->room_id)->orderBy('order','desc')->get();
					$rows['succresult'] = $result;
					return json_encode($rows);
				}if($ext == 'png' || $ext == 'jpg' || $ext == 'jpeg' || $ext == 'gif')
				{
					$image_name =$tmp_name;;
					$option1 = array(
						"folder" => "/images/rooms/$request->room_id",
						"public_id" => $name,
						"quality"=>"auto:low",
						"flags"=>"lossy",
						"resource_type"=>"image"
					);
					Cloudder::upload($tmp_name, null, $option1);
					if(Cloudder::getResult()){
						array_push($file_names, $name);
						$photos          = new RoomsPhotos;
						$photos->room_id = $request->room_id;
						$photos->name    = $name;
						$photos->storage = 'cloud';

						$photos->save();
					}
					$this->update_status($request->room_id);
				}
				else
				{
					$err = array('error_title' => ' Photo Error', 'error_description' => 'This is not an image file');

				}
			}
			$result = RoomsPhotos::where('room_id',$request->room_id)->orderBy('order','desc')->get();
			$rows['succresult'] = $result;
			$rows['error'] = $err;
			return json_encode($rows);
		}

    }
    

    /**
     * Update price listing
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam currency_code string required More descriptions.
     * @bodyParam weekenddays int optional More descriptions.
     * @bodyParam tax double optional More descriptions.
     * @bodyParam night double optional More descriptions.
     * @bodyParam week double optional More descriptions.
     * @bodyParam month double optional More descriptions.
     * @bodyParam weekend double optional More descriptions.
     * @bodyParam minimum_stay int optional More descriptions.
     * @bodyParam cleaning double optional More descriptions.
     * @bodyParam cleaning_fee_type int optional More descriptions.
     * @bodyParam security double optional More descriptions.
     * @bodyParam guests double optional More descriptions.
     * @bodyParam additional_guest double optional More descriptions.
     * 
     * 
     * @response false
     * {
     * attribute: "night"
     *  currency_symbol: "&#36;"
     *  min_amt: 10
     *  msg: "The Price must be at least &#36;10."
     *  success: "false"
     *  }
     * 
     * @response success
     * {
     *  currency_symbol: "&#36;"
     *  night_price: ""
     *  steps_count: 2
     *  success: "true"
     * }
     */
    public function update_price(Request $request)
	{
		$data           = $request->except('room_id');
		$data           = json_decode($data); // AngularJS data decoding
		foreach ($data as $key => $value)
		{
			if($key == 'currency_code') {
				if(Currency::where('code', $value)->count() == 0) {
					return json_encode(['success'=>'false','msg' => 'This is invalid currency type.', 'attribute' => $key]);
				}
			} else if($key == 'weekenddays') {
				if(!in_array($value, [1 ,2, 3])) {
					return json_encode(['success'=>'false','msg' => 'This is invalid type.', 'attribute' => $key]);
				}
			} else if($key == 'cleaning_fee_type') {
				if(!in_array($value, [0, 1, 2, 3])) {
					return json_encode(['success'=>'false','msg' => 'This is invalid type.', 'attribute' => $key]);
                }
            } else if($key == 'cleaning_taxable') {
                if(!in_array($value, ['Yes', 'No'])) {
					return json_encode(['success'=>'false','msg' => 'This is invalid type.', 'attribute' => $key]);
                }
			} else if($key == 'tax') {
				if(!is_numeric($value) || ($value < 0)) {
					return json_encode(['success'=>'false','msg' => 'This field must be integer/float.', 'attribute' => $key]);
				}
			} else {
				if(!is_numeric($value)) {
					return json_encode(['success'=>'false','msg' => 'This field must be integer.', 'attribute' => $key]);
				} else if( !is_int( $value * 1) || $value < 0) {
					return json_encode(['success'=>'false','msg' => 'This field must be integer.', 'attribute' => $key]);
				}
			}
		}

		$minimum_amount = $this->payment_helper->currency_convert('USD', isset($data->currency_code) ? $data->currency_code : 'USD', 10);
		$currency_symbol = Currency::whereCode(isset($data->currency_code) ? $data->currency_code : 'USD')->first()->original_symbol;

		if(isset($data->night))
		{
			$old_currency_format = RoomsPrice::find($request->room_id);
			$night_price = $data->night;
			if(is_numeric($night_price) && $night_price < $minimum_amount)
			{
				return json_encode(['success'=>'false','msg' => trans('validation.min.numeric', ['attribute' => trans('messages.inbox.price'), 'min' => $currency_symbol.$minimum_amount]), 'attribute' => 'night', 'currency_symbol' => $currency_symbol,'min_amt' => $minimum_amount]);
			}
			$data->night=$night_price;
		} else {
			$night_price = '';
		}

		if(isset($data->week) && @$data->week !='0' && @$data->week !=''){
			$week_price = $data->week;
			if($week_price < $minimum_amount){
				return json_encode(['success'=>'false','msg' => trans('validation.min.numeric', ['attribute' => 'price', 'min' => $currency_symbol.$minimum_amount]), 'attribute' => 'week', 'currency_symbol' => $currency_symbol]);
			}
		}

		if(isset($data->month) && @$data->month !='0' && @$data->month !=''){
			$month_price = $data->month;
			if($month_price < $minimum_amount){
				return json_encode(['success'=>'false','msg' => trans('validation.min.numeric', ['attribute' => 'price', 'min' => $currency_symbol.$minimum_amount]), 'attribute' => 'month', 'currency_symbol' => $currency_symbol]);
			}
		}

		if(isset($data->additional_charge) && @$data->additional_charge !='0' && @$data->additional_charge !=''){
			$additional_charge = $data->additional_charge;
		}

		$price          = RoomsPrice::find($request->room_id);
		if(!$price){
			$price = new RoomsPrice;
			
			$price->currency_code = isset($data->currency_code) ? $data->currency_code : 'USD';
			// $price->save();
		}
		$price->room_id = $request->room_id;
		foreach ($data as $key => $value)
		{
			$price->$key = $value;
		}

		$price->save();

        $this->update_status($request->room_id);
    
        return ['status' => 'Heelo'];

		return json_encode(['success'=>'true', 'currency_symbol' => $price->currency->original_symbol, 'steps_count' => $price->steps_count,'night_price'=>$night_price]);
    }
    
    /**
     * Update additional charges
     * @bodyParam room_id int required More descriptions.
     * @bodyParam additional_charges array More descriptions.
     * [
     *      {
     *          calc_type: "1"
     *          guest_opt: "1"
     *          label: "fee name 1"
     *          price: "5"
     *          price_type: "0"
     *      },
     *      {
     *          calc_type: "1"
     *          guest_opt: "1"
     *          label: "fee name 2"
     *          price: "5"
     *          price_type: "0"
     *      }
     * ]
     * 
     * @response 
     * {
     *      success: "true"
     * }
     */
    public function update_additional_price(Request $request){
		$label = array();
		foreach ($request->additional_charges as $key => $charge) {
			$label[] = $charge['label'];
			if($charge['label'] == '' || $charge['price'] == '') {
				return json_encode(['success'=>'false','msg' => 'There is a empty charge name or charge fee.', 'attribute' => 'additional_charge']);
			}

			if($charge['price_type'] == '' || $charge['calc_type'] == '' || $charge['guest_opt'] == '') {
				return json_encode(['success'=>'false','msg' => 'There is a unselected calculation type, price type or guest option.', 'attribute' => 'additional_charge']);
			}

			if(!in_array($charge['price_type'], [0, 1])) {
				return json_encode(['success'=>'false','msg' => 'Price type is invalid.', 'attribute' => 'additional_charge']);
			}

			if(!in_array($charge['calc_type'], [0, 1, 2])) {
				return json_encode(['success'=>'false','msg' => 'calc type is invalid.', 'attribute' => 'additional_charge']);
			}

			if(!in_array($charge['guest_opt'], [0, 1])) {
				return json_encode(['success'=>'false','msg' => 'guest opt is invalid.', 'attribute' => 'additional_charge']);
			}

            if(!in_array($charge['taxable'], ['Yes', 'No'])) {
				return json_encode(['success'=>'false','msg' => 'taxable is invalid.', 'attribute' => 'additional_charge']);
			}
		}

		foreach ($label as $key => $value) {
			if($value != '') {
				$temp = $label;
				unset($temp[$key]);
				if(in_array($value, $temp)) {
					return json_encode(['success'=>'false','msg' => 'There is a duplication of charge name.', 'attribute' => 'additional_charge']);
				}
			}
		}

		$price = RoomsPrice::find($request->room_id);
		$price->additional_charge=json_encode($request->additional_charges);
		$price->save();
		return json_encode(['success'=>'true']);
	}

    /**
	 * @bodyParam room_id int required More descriptions.
     * @bodyParam edit_seasonal_name: "" More descriptions.
     * @bodyParam end_date string "2019-05-22" More descriptions.
     * @bodyParam guests string 1 More descriptions.
     * @bodyParam notes string "444444" More descriptions.
     * @bodyParam price string "433" More descriptions.
     * @bodyParam reservation_source string "Calendar" More descriptions.
     * @bodyParam seasonal_name string "22333333" More descriptions.
     * @bodyParam start_date string "2019-05-05" More descriptions.
	 *
     * @response
     * {
     *      success: "true"
     * }
	 */
	public function save_reservation(Request $request) {
      
        // validation part
        $rules    = [
            'start_date'   => 'required|date',
            'end_date'   => 'required|date',            
            'seasonal_name'     => 'required',
            'price'     => 'required|numeric',
            'guests'     => 'required|numeric|min:1'
        ];

        


        $attributes = [
            'start_date'   => 'Check in',
            'end_date'   => 'Check out',
            'seasonal_name'     => 'Name',
            'price'     => 'Price',
            'guests'     => 'Number of Guests'
        ];
        
        $validator = Validator::make($request->all(), $rules, [], $attributes);
        
        if($validator->fails()) {
            $errors = @$validator->errors()->getMessages();            
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }   
        // dd($request->end_date);
        // $start_date = date("Y-m-d", strtotime($request->start_date));
      
        $checkin =  date('Y-m-d',$this->helper->custom_strtotime($request->start_date));
     
        $checkout =  date('Y-m-d',$this->helper->custom_strtotime($request->end_date));
        // dd($request->id,$request->edit_seasonal_name, $checkin, $checkout);
      
         //dd($this->check_reservation_conflict($request->id, $checkin, $checkout, $request->edit_seasonal_name));
        if($this->check_reservation_conflict($request->id, $checkin, $checkout, $request->edit_seasonal_name) != true) {            
            $errors = ['start_date' => [ 0 => 'Sorry,there is a conflict'], 'end_date' => [ 0 => 'Sorry,there is a conflict']];  
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }
     
        // end validation
        
        $source = $request->reservation_source;        
       
        if(($source == "Calendar") || ($source == "Reservation")) {             
            $status = "Reserved";    

        } else if($source == "Import") {            
            $status = "Not available";    

        }

        $days = $this->get_days(strtotime($checkin),strtotime($checkout));        
        if($request->edit_seasonal_name !== ""){          // in case of edit             
            // recovery relevant season            
            $original_reservation = Calendar::where('room_id', $request->id)->where('seasonal_name',$request->edit_seasonal_name)->where('status', $status)->where('source', $source)->first();
            
            // delete all records of the unavailable date range which is to be updated
            $calendar = Calendar::where('room_id',$request->id)->where('seasonal_name',$request->edit_seasonal_name)->where('status', $status)->where('source', $source)->delete();
            // must recover season only after delete all records of the unavailable date range (because recovery function use updateOrCreate function)
            
            if($original_reservation)
            {
                $fromDate = $original_reservation->start_date;
                $toDate = $original_reservation->end_date;
                $room_id = $request->id;
                $this->recoverSeasonalPrices($room_id, $fromDate, $toDate);    
            }
        }

        if($request->edit_seasonal_name !== ""){          // when update reservation, delete original reservation
            $calendar = Calendar::where('room_id',$request->id)->where('seasonal_name',$request->edit_seasonal_name)->where('status', $status)->where('source', $source)->delete();            
        }

        for($i=0; $i < count($days) - 1; $i++) {    //eliminate check out date

            $reservation = [
                            'room_id' => $request->id,
                            'date'    => $days[$i],
                            'seasonal_name'    => $request->seasonal_name,
                            'start_date' => $checkin,
                            'end_date' => $checkout,
                            'notes'   => $request->notes,
                            'price'   => $request->price,
                            'guests'   => $request->guests,
                            'source' => $source,
                            'status'  => $status
                            ];
             Calendar::updateOrCreate(['room_id' => $request->id, 'date' => $days[$i]], $reservation);
            
        }

        if($source == "Reservation") {
            $reservation_id = $original_reservation->reservation_id();

            if($reservation_id) {
                $reservation = [                                                        
                            'checkin' => $checkin,
                            'checkout' => $checkout,
                            'nights'   => $request->price,
                            'number_of_guests'   => $request->guests,                                                     
                        ];
                Reservation::updateOrCreate(['id' => $reservation_id], $reservation);    
            }
        }

        return json_encode(['success' =>'true']);
    }


    /**
     * Update Seasonal Price of Listing
     * 
     * @bodyParam room_id int required More descriptions.
     * @bodyParam additional_guest int required More descriptions.
     * @bodyParam edit_seasonal_name int required More descriptions.
     * @bodyParam end_date int required More descriptions.
     * @bodyParam minimum_stay int required More descriptions.
     * @bodyParam month int required More descriptions.
     * @bodyParam price int required More descriptions.
     * @bodyParam seasonal_name int required More descriptions.
     * @bodyParam start_date int required More descriptions.
     * @bodyParam week int required More descriptions.
     * @bodyParam weekend int required More descriptions.
     * 
     * @response
     * {
     *      success: "true"
     * }
     */
    public function save_seasonal_price(Request $request) {
        $data = $request->all();

        // validation part
        $rules    = [
            'start_date'   => 'required|date',
            'end_date'   => 'required|date',            
            'seasonal_name'     => 'required',
            'price'     => 'required|numeric',
            'minimum_stay'     => 'required|integer|min:1',
            'additional_guest' => 'numeric',
            'week' => 'numeric',
            'month' => 'numeric',
            'weekend' => 'numeric',
        ];

        $attributes = [
            'start_date'   => 'Check in',
            'end_date'   => 'Check out',
            'seasonal_name'     => 'Name',
            'price'     => 'Price',
            'minimum_stay'     => 'Minimum Stay',
            'additional_guest' => 'Price per Guest',
            'week' => 'Weekly Price',
            'month' => 'Monthly Price',
            'weekend' => 'Weekend Price',
        ];
        
        $validator = Validator::make($data, $rules, [], $attributes);
        if($validator->fails()) {
            $errors = @$validator->errors()->getMessages();
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }

        if($this->check_seasonal_conflict($data) != true) {
            $errors = ['start_date' => [ 0 => 'Sorry,there is a conflict'], 'end_date' => [ 0 => 'Sorry,there is a conflict']];  
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }

        // end validation

        $data = json_decode(json_encode($data), FALSE); // convert string to object

        $checkin =  date('Y-m-d',$this->helper->custom_strtotime($data->start_date));
        $checkout =  date('Y-m-d',$this->helper->custom_strtotime($data->end_date));


        $days = $this->get_days(strtotime($checkin),strtotime($checkout));

        $rooms_price = RoomsPrice::where('room_id',$data->room_id)->first();

        $minimum_amount = $this->payment_helper->currency_convert('USD',$rooms_price->currency_code , 10);

        $currency_symbol = Currency::whereCode($rooms_price->currency_code)->first()->original_symbol;

        if($data->price)
        {
            $old_currency_format = RoomsPrice::find($data->room_id);
            $night_price = $data->price;
            if(is_numeric($night_price) && $night_price < $minimum_amount)
            {
                $msg = trans('validation.min.numeric', ['attribute' => trans('messages.inbox.price'), 'min' => $currency_symbol.$minimum_amount]);
                $errors = ['price' => [ 0 => $msg]];  
                return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);                
            }
            //$data->night=$night_price;
        }

        if($data->week)
        {
            $old_currency_format = RoomsPrice::find($data->room_id);
            $night_price = $data->week;
            if(is_numeric($night_price) && $night_price < $minimum_amount)
            {
                $msg = trans('validation.min.numeric', ['attribute' => trans('messages.inbox.price'), 'min' => $currency_symbol.$minimum_amount]);
                $errors = ['week' => [ 0 => $msg]];  
                return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);                
            }
            //$data->night=$night_price;
        }

        if($data->month)
        {
            $old_currency_format = RoomsPrice::find($data->room_id);
            $night_price = $data->month;
            if(is_numeric($night_price) && $night_price < $minimum_amount)
            {
                $msg = trans('validation.min.numeric', ['attribute' => trans('messages.inbox.price'), 'min' => $currency_symbol.$minimum_amount]);
                $errors = ['month' => [ 0 => $msg]];  
                return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);                
            }
            //$data->night=$night_price;
        }

        if($data->edit_seasonal_name != ""){          // when edit season

            $calendar = Calendar::where('room_id',$data->room_id)->where('seasonal_name',$data->edit_seasonal_name)->where('status', 'Available')->delete();
            SeasonalPrice::where('room_id',$data->room_id)->where('seasonal_name',$data->edit_seasonal_name)->delete();
        }
        
        foreach($days as $day){
            $not_available_date = Calendar::where([
                ['room_id',$data->room_id],
                ['date',$day],
                ['status', 'Not available']
            ])->first();
            if($not_available_date) continue; // if "Not Available" date exist, skip

            $reserved_date = Calendar::where([
                ['room_id',$data->room_id],
                ['date',$day],
                ['status', 'Reserved']
            ])->first();
            if($reserved_date) continue; // if "Not Available" date exist, skip

            $season = [
                        'room_id' => $data->room_id,
                        'date'    => $day,
                        'seasonal_name'    => $data->seasonal_name,
                        'start_date' => $checkin,
                        'end_date' => $checkout,
                        'price'   => $data->price,
                        'week' => @$data->week,
                        'month' => @$data->month,
                        'weekend'   => @$data->weekend,
                        'additional_guest' => @$data->additional_guest,
                        'guests' => @$data->additional_guest ? '1' : '0',
                        'minimum_stay'   => $data->minimum_stay,
                        'source' => 'Calendar',
                        'status'  => 'Available',
                    ];
             Calendar::updateOrCreate(['room_id' => $data->room_id, 'date' => $day], $season);
        }

        $seasonal_price = [
                        'room_id' => $data->room_id,                        
                        'seasonal_name'    => $data->seasonal_name,
                        'start_date' => $checkin,
                        'end_date' => $checkout,
                        'price'   => $data->price,
                        'week' => @$data->week,
                        'month' => @$data->month,
                        'weekend'   => @$data->weekend,
                        'additional_guest' => @$data->additional_guest,
                        'guests' => @$data->additional_guest ? '1' : '0',
                        'minimum_stay'   => $data->minimum_stay,
                        'source' => 'Calendar',
                        'status'  => 'Available',
                    ];
        SeasonalPrice::updateOrCreate(['room_id' => $data->room_id, 'seasonal_name' => $data->edit_seasonal_name], $seasonal_price);
        return json_encode(['success' =>'true']);
    }


    /**
     * Save blocked dates for Listing
     * @bodyParam room_id int required More descriptions.
     * @bodyParam seasonal_name int required More descriptions.
     * @bodyParam start_date int required More descriptions.
     * @bodyParam end_date int required More descriptions.
     * 
     * @response
     * {
     *      success: "true"
     * }
     */
    public function save_unavailable_dates(Request $request) {

        $data = $request->all();

        // validation part
        $rules    = [
            'start_date'   => 'required|date',
            'end_date'   => 'required|date',            
            'seasonal_name'     => 'required'
        ];

        $attributes = [
            'start_date'   => 'Check in',
            'end_date'   => 'Check out',
            'seasonal_name'     => 'Season Name'
        ];
        
        $validator = Validator::make($data, $rules, [], $attributes);
       
        if($validator->fails()) {
            $errors = @$validator->errors()->getMessages();
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }

        $checkin =  date('Y-m-d',$this->helper->custom_strtotime($request->start_date));
        $checkout =  date('Y-m-d',$this->helper->custom_strtotime($request->end_date));

        if($this->check_unavailable_conflict($data) != true) {
            $errors = ['start_date' => [ 0 => 'Sorry,there is a conflict'], 'end_date' => [ 0 => 'Sorry,there is a conflict']];  
            return json_encode(['success' => 'false', 'validator' => 'fail', 'errors' => $errors]);
        }

        // end validation

        // $data = json_decode(json_encode($data), FALSE); // convert string to object

        $checkin =  date('Y-m-d',$this->helper->custom_strtotime($data->start_date));
        $checkout =  date('Y-m-d',$this->helper->custom_strtotime($data->end_date));


        $days = $this->get_days(strtotime($checkin),strtotime($checkout));
        
        if($data->edit_seasonal_name !== ""){          // when edit unavailable dates
            // recovery relevant season            
            $not_available_date = Calendar::where('room_id',$data->room_id)->where('seasonal_name',$data->edit_seasonal_name)->where('status', 'Not available')->where('source', 'Calendar')->first();
            
            // delete all records of the unavailable date range which is to be updated
            Calendar::where('room_id',$data->room_id)->where('seasonal_name',$data->edit_seasonal_name)->where('status', 'Not available')->where('source', 'Calendar')->delete();
            // must recover season only after delete all records of the unavailable date range (because recovery function use updateOrCreate function)
            
            if($not_available_date)
            {
                $fromDate = $not_available_date->start_date;
                $toDate = $not_available_date->end_date;
                $room_id = $data->room_id;
                $this->recoverSeasonalPrices($room_id, $fromDate, $toDate);    
            }
        }

        foreach($days as $day){
            $ical_date = Calendar::where('room_id',$request->id)->where('date', $day)->where('source', 'Import')->first();
            if($ical_date) continue; // if iCal date exists, skip

            $season = [
                            'room_id' => $data->room_id,
                            'date'    => $day,
                            'seasonal_name'    => $data->seasonal_name,
                            'start_date' => $checkin,
                            'end_date' => $checkout,                            
                            'source' => 'Calendar',
                            'status'  => 'Not available'
                            ];
             Calendar::updateOrCreate(['room_id' => $data->room_id, 'date' => $day], $season);
            
        }
         return json_encode(['success' =>'true']);
    }
    public function check_unavailable_conflict($season) {

        $season = json_decode(json_encode($season), FALSE);     // convert string to object

        $start_date =  date('Y-m-d',$this->helper->custom_strtotime($season->start_date));
        $end_date =  date('Y-m-d',$this->helper->custom_strtotime($season->end_date));

        $days       = $this->get_days(strtotime($start_date), strtotime($end_date));
        foreach ($days as $day ) {
            $check_cal = Calendar::where('date',$day)->where('room_id',$season->room_id)->where('seasonal_name','!=','')
                ->where('seasonal_name','!=',$season->edit_seasonal_name)
                ->where(function($query) {
                    $query->where('status', 'Not available')->orWhere('status', 'Reserved');
                })->first();

            if(($check_cal)) {

                return false;
            }
        }

        return true;
    }

     /**
     * Get days between two dates
     *
     * @param date $sStartDate  Start Date
     * @param date $sEndDate    End Date
     * @return array $days      Between two dates
     */
    public function get_days($sStartDate, $sEndDate)
    {
        $sStartDate   = gmdate("Y-m-d", $sStartDate);
        $sEndDate     = gmdate("Y-m-d", $sEndDate);

        $aDays[]      = $sStartDate;

        $sCurrentDate = $sStartDate;

        while($sCurrentDate < $sEndDate)
        {
            $sCurrentDate = gmdate("Y-m-d", strtotime("+1 day", strtotime($sCurrentDate)));

            $aDays[]      = $sCurrentDate;
        }

        return $aDays;
    }


}
