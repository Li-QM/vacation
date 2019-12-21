<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */
// -----------------------------------------

Route::get('/verify-user/{id}', 'Auth\RegisterController@activateUser')->name('activate.user');

Route::get('/images/users/{user_id}/{file_name}', function ($user_id, $file_name) {
    $path = public_path('') . '/images/users/' . $user_id . '/' . $file_name;
    if (!File::exists($path)) {
        $user = App\Models\Front\User::find($user_id);
        if ($user->gender == 'Male') {
            // $path = '/user_pic-225x225.png';
        } else {
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
Route::get('/images/pages/{file_name}', function ($file_name) {
    // dd($file_name);
    $path = public_path('') . '/images/pages/' . $file_name;
    if (!File::exists($path)) {
        $path = public_path('') . '/images/booking_1.jpg';
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response; // return 'http://www.ihps.si/wp-content/themes/ihps/images/my-placeholder.png';
});
Route::get('/images/posts/{file_name}', function ($file_name) {
    // dd($file_name);
    $path = public_path('') . '/images/pages/' . $file_name;
    if (!File::exists($path)) {
        $path = public_path('') . '/images/booking_1.jpg';
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response; // return 'http://www.ihps.si/wp-content/themes/ihps/images/my-placeholder.png';
});
Route::get('/images/rooms/{user_id}/{file_name}', function ($user_id, $file_name) {
    // dd($file_name);
    $path = public_path('') . '/images/rooms/' . $user_id . '/' . $file_name;
    if (!File::exists($path)) {
        $path = public_path('') . '/images/placeholder.png';
    }
    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response; // return 'http://www.ihps.si/wp-content/themes/ihps/images/my-placeholder.png';
});


/* ==============Admin Route ====================*/
// Admin Panel Routes
Route::prefix('admin')->group(function () {

    Route::get('/', function () {return Redirect::to('admin/dashboard');})->name('admin.index');

    /* Admin Login Routes */
    Route::get('/login', 'Auth\AdminLoginController@showLoginForm')->name('admin.login');
    Route::post('/login', 'Auth\AdminLoginController@login')->name('admin.login.submit');
    Route::post('/logout', 'Auth\AdminLoginController@logout')->name('admin.logout');

    /* Admin Dashboard Routes */
    Route::get('/dashboard', 'Admin\AdminController@index')->name('admin.dashboard');

    /* Admin Users Management Routes */
    Route::get('/admin_users', 'Admin\AdminusersController@users')->name('admin.admin.users');
    Route::match(array('GET', 'POST'), '/add_admin_user', 'Admin\AdminusersController@add');
    Route::match(array('GET', 'POST'), '/edit_admin_user/{id}', 'Admin\AdminusersController@update')->where('id', '[0-9]+');
    Route::post('/delete_admin_user', 'Admin\AdminusersController@delete');

    /* Admin Users Roles Management Routes */
    Route::get('/admin_roles', 'Admin\AdminusersController@roles')->name('admin.admin.roles');
    Route::match(array('GET', 'POST'), '/add_admin_role', 'Admin\AdminusersController@addRole');
    Route::match(array('GET', 'POST'), '/edit_admin_role/{id}', 'Admin\AdminusersController@updateRole')->where('id', '[0-9]+');
    Route::post('/delete_admin_role', 'Admin\AdminusersController@deleteRole');

    /* Users  Management Routes */
    Route::get('/users', 'Admin\UsersController@users')->name('admin.users');
    Route::get('/todayusers', 'Admin\UsersController@users')->name('admin.todayusers');
    Route::match(array('GET', 'POST'), '/add_user', 'Admin\UsersController@add');
    Route::match(array('GET', 'POST'), '/edit_user/{id}', 'Admin\UsersController@update')->where('id', '[0-9]+');
    Route::post('/delete_user', 'Admin\UsersController@delete');

    /* Properties  Management Routes */
    Route::get('/rooms', 'Admin\RoomsController@rooms')->name('admin.rooms');
    Route::get('/todayrooms', 'Admin\RoomsController@rooms')->name('admin.todayrooms');
    Route::match(array('GET', 'POST'), '/add_room', 'Admin\RoomsController@add');
    Route::match(array('GET', 'POST'), '/edit_room/{id}', 'Admin\RoomsController@update')->where('id', '[0-9]+');
    Route::post('/delete_room', 'Admin\RoomsController@room_delete');
    Route::get('/delete_room/{did}', 'Admin\RoomsController@room_delete');
    Route::match(array('GET', 'POST'), '/publish_room/{id}', 'Admin\RoomsController@publish')->where('id', '[0-9]+');
    Route::match(array('GET', 'POST'), '/popular_room/{id}', 'Admin\RoomsController@popular')->where('id', '[0-9]+');
    Route::match(array('GET', 'POST'), '/recommended_room/{id}', 'Admin\RoomsController@recommended')->where('id', '[0-9]+');

    /* Properties Tags  Management Properties */
    Route::get('/rooms/tags', 'Admin\RoomTagController@index')->name('admin.rooms_tags');
    Route::match(array('GET', 'POST'), '/add_room_tag', 'Admin\RoomTagController@add');
    Route::match(array('GET', 'POST'), '/edit_room_tag/{id}', 'Admin\RoomTagController@update')->where('id', '[0-9]+');
    Route::post('/delete_room_tag', 'Admin\RoomTagController@delete');

    /* Reservations  Management Routes */
    Route::get('/reservations', 'Admin\ReservationsController@index')->name('admin.reservations');
    Route::get('/todayreservations', 'Admin\ReservationsController@index')->name('admin.todayreservations');
    Route::get('/reservation/detail/{id}', 'Admin\ReservationsController@detail')->where('id', '[0-9]+');
    Route::get('/reservation/conversation/{id}', 'Admin\ReservationsController@conversation')->where('id', '[0-9]+');

    /* Email  Management Routes */
    Route::match(array('GET', 'POST'), '/send_email', 'Admin\EmailController@send_email')->name('admin.send_email');
    Route::match(array('GET', 'POST'), '/email_settings', 'Admin\EmailController@index')->name('admin.email_settings');

    /* Reviews  Management Routes */
    Route::match(array('GET', 'POST'), '/reviews', 'Admin\ReviewsController@reviews')->name('admin.reviews');
    Route::match(array('GET', 'POST'), '/edit_review/{id}', 'Admin\ReviewsController@update')->where('id', '[0-9]+');

    /* referrals  Management Routes */
    Route::get('/referrals', 'Admin\ReferralsController@referrals')->name('admin.referrals');
    Route::get('/referrals_details/{id}', 'Admin\ReferralsController@details')->where('id', '[0-9]+')->name('admin.referrals.details');
    Route::match(array('GET', 'POST'), '/add_referral', 'Admin\ReferralsController@add');
    Route::match(array('GET', 'POST'), '/edit_referral/{id}', 'Admin\ReferralsController@update')->where('id', '[0-9]+');

    /* Wishlists  Management Routes */
    Route::get('/wishlists', 'Admin\WishlistController@wishlists')->name('admin.wishlists');
    Route::match(array('GET', 'POST'), '/pick_wishlist/{id}', 'Admin\WishlistController@pick')->where('id', '[0-9]+');

    /* CouponCode  Management Routes */
    Route::get('/coupon_code', 'Admin\CouponCodeController@coupon')->name('admin.coupon');
    Route::match(array('GET', 'POST'), '/add_coupon_code', 'Admin\CouponCodeController@add');
    Route::match(array('GET', 'POST'), '/edit_coupon_code/{id}', 'Admin\CouponCodeController@update')->where('id', '[0-9]+');
    Route::post('/delete_coupon_code', 'Admin\CouponCodeController@delete');

    /* Report  Management Routes */
    Route::match(['GET', 'POST'], '/reports', 'Admin\ReportsController@index')->name('admin.reports');
    Route::post('/reports/export/{from}/{to}/{category}', 'Admin\ReportsController@export');

    /* CouponCode  Management Routes */
    Route::get('/home_cities', 'Admin\HomeCitiesController@index')->name('admin.home_cities');
    Route::match(array('GET', 'POST'), '/add_home_city', 'Admin\HomeCitiesController@add');
    Route::match(array('GET', 'POST'), '/edit_home_city/{id}', 'Admin\HomeCitiesController@update')->where('id', '[0-9]+');
    Route::post('/delete_home_city', 'Admin\HomeCitiesController@delete');

    /* Homepage Image Slider  Management Routes */
    Route::get('/slider', 'Admin\SliderController@index')->name('admin.slider');
    Route::match(array('GET', 'POST'), '/add_slider', 'Admin\SliderController@add');
    Route::match(array('GET', 'POST'), '/edit_slider/{id}', 'Admin\SliderController@update')->where('id', '[0-9]+');
    Route::post('/delete_slider', 'Admin\SliderController@delete');

    /* Bottom Slider  Management Routes */
    Route::get('/bottom_slider', 'Admin\BottomSliderController@index')->name('admin.bottom_slider');
    Route::match(array('GET', 'POST'), '/add_bottom_slider', 'Admin\BottomSliderController@add');
    Route::match(array('GET', 'POST'), '/edit_bottom_slider/{id}', 'Admin\BottomSliderController@update')->where('id', '[0-9]+');
    Route::post('/delete_bottom_slider', 'Admin\BottomSliderController@delete')->where('id', '[0-9]+');

    /* Posts  Management Routes */
    Route::get('/posts', 'Admin\PostsController@index')->name('admin.posts');
    Route::match(array('GET', 'POST'), '/add_post', 'Admin\PostsController@add');
    Route::match(array('GET', 'POST'), '/edit_post/{id}', 'Admin\PostsController@update')->where('id', '[0-9]+');
    Route::post('/delete_post', 'Admin\PostsController@delete')->where('id', '[0-9]+');

    /* Categories  Management Routes */
    Route::get('/categories', 'Admin\CategoriesController@index')->name('admin.categories');
    Route::match(array('GET', 'POST'), '/add_category', 'Admin\CategoriesController@add');
    Route::match(array('GET', 'POST'), '/edit_category/{id}', 'Admin\CategoriesController@update')->where('id', '[0-9]+');
    Route::post('/delete_category', 'Admin\CategoriesController@delete')->where('id', '[0-9]+');

    /* Tags  Management Routes */
    Route::get('/tags', 'Admin\TagsController@index')->name('admin.tags');
    Route::match(array('GET', 'POST'), '/add_tag', 'Admin\TagsController@add');
    Route::match(array('GET', 'POST'), '/edit_tag/{id}', 'Admin\TagsController@update')->where('id', '[0-9]+');
    Route::post('/delete_tag', 'Admin\TagsController@delete')->where('id', '[0-9]+');

    /* testimonials  Management Routes */
    Route::get('/testimonials', 'Admin\TestimonialsController@index')->name('admin.testimonials');
    Route::match(array('GET', 'POST'), '/add_testimonial', 'Admin\TestimonialsController@add');
    Route::match(array('GET', 'POST'), '/edit_testimonial/{id}', 'Admin\TestimonialsController@update')->where('id', '[0-9]+');
    Route::post('/delete_testimonial', 'Admin\TestimonialsController@delete')->where('id', '[0-9]+');

    /* Our Community Banners  Management Routes */
    Route::get('/our_community_banners', 'Admin\OurCommunityBannersController@index')->name('admin.our_community_banners');
    Route::match(array('GET', 'POST'), '/add_our_community_banners', 'Admin\OurCommunityBannersController@add');
    Route::match(array('GET', 'POST'), '/edit_our_community_banners/{id}', 'Admin\OurCommunityBannersController@update')->where('id', '[0-9]+');
    Route::post('/delete_our_community_banners', 'Admin\OurCommunityBannersController@delete')->where('id', '[0-9]+');

    /* Host Banners  Management Routes */
    Route::get('/host_banners', 'Admin\HostBannersController@index')->name('admin.host_banners');
    Route::match(array('GET', 'POST'), '/add_host_banners', 'Admin\HostBannersController@add');
    Route::match(array('GET', 'POST'), '/edit_host_banners/{id}', 'Admin\HostBannersController@update')->where('id', '[0-9]+');
    Route::post('/delete_host_banners', 'Admin\HostBannersController@delete')->where('id', '[0-9]+');

    /* Help  Management Routes */
    Route::get('/help', 'Admin\HelpController@index')->name('admin.help');
    Route::match(array('GET', 'POST'), '/add_help', 'Admin\HelpController@add');
    Route::match(array('GET', 'POST'), '/edit_help/{id}', 'Admin\HelpController@update')->where('id', '[0-9]+');
    Route::post('/delete_help', 'Admin\HelpController@delete')->where('id', '[0-9]+');

    /* Help Category Management Routes */
    Route::get('/help_category', 'Admin\HelpCategoryController@index')->name('admin.help_category');
    Route::match(array('GET', 'POST'), '/add_help_category', 'Admin\HelpCategoryController@add');
    Route::match(array('GET', 'POST'), '/edit_help_category/{id}', 'Admin\HelpCategoryController@update')->where('id', '[0-9]+');
    Route::post('/delete_help_category', 'Admin\HelpCategoryController@delete')->where('id', '[0-9]+');

    /* Help Subcategory Management Routes */
    Route::get('/help_subcategory', 'Admin\HelpSubCategoryController@index')->name('admin.help_subcategory');
    Route::match(array('GET', 'POST'), '/add_help_subcategory', 'Admin\HelpSubCategoryController@add');
    Route::match(array('GET', 'POST'), '/edit_help_subcategory/{id}', 'Admin\HelpSubCategoryController@update')->where('id', '[0-9]+');
    Route::post('/delete_help_subcategory', 'Admin\HelpSubCategoryController@delete')->where('id', '[0-9]+');
    Route::post('/ajax_help_subcategory/{id}', 'Admin\HelpController@ajax_help_subcategory')->where('id', '[0-9]+');

    /* Amenities Management Routes */
    Route::get('/amenities', 'Admin\AmenitiesController@index')->name('admin.amenities');
    Route::match(array('GET', 'POST'), '/add_amenity', 'Admin\AmenitiesController@add');
    Route::match(array('GET', 'POST'), '/edit_amenity/{id}', 'Admin\AmenitiesController@update')->where('id', '[0-9]+');
    Route::post('/delete_amenity', 'Admin\AmenitiesController@delete')->where('id', '[0-9]+');

    /* Amenities Type Management Routes */
    Route::get('/amenities_type', 'Admin\AmenitiesTypeController@index')->name('admin.amenities_type');
    Route::match(array('GET', 'POST'), '/add_amenities_type', 'Admin\AmenitiesTypeController@add');
    Route::match(array('GET', 'POST'), '/edit_amenities_type/{id}', 'Admin\AmenitiesTypeController@update')->where('id', '[0-9]+');
    Route::post('/delete_amenities_type', 'Admin\AmenitiesTypeController@delete')->where('id', '[0-9]+');

    /* Subscription Plan Management Routes */
    Route::get('/subscriptions_plan', 'Admin\SubscriptionController@plan_index')->name('admin.subscriptions_plan');
    Route::match(array('GET', 'POST'), '/add_subscription_plan', 'Admin\SubscriptionController@plan_add');
    Route::match(array('GET', 'POST'), '/edit_subscription_plan/{id}', 'Admin\SubscriptionController@plan_update')->where('id', '[0-9]+');
    Route::post('/delete_subscription_plan', 'Admin\SubscriptionController@plan_delete')->where('id', '[0-9]+');

    /* Subscription List Management Routes */
    Route::get('/subscriptions_free', 'Admin\SubscriptionController@free_index')->name('admin.subscriptions_free');
    Route::match(array('GET', 'POST'), '/detail_subscription_free/{id}', 'Admin\SubscriptionController@free_detail')->where('id', '[0-9]+');

    /*Property manager Management Routes */
    Route::get('/property_manager', 'Admin\PropertyManagerController@index')->name('admin.property_manager');
    Route::match(array('GET', 'POST'), '/add_property_manager', 'Admin\PropertyManagerController@add');

    /*Property Type Management Routes */
    Route::get('/property_type', 'Admin\PropertyTypeController@index')->name('admin.property_type');
    Route::match(array('GET', 'POST'), '/add_property_type', 'Admin\PropertyTypeController@add');
    Route::match(array('GET', 'POST'), '/edit_property_type/{id}', 'Admin\PropertyTypeController@update')->where('id', '[0-9]+');
    Route::post('/delete_property_type', 'Admin\PropertyTypeController@delete')->where('id', '[0-9]+');

    /*Room Type Management Routes */
    Route::get('/room_type', 'Admin\RoomTypeController@index')->name('admin.room_type');
    Route::match(array('GET', 'POST'), '/add_room_type', 'Admin\RoomTypeController@add');
    Route::match(array('GET', 'POST'), '/edit_room_type/{id}', 'Admin\RoomTypeController@update')->where('id', '[0-9]+');
    Route::match(array('GET', 'POST'), '/status_check/{id}', 'Admin\RoomTypeController@chck_status')->where('id', '[0-9]+');
    Route::match(array('GET', 'POST'), '/bed_status_check/{id}', 'Admin\BedTypeController@chck_status')->where('id', '[0-9]+');
    Route::post('/delete_room_type', 'Admin\RoomTypeController@delete')->where('id', '[0-9]+');

    /*Bed Type Management Routes */
    Route::get('/bed_type', 'Admin\BedTypeController@index')->name('admin.bed_type');
    Route::match(array('GET', 'POST'), '/add_bed_type', 'Admin\BedTypeController@add');
    Route::match(array('GET', 'POST'), '/edit_bed_type/{id}', 'Admin\BedTypeController@update')->where('id', '[0-9]+');
    Route::post('/delete_bed_type', 'Admin\BedTypeController@delete')->where('id', '[0-9]+');

    /*Pages Management Routes */
    Route::get('/pages', 'Admin\PageController@index')->name('admin.pages');
    Route::match(array('GET', 'POST'), '/add_page', 'Admin\PageController@add');
    Route::match(array('GET', 'POST'), '/edit_page/{id}', 'Admin\PageController@update')->where('id', '[0-9]+');
    Route::post('/delete_page', 'Admin\PageController@delete')->where('id', '[0-9]+');

    /*Template Management Routes */
    Route::get('/templates', 'Admin\TemplateController@index')->name('admin.templates');
    Route::match(array('GET', 'POST'), '/add_template', 'Admin\TemplateController@add');
    Route::match(array('GET', 'POST'), '/edit_template/{id}', 'Admin\TemplateController@update')->where('id', '[0-9]+');
    Route::post('/delete_template', 'Admin\TemplateController@delete')->where('id', '[0-9]+');

    /*Currency Management Routes */
    Route::get('/currency', 'Admin\CurrencyController@index')->name('admin.currency');
    Route::match(array('GET', 'POST'), '/add_currency', 'Admin\CurrencyController@add');
    Route::match(array('GET', 'POST'), '/edit_currency/{id}', 'Admin\CurrencyController@update')->where('id', '[0-9]+');
    Route::post('/delete_currency', 'Admin\CurrencyController@delete')->where('id', '[0-9]+');

    /*Language Management Routes */
    Route::get('/language', 'Admin\LanguageController@index')->name('admin.language');
    Route::match(array('GET', 'POST'), '/add_language', 'Admin\LanguageController@add');
    Route::match(array('GET', 'POST'), '/edit_language/{id}', 'Admin\LanguageController@update')->where('id', '[0-9]+');
    Route::post('/delete_language', 'Admin\LanguageController@delete')->where('id', '[0-9]+');

    /*Country Management Routes */
    Route::get('/country', 'Admin\CountryController@index')->name('admin.country');
    Route::match(array('GET', 'POST'), '/add_country', 'Admin\CountryController@add');
    Route::match(array('GET', 'POST'), '/edit_country/{id}', 'Admin\CountryController@update')->where('id', '[0-9]+');
    Route::post('/delete_country', 'Admin\CountryController@delete')->where('id', '[0-9]+');

    /*Referral Settings  Management Routes */
    Route::match(array('GET', 'POST'), '/referral_settings', 'Admin\ReferralSettingsController@index')->name('admin.referral_settings');

    /*Discount  Management Routes */
    Route::match(array('GET', 'POST'), '/fees', 'Admin\FeesController@index')->name('admin.fees');

    /*Meta Management Routes */
    Route::get('/metas', 'Admin\MetasController@index')->name('admin.metas');
    Route::match(array('GET', 'POST'), '/add_meta', 'Admin\MetasController@add');
    Route::match(array('GET', 'POST'), '/edit_meta/{id}', 'Admin\MetasController@update')->where('id', '[0-9]+');
    Route::post('/delete_meta', 'Admin\MetasController@delete')->where('id', '[0-9]+');

    /*Api credentials  Management Routes */
    Route::match(array('GET', 'POST'), '/api_credentials', 'Admin\ApiCredentialsController@index')->name('admin.api_credentials');

    /*Payment Gateway  Management Routes */
    Route::match(array('GET', 'POST'), '/payment_gateway', 'Admin\PaymentGatewayController@index')->name('admin.payment_gateway');

    /*Join Us  Management Routes */
    Route::match(array('GET', 'POST'), '/join_us', 'Admin\JoinUsController@index')->name('admin.join_us');

    /*Theme Settings  Management Routes */
    Route::match(array('GET', 'POST'), '/theme_settings', 'Admin\ThemeSettingsController@index')->name('admin.theme_settings');

    /*Site Settings  Management Routes */
    Route::match(array('GET', 'POST'), '/site_settings', 'Admin\SiteSettingsController@index')->name('admin.site_settings');
});

/* UI */
Route::get('sitemap.xml', function () {

    // create new sitemap object
    $sitemap = App::make('sitemap');

    // set cache key (string), duration in minutes (Carbon|Datetime|int), turn on/off (boolean)
    // by default cache is disabled
    // $sitemap->setCache('laravel.sitemap', 60);

    // check if there is cached sitemap and build new only if is not
    if (!$sitemap->isCached()) {
        // add item to the sitemap (url, date, priority, freq)
        $sitemap->add(URL::to('/'), date('Y-m-d H:i:s'), '1.0', 'daily');

        // // get all posts from db
        // $posts = DB::table('posts')->orderBy('created_at', 'desc')->get();
        $rooms = DB::table('rooms')->where('status', 'Listed')->orderBy('created_at', 'desk')->get();
        // dd($rooms);
        // // add every post to the sitemap
        foreach ($rooms as $room) {
            $sitemap->add(URL::to("/homes/$room->slug/$room->id"), $room->updated_at, '1.0', 'daily');
        }
    }

    // show your sitemap (options: 'xml' (default), 'html', 'txt', 'ror-rss', 'ror-rdf')
    return $sitemap->render('xml');
});

Route::get('sitemap', function () {

    // create new sitemap object
    $sitemap = App::make('sitemap');

    // set cache key (string), duration in minutes (Carbon|Datetime|int), turn on/off (boolean)
    // by default cache is disabled
    // $sitemap->setCache('laravel.sitemap', 60);

    // check if there is cached sitemap and build new only if is not
    if (!$sitemap->isCached()) {
        // add item to the sitemap (url, date, priority, freq)
        $sitemap->add(URL::to('/'), date('Y-m-d H:i:s'), '1.0', 'daily');

        // // get all posts from db
        // $posts = DB::table('posts')->orderBy('created_at', 'desc')->get();
        $rooms = DB::table('rooms')->where('status', 'Listed')->orderBy('created_at', 'desk')->get();
        // dd($rooms);
        // // add every post to the sitemap
        foreach ($rooms as $room) {
            $sitemap->add(URL::to("/homes/$room->slug/$room->id"), $room->updated_at, '1.0', 'daily');
        }
    }

    // show your sitemap (options: 'xml' (default), 'html', 'txt', 'ror-rss', 'ror-rdf')
    return $sitemap->render('xml');
});

Route::get('/404', function () {
    abort('404');
});

