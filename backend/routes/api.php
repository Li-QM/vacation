<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

/* Sign In */
Route::post('/login', 'Api\Auth\LoginController@Login')->name('api.login');
Route::get('/getOther', 'Api\PostController@getother')->name('api.getOther');
Route::post('/getMail', 'Api\PostController@sendcontactinformation');

Route::get('/users/signup_social', 'Auth\SocialAuthController@signup_social')->name('social.signup_social');
// UserController@create_social
Route::get('/login/{provider}', 'Auth\SocialAuthController@redirectToProvider')->name('social.login');
Route::get('/login/{provider}/callback', 'Auth\SocialAuthController@handleProviderCallback')->name('social.callback');
 
Route::get('/users/signup_social', 'Auth\SocialAuthController@signup_social')->name('social.signup_social');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
})->name('api.getuser');

// ==============Search Page Route ================
Route::post('/ajax/searchIndex', 'Front\SearchController@index');
Route::post('/ajax/searchResult', 'Front\SearchController@searchResult');
Route::post('/ajax/searchResultOnMap', 'Front\SearchController@searchResultOnMap');
Route::post('/ajax/searchMapRooms', 'Front\SearchController@searchMapRooms');

/* Need API Key */
Route::group(['middleware' => 'api_key'], function () {
    Route::get('/getlistings', 'Api\RoomsController@getlistings');
    Route::get('/getListingDetail', 'Api\RoomsController@getListingDetail');
    Route::get('/getlistingpricedetails', 'Api\RoomsController@getlistingpricedetails');

    /* listing api routes */
    Route::post('/createlisting', 'Api\ManageListingController@createRoom');
    Route::post('/addupdatebedroom', 'Api\ManageListingController@addupdatebedroom');
    Route::post('/addupdatebathroom', 'Api\ManageListingController@addupdatebathroom');
    Route::post('/deletebedroom', 'Api\ManageListingController@deletebedroom');
    Route::post('/deletebathroom', 'Api\ManageListingController@deletebathroom');
    Route::post('/update_rooms', 'Api\ManageListingController@update_rooms');
    Route::post('/update_description', 'Api\ManageListingController@update_description');
    Route::post('/finish_address', 'Api\ManageListingController@finish_address');
    Route::post('/update_amenities', 'Api\ManageListingController@update_amenities');
    Route::post('/add_photos', 'Api\ManageListingController@add_photos');
    Route::post('/update_price', 'Api\ManageListingController@update_price');
    Route::post('/update_additional_price', 'Api\ManageListingController@update_additional_price');
    Route::post('/save_reservation', 'Api\ManageListingController@save_reservation');
});

/* No need API key */
Route::post('/ajax/login', 'Auth\LoginController@Login');
Route::post('/ajax/forgot-password', 'Auth\ForgotPasswordController@forgotPassword');
Route::post('/ajax/signup', 'Auth\RegisterController@register');
Route::post('/ajax/signupSocial', 'Auth\RegisterController@signupSocial');
Route::post('/ajax/helpSearch', 'Front\Help\HelpController@searchHelp');
Route::post('/ajax/getHelpListByCategory', 'Front\Help\HelpController@getHelpListByCategory');
Route::post('/ajax/getSubcategories', 'Front\Help\HelpController@getSubcategories');
Route::post('/ajax/getQuestions', 'Front\Help\HelpController@getQuestions');
Route::get('/logout', 'Auth\LogoutController@logout');

Route::post('/ajax/updateLoginStatus', 'HomeController@updateLoginStatus');
Route::get('/ajax/rooms/send-mail-owner/{id}', 'Front\RoomsController@send_mail_owner');

Route::post('/ajax/profilepictureupload', 'Front\DashboardController@profilepictureupload');
Route::post('/ajax/saveuserprofile', 'Front\DashboardController@saveuserprofile');
Route::post('/ajax/removeUserPhoneNumber', 'Front\DashboardController@removeUserPhoneNumber');
Route::post('/ajax/change_status_of_room', 'Front\RoomsController@changestatus');

Route::get('/ajax/dashboard/index', 'Front\DashboardController@index');
Route::post('/ajax/dashboard/generateapikeys', 'Front\DashboardController@generateapikeys');
Route::get('/ajax/dashboard/getapikeys', 'Front\DashboardController@getapikeys');
Route::get('/ajax/dashboard/getverifycation', 'Front\DashboardController@getverifycation');
Route::post('/ajax/sendVerifyCode', 'Front\DashboardController@sendVerifyCode');
Route::post('/ajax/verifyPhoneNumber', 'Front\DashboardController@verifyPhoneNumber');
Route::get('/ajax/dashboard/getlistings', 'Front\RoomsController@index');
Route::get('/ajax/dashboard/my_reservations', 'Front\ReservationController@my_reservations');
Route::post('/ajax/reservation/decline/{id}', 'Front\ReservationController@decline');
Route::post('/ajax/reservation/accept/{id}', 'Front\ReservationController@accept');
Route::post('/ajax/trips/cancel/{id}', 'Front\TripsController@guest_cancel_pending_reservation');

Route::get('/ajax/dashboard/getUserList', 'Front\InboxController@getUserList');
Route::get('/ajax/dashboard/getcurrentTripsList', 'Front\TripsController@current');
Route::get('/ajax/dashboard/getOldTripsList', 'Front\TripsController@previous');
Route::get('/ajax/dashboard/getmessages', 'Front\InboxController@getmessages');

// ============== Room Management Route =================
Route::get('/ajax/rooms/new', 'Front\RoomsController@new_room');
Route::post('/ajax/rooms/create', 'Front\RoomsController@create');
Route::get('/ajax/rooms/manage_listing/{id}/{page}', 'Front\RoomsController@manage_listing');
Route::post('/ajax/rooms/saveOrUpdate_bedroom', 'Front\RoomsController@addupdatebedroom');
Route::post('/ajax/rooms/saveOrUpdate_bathroom', 'Front\RoomsController@addupdatebathroom');
Route::post('/ajax/rooms/delete_bedroom', 'Front\RoomsController@deletebedroom');
Route::post('/ajax/rooms/delete_bathroom', 'Front\RoomsController@deletebathroom');
Route::post('/ajax/rooms/manage-listing/{id}/lan_description', 'Front\RoomsController@lan_description');
Route::post('/ajax/rooms/manage-listing/{id}/rooms_steps_status', 'Front\RoomsController@rooms_steps_status');
Route::post('/ajax/rooms/manage-listing/{id}/add_description', 'Front\RoomsController@add_description');
Route::post('/ajax/rooms/manage-listing/{id}/delete_language', 'Front\RoomsController@delete_language');
Route::post('/ajax/rooms/manage-listing/{id}/get_all_language', 'Front\RoomsController@get_all_language');
Route::post('/ajax/rooms/manage-listing/{id}/update_rooms', 'Front\RoomsController@update_rooms')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/update_description', 'Front\RoomsController@update_description')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/update_price', 'Front\RoomsController@update_price')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/get_additional_charges', 'Front\RoomsController@get_additional_charges')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/get_location', 'Front\RoomsController@get_location')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/get_amenities', 'Front\RoomsController@get_amenities')->where('id', '[0-9]+');
Route::post('/ajax/rooms/manage-listing/{id}/update_amenities', 'Front\RoomsController@update_amenities')->where('id', '[0-9]+');
Route::match(['get', 'post'], '/ajax/rooms/manage-listing/update_additional_price', 'Front\RoomsController@update_additional_price');
Route::match(['get', 'post'], '/ajax/rooms/manage-listing/get_last_min_rules', 'Front\RoomsController@get_last_min_rules');
Route::post('/ajax/rooms/manage-listing/{id}/update_price_rules/{type}', 'Front\RoomsController@update_price_rules')->where('id', '[0-9]+');
Route::post('/ajax/rooms/finish_address/{id}/{page}', 'Front\RoomsController@finish_address')
    ->where(['id' => '[0-9]+', 'page' => 'basics|description|location|amenities|photos|video|pricing|calendar|details|guidebook|terms|booking|plans']);
Route::post('/ajax/rooms/add_photos/{id}', 'Front\RoomsController@add_photos')->where('id', '[0-9]+');
Route::get('/ajax/manage-listing/{id}/photos_list', 'Front\RoomsController@photos_list')->where('id', '[0-9]+');
Route::post('/ajax/manage-listing/featured_image', 'Front\RoomsController@featured_image');
Route::post('/ajax/manage-listing/change_photo_order', 'Front\RoomsController@change_photo_order');
Route::post('/ajax/manage-listing/photo_highlights', 'Front\RoomsController@photo_highlights');
Route::post('/ajax/manage-listing/{id}/delete_photo', 'Front\RoomsController@delete_photo')->where('id', '[0-9]+');
Route::get('/ajax/manage_listing/{id}/get_videoUrl', 'Front\RoomsController@get_videoUrl')->where('id', '[0-9]+');
Route::get('/ajax/manage_listing/{id}/get_cancel_message', 'Front\RoomsController@get_cancel_message')->where('id', '[0-9]+');

// ============== Calendar ======================
Route::post('/ajax/rooms/manage-listing/{id}/check_season_name', 'Front\RoomsController@check_season_name');
Route::post('/ajax/rooms/manage-listing/{id}/save_reservation', 'Front\CalendarController@save_reservation');

Route::post('/ajax/rooms/manage-listing/{id}/{year}/{month}/get_calendar_data', 'Front\CalendarController@get_calendar_data');
Route::post('/ajax/rooms/manage-listing/{id}/{year}/{month}/get_daily_prices', 'Front\CalendarController@get_daily_prices');
Route::post('/ajax/rooms/manage-listing/save_daily_prices', 'Front\CalendarController@save_daily_prices');

Route::post('/ajax/rooms/manage-listing/{id}/unavailable_calendar', 'Front\CalendarController@unavailable_calendar');
Route::get('/ajax/rooms/manage-listing/{id}/get_unavailable_calendar', 'Front\CalendarController@get_unavailable_calendar');
Route::post('/ajax/rooms/manage-listing/{id}/seasonal_calendar', 'Front\CalendarController@seasonal_calendar');
Route::post('/ajax/rooms/manage-listing/{id}/save_seasonal_price', 'Front\CalendarController@save_seasonal_price');
Route::post('/ajax/rooms/manage-listing/{id}/delete_seasonal', 'Front\RoomsController@delete_seasonal');
Route::post('/ajax/rooms/manage-listing/{id}/delete_reservation', 'Front\CalendarController@delete_reservation');
Route::post('/ajax/rooms/manage-listing/{id}/delete_not_available_days', 'Front\CalendarController@delete_not_available_days');
Route::post('/ajax/rooms/manage-listing/{id}/save_unavailable_dates', 'Front\CalendarController@save_unavailable_dates');
Route::get('/calendar/ical/{id}', 'Front\CalendarController@ical_export');
Route::get('/ajax/rooms/manage-listing/{id}/ical_delete', 'Front\CalendarController@ical_delete');
Route::get('/ajax/rooms/manage-listing/{id}/ical_refresh', 'Front\CalendarController@ical_refresh');
Route::post('/ajax/rooms/manage-listing/{id}/check_reservation_conflict_req', 'Front\RoomsController@check_reservation_conflict_req');
Route::match(['get', 'post'], '/ajax/rooms/manage-listing/{id}/calendar_import', 'Front\CalendarController@ical_import')->where('id', '[0-9]+');

// ============== Room booking ================
Route::post('/ajax/book/request/{id}', 'Front\RoomsController@roombooking');

// ============== Home Page Route   =================
Route::get('/ajax/home/index', 'HomeController@index');

// ============== Detail Page Route =================
Route::get('/ajax/homes/{room_id}/unavailable_calendar', 'Front\RoomsController@unavailable_calendar');
Route::get('/ajax/homes/review/{room_id}', 'Front\RoomsController@getRoomReviews');
Route::get('/ajax/homes/similar/{room_id}', 'Front\RoomsController@getSimilarListings');
Route::get('/ajax/homes/housetype/{room_id}', 'Front\RoomsController@getHouseType');
Route::get('/ajax/homes/amenities_type/{room_id}', 'Front\RoomsController@get_amenities_type');
Route::get('/ajax/homes/descriptions/{room_id}', 'Front\RoomsController@getRoomDescriptions');
Route::get('/ajax/homes/seasonal_rate/{room_id}', 'Front\RoomsController@get_room_seasonal_rate');
Route::get('/ajax/homes/photos/{room_id}', 'Front\RoomsController@getRoomPhotos');

Route::get('/ajax/homes/{address_url}/{room_id}', 'Front\RoomsController@rooms_detail');
Route::get('/ajax/homes/{room_id}', 'Front\RoomsController@rooms_short_detail');

Route::post('/ajax/users/reviews', 'Front\ReviewController@store');
Route::get('/ajax/wishlist_list', 'Front\WishlistController@wishlist_list');
Route::post('/ajax/wishlist_create', 'Front\WishlistController@create');
Route::post('/ajax/save_wishlist', 'Front\WishlistController@save_wishlist');
Route::post('/ajax/rooms/price_calculation', 'Front\RoomsController@price_calculation');

//=============== PricingPageRoute ========================
Route::get('/ajax/membershiptypes', 'Front\MembershipController@gettypes');
Route::get('/ajax/membershiptype/{planId}', 'Front\MembershipController@gettype');
Route::post('/ajax/membership/stripe', 'Front\MembershipController@stripe');
Route::post('/ajax/membership/braintree_token', 'Front\MembershipController@Braintree_token');
// Route::post('/ajax/paypal/subscribe/createplan', 'Front\MembershipController@paypal_createplan');
Route::post('/ajax/paypal/subscribe/excute', 'Front\MembershipController@paypal_excute');

//============== Listing Subscribe Page ===========
Route::get('/ajax/rooms/getpublishlistings/{id}', 'Front\RoomsController@getpublishlistings');
Route::post('/ajax/rooms/post_subscribe_property/{id}', 'Front\RoomsController@post_subscribe_property');
Route::post('/ajax/rooms/post_subscribe_property_paypal/create_plan', 'Front\MembershipController@paypal_createplan');

// ============= Chat Route ======================
Route::post('/ajax/chat/sendmessage', 'Front\ChatsController@sendMessage');
Route::post('/ajax/chatcontact/updatestatus', 'Front\ChatsController@updatecontactstatus');
Route::post('/ajax/chat/readMessage', 'Front\ChatsController@readmessage');
Route::post('/ajax/chat/fileupload', 'Front\ChatsController@fileupload');
Route::post('/ajax/chat/isTyping', 'Front\ChatsController@isTyping');

Route::get('/ajax/chat/getmessages', 'Front\ChatsController@getmessages');
Route::get('/ajax/chat/getcontactlists', 'Front\ChatsController@getcontactlists');
Route::get('/ajax/chat/getContactId/{hostid}/{userid}', 'Front\ChatsController@getContactId');

// ==============BLOG Route ====================
Route::get('/ajax/blog/index', 'Front\PostController@index');

Route::get('/ajax/blog/get_author_info/{author_id}', 'Front\PostController@getAuthorInfo');
Route::get('/ajax/blog/category/{slug}', 'Front\PostController@searchByCategory');
Route::get('/ajax/blog/tag/{slug}', 'Front\PostController@searchByTag');
Route::get('/ajax/blog/author/{author}', 'Front\PostController@searchByAuthor');
Route::get('/ajax/blog/detail/{post}', 'Front\PostController@detail');

Route::post('/ajax/blog/post/comment', 'Front\PostController@comment');
Route::post('/ajax/blog/post/comment/reply', 'Front\PostController@commentreply');

Route::get('/ajax/get/page/{slug}', 'Front\PagesController@get_page_details');
Route::get('/ajax/pages/getStateListings/{page_name}/{state}', 'Front\PagesController@getStateListings');
Route::get('/ajax/pages/getCityListings/{page_name}/{state}', 'Front\PagesController@getCityListings');

// ================== Booking Automation =================
Route::group(['name' => 'bookingautomation'], function () {
  Route::post('/ba/account/register', 'BA\BookingAutomationController@createAccount');
  Route::get('/ba/account/getpropid', 'BA\BookingAutomationController@getPropId');
  Route::get('/ba/account/getcredential', 'BA\BookingAutomationController@getCredential');
  Route::get('/ba/account/get_ba_credential', 'BA\BookingAutomationController@getBaCredential');

  Route::group(['name' => 'api'], function () {
    Route::get('/ba/api/get_pricing/{room_id}', 'BA\BookingAutomationController@getPricing');
    Route::get('/ba/api/get_property/', 'BA\BookingAutomationController@getProperty');
    Route::get('/ba/api/get_room/{room_id}', 'BA\BookingAutomationController@getRoom');
    Route::get('/ba/api/get_availability/{room_id}/{start}/{end}', 'BA\BookingAutomationController@getAvailability');
    Route::get('/ba/api/get_room_dates', 'BA\BookingAutomationController@getRoomDates');
    Route::get('/ba/api/get_room_status', 'BA\BookingAutomationController@getRoomStatus');

    Route::get('/ba/api/getroomlistings', 'BA\BookingAutomationController@getListingsHasBa');
    Route::get('/ba/api/update', 'BA\BookingAutomationController@update');
    Route::get('/ba/api/set_baroomid', 'BA\BookingAutomationController@setBaRoomId');
    Route::get('/ba/api/get_baroomid', 'BA\BookingAutomationController@getBaRoomId');
    Route::get('/ba/api/get_bookings', 'BA\BookingAutomationController@getBookings');
  });
});

// ================= Email Feedback ======================
Route::get('/verify-user/{id}', 'Auth\RegisterController@activateUser')->name('activate.user');

// ================== Others =============================
Route::get('/ImageFix/{from}/{to}', function($from, $to){
  $photos = App\Models\Front\RoomsPhotos::where('name' ,'like' ,'% %')->where('room_id' ,'>=' ,$from)->where('room_id' ,'<=' ,$to)->get()->pluck('id')->toArray();
  return view('imagefix',compact('photos'));
});
Route::get('/allImageUpload', function(){
  $photos = App\Models\Front\RoomsPhotos::where('storage', 'local')->where('room_id' ,'<' ,10300)->get()->pluck('id')->toArray();
  return view('imageupload',compact('photos'));
});
Route::get('/allImageUpload/{from}/{to}', function($from, $to){
  $photos = App\Models\Front\RoomsPhotos::where('storage', 'local')->where('room_id' ,'>=' ,$from)->where('room_id' ,'<=' ,$to)->get()->pluck('id')->toArray();
  return view('imageupload',compact('photos'));
});
Route::post('/ImageUploadToCloudinary', 'UploadController@allImageUpload');
Route::post('/ImageFix', 'UploadController@ImageFix');
Route::get('/configtesting',function(){
  return "Testing";
});

Route::get('/images/users/{user_id}/{file_name}', function($user_id, $file_name){
  $path = public_path('') . '/images/users/'.$user_id.'/' . $file_name;
  if(!File::exists($path)) {
      $user = App\Models\Front\User::find($user_id);
      if($user->gender == 'Male'){
          // $path = '/user_pic-225x225.png';
      }
      else{
          // $path = 'https://images.vexels.com/media/users/3/129677/isolated/preview/cad2cddbbee48118f17cf866279ccfd4-businesswoman-avatar-silhouette-by-vexels.png';
      }
      $path = public_path('') . '/images/user_pic-225x225.png';
      // $path = 'https://ui-avatars.com/api/?name=' . $user->full_name;
  }

  $file = File::get($path);
  $type = File::mimeType($path);

  $response = Response::make($file, 200);
  $response->header("Content-Type", $type);

  return $response; // return 'http://www.ihps.si/wp-content/themes/ihps/images/my-placeholder.png';
});
