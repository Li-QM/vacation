<?php

namespace App\Http\Controllers\Front;

use App\Models\Front\Page;
use App\Models\Front\User;
use App\Traits\MetaHelpers;
use Illuminate\Http\Request;
use App\Models\Front\Post;
use App\Models\admin\Post as PostPermalink;
use App\Models\Front\Category;
use App\Models\Front\Admin;
use App\Models\Front\Rooms;
use App\Models\Front\Tag;
use App\Models\PostComment;
use Carbon\Carbon;
use App\Http\Start\Helpers;
use App\Http\Controllers\Controller;
use Auth;
/**
 * Class PostController
 *
 * @package App\Http\Controllers
 */
class PostController extends Controller{
	use MetaHelpers;

	protected $helper; // Global variable for instance of Helpers

	public function __construct(){
		$this->helper = new Helpers;
	}

	/**
	 * @param \App\Models\Front\Page $page
	 *
	 * @param \App\Models\Front\Post $post
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
	 * @throws \InvalidArgumentException
	 */
	public function index(  Request $request ) {
		$blogId = $request->blogid;
		
		
		$featured      = Post::where( 'status', 'Publish' )->where( 'featured', 1 )->latest( 'publish_date' )->take( 6 )->get();
		$last_featured = null;
		if($featured->isNotEmpty()){
			$last_featured = Post::with( 'permalink' )->where( 'status', 'Publish' )->where( 'featured', 1 )->latest( 'publish_date' )->first();
			$posts         = Post::where( 'status', 'Publish' )->where( 'id', '<>', $last_featured->id )->latest( 'publish_date' )->paginate( 20 );
		}else{
			$posts = Post::where( 'status', 'Publish' )->latest( 'publish_date' )->paginate( 20 );
		}
	 
		$latest_listing = Rooms::where('status', 'Listed')->latest()->take(6)->get();
		$categories     = Category::all();
		if($blogId){
			$tags           = Post::find($blogId)->tags()->get();
			$categories     = Post::find($blogId)->categories()->get();
		}
		else{
			$tags           = Tag::all();
		}
		
 
        return [
			'posts'          => $posts,
			'tags'           => $tags,
			'categories'     => $categories,
			'last_featured'  => $last_featured,
			'featured'       => $featured,
			'latest_listing' => $latest_listing
		];
	 
	}
	
	public function indexView(){
		$meta_data = array(
			'title' => 'Blog',
			'description' => "Blog"
		);
		return view("blog", compact('meta_data'));
	}
	public function blogView($id){
		$post = PostPermalink::find($id);
		return view("blog", compact('post'));
	}
	/**
	 * @param \App\Models\Front\Post $post
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
	 */
	public function detail( Post $post ) {
		// return 'dd';
		$data['post']           = $post;
		$data['related_posts']  = $post->related();
		$data['comments'] 		= PostComment::where('blogId', $post->id)->where('parent', 0)->get();
		 
        return $data;
	}

	/**
	 * @param $slug
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
	 */
	public function searchByCategory($slug){
		$last_featured  = null;
		$latest_listing = Rooms::where('status', 'Listed')->latest()->take(6)->select('name', 'sub_name', 'id')->get();
		$category       = Category::where('slug', $slug)->first();
		
		$featured       = Post::where( 'status', 'Publish' )->where( 'featured', 1 )->latest( 'publish_date' )->take( 6 )->get();
		$posts          = $category->posts->all();

		return  [
			'posts'          => $posts,
			'category'     => $category,
			
		];
	}

	/**
	 * @param $author
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
	 */
	public function searchByAuthor($author){
		$last_featured  = null;
		$latest_listing = Rooms::where('status', 'Listed')->latest()->take(6)->select('name', 'sub_name', 'id')->get();
		$categories     = Category::all();
		$tags           = Tag::all();
		$author         = User::where('id', $author)->first();
		$featured       = Post::where( 'status', 'Publish' )->where( 'featured', 1 )->latest( 'publish_date' )->take( 6 )->get();
		$posts          = $author->posts;

		return [
			'posts'          => $posts,
			'author' 		=> $author
		];
	}

	/**
	 * @param $slug
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
	 */
	public function searchByTag($slug){
		$last_featured  = null;
		$latest_listing = Rooms::where('status', 'Listed')->latest()->take(6)->select('name', 'sub_name', 'id')->get();
		$categories     = Category::all();
		$tags           = Tag::all();
		$tag            = Tag::where('slug', $slug)->first();
		$featured       = Post::where( 'status', 'Publish' )->where( 'featured', 1 )->latest( 'publish_date' )->take( 6 )->get();
		$posts          = $tag->posts;

		return [
			'posts'          => $posts,
			'tag' =>		$tag
		];
	}


	public function getAuthorInfo($author_id){
		return User::with('profile_picture')->where('id', $author_id)->first();
	}


	public function comment(Request $request){
		if (Auth::check()) {
			// The user is logged in...
			$blogId = $request->blogId;
			$comments = $request->comments;
			$comment  = new PostComment;
			$comment->blogId = $blogId;
			$comment->parent = 0;
			$comment->userId = Auth::user()->id;
			$comment->comments = $comments;
			$comment->save();
			return array(
				"status" => "success",
				"message" => "Thank you for your comment!"
			);
		}
		else{
			return array(
				"status" => "error",
				"message" => "Please comments after login!"
			);
		}

	}
	public function commentreply(Request $request){
		if (Auth::check()) {
			// The user is logged in...
			$blogId = $request->blogId;
			$comments = $request->reply;
			$comment  = new PostComment;
			$comment->blogId = $blogId;
			$comment->parent = $request->commentid;
			$comment->userId = Auth::user()->id;
			$comment->comments = $comments;
			$comment->save();
			return array(
				"status" => "success",
				"message" => "Thank you for your comment!"
			);
		}
		else{
			return array(
				"status" => "error",
				"message" => "Please comments after login!"
			);
		}

	}
}

