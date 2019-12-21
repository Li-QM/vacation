<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Front\User;
use App\Models\Front\Rooms;
use App\Models\Front\Membershiptype;
use App\Models\Front\PropertyType;
use App\Models\Front\RoomType;
use App\Models\Front\RoomsPrice;
use App\Models\Front\Amenities;
class RoomsController extends Controller
{
    //
    private $user;
    public function __construct(Request $request){
        $this->user = User::where('public_api_key', $request->api_key)->first();
    }

    public function getListingDetail(Request $request){
        $room_id = $request->room_id;
        $room = Rooms::find($room_id);

        if($room){
            $result_room = array();
            $result_room['room_id'] = $room->id;
            $result_room['room_name'] = $room->name;
            $result_room['room_sub_name'] = $room->sub_name;
            $result_room['room_summary'] = $room->summary;
            $result_room['room_check_in_time'] = $room->check_in_time;
            $result_room['room_check_out_time'] = $room->check_out_time;
            $result_room['room_property_type'] = PropertyType::find($room->property_type)->first()->name;
            $result_room['room_slug'] = $room->slug;
            $result_room['room_bedrooms'] = $room->bedrooms;
            $result_room['room_beds'] = $room->beds;
            $result_room['room_bathrooms'] = $room->bathrooms;
            $amenities = explode(",", $room->amenities);
            $amenities = Amenities::whereIn('id', $amenities)->get()->pluck('name')->toArray();
            $result_room['room_amenities'] = $amenities;
            $result_room['room_bathrooms'] = $room->bathrooms;
            $result_room['room_video'] = $room->video;
            $result_room['room_featured_image'] = $room->featured_image;
            $result_room['room_featured_image_small'] = $room->featured_image_small;
            $result_room['room_price_details'] = $room->rooms_price->toArray();
            $result_room['room_address_details'] = $room->rooms_address->toArray();
            $result_room['room_calendar_details'] = $room->calendar->toArray();
         //    $result_room['room_type'] = RoomType::find($room->room_type)->first()->name;
           
            if($room->status == 'Listed'){
                 $result_room['room_plan_type'] = Membershiptype::find($room->plan_type)->Name;
                 $result_room['room_subscription_start_date'] = $room->subscription_start_date;
                 $result_room['room_subscription_end_date'] = $room->subscription_end_date;
               
            }
 
            return response()->json(array(
                 'status' => 'success',
                 'data' =>  $result_room
             ), 200);
        }
        else{
            return response()->json(array(
                'status' => 'error',
                'message' =>  'Invalid Room ID'
            ), 400);
        }
         
    }

    public function getlistings(){
    //    return $rooms = Rooms::where('user_id', $this->user->id)->get();
       $rooms = Rooms::where('user_id', $this->user->id)->get();
       $listed_listings = array();
       $unlisted_listings = array();
       foreach ($rooms as $key => $room) {
           $result_room = array();
           $result_room['room_id'] = $room->id;
           $result_room['room_name'] = $room->name;
           $result_room['room_sub_name'] = $room->sub_name;
           $result_room['room_summary'] = $room->summary;
           $result_room['room_check_in_time'] = $room->check_in_time;
           $result_room['room_check_out_time'] = $room->check_out_time;
           $result_room['room_property_type'] = PropertyType::find($room->property_type)->first()->name;
           $result_room['room_slug'] = $room->slug;
        //    $result_room['room_bedrooms'] = $room->bedrooms;
        //    $result_room['room_beds'] = $room->beds;
        //    $result_room['room_bathrooms'] = $room->bathrooms;
           $amenities = explode(",", $room->amenities);
           $amenities = Amenities::whereIn('id', $amenities)->get()->pluck('name')->toArray();
           $result_room['room_amenities'] = $amenities;
        //    $result_room['room_bathrooms'] = $room->bathrooms;
        //    $result_room['room_video'] = $room->video;
           $result_room['room_featured_image'] = $room->featured_image;
           $result_room['room_featured_image_small'] = $room->featured_image_small;
        //    $result_room['room_type'] = RoomType::find($room->room_type)->first()->name;
          
           if($room->status == 'Listed'){
                $result_room['room_plan_type'] = Membershiptype::find($room->plan_type)->Name;
                $result_room['room_subscription_start_date'] = $room->subscription_start_date;
                $result_room['room_subscription_end_date'] = $room->subscription_end_date;
                $listed_listings[] = $result_room;
           }
           else{
                $unlisted_listings[] = $result_room;
           }
       }
       return response()->json(array(
            'status' => 'success',
            'data' => [
                'listed_listings' => $listed_listings,
                'unlisted_listings' => $unlisted_listings,
            ]
        ), 200);
    }

    public function getlistingpricedetails(Request $request){
        $room_id = $request->room_id;
        $price = Rooms::find($room_id)->rooms_price->toArray();
        return $price;
    }

}
