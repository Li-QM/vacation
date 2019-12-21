<?php

namespace App\Http\Controllers\Front;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Front\Page;
use App\Models\Front\Rooms;
use DB;
class PagesController extends Controller
{
    //

    public function get_page_details($slug){
        $row = DB::table("permalinks")->where("slug", $slug)->first();
        $page_detail = Page::with('permalink')->with('template')->find($row->permalinkable_id);
        return array(
            'id' => $page_detail->id,
            'under' => $page_detail->under,
            'template_id' => $page_detail->template_id,
            'h1_tag' => isset($page_detail->permalink->seo['meta']['h1_tag']) ? $page_detail->permalink->seo['meta']['h1_tag'] : '',
            'image_url' => $page_detail->image_url,
            'name' => $page_detail->name,
            'excerpt' => $page_detail->excerpt,
            'content' => $page_detail->content,
            'permalink_parent_name' => $page_detail->permalink_parent_name ,
            'meta_title' => isset($page_detail->permalink->seo['meta']['title']) ? $page_detail->permalink->seo['meta']['title'] : $page_detail->name,
            'children' => $page_detail->permalink->children,
        );
    }
    

    public function getStateListings($page_name, $state){
        return Rooms::listed()->state( $page_name )->where('name', '<>', '')->take(10)->get()->shuffle();
    }
    public function getCityListings($page_name, $state){
        return Rooms::listed()->city( $page_name )->where('name', '<>', '')->take(10)->get()->shuffle();
    }

    public function showLegalPage($slug){
        $row = DB::table("permalinks")->where("slug", $slug)->first();
        // dd($row);
        $page_detail = Page::with('permalink')->with('template')->find($row->permalinkable_id);
        return view('static_pages', compact('row', 'page_detail'));
    }
}
