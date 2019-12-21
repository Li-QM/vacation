<?php

namespace App\Models\admin;
use Illuminate\Database\Eloquent\Model;
use DB;
use Devio\Permalink\Contracts\Permalinkable;
use Devio\Permalink\HasPermalinks;
class Post extends Model implements Permalinkable {
	use HasPermalinks;
	public $managePermalinks = true;
	
	protected $table = 'posts';
	public function permalinkAction() {
		// dd('ddd');
	 
		return PostController::class . '@show';
	}

	/**
	 * Get the options for the sluggable package.
	 *
	 * @return array
	 */
	public function slugSource(): array {
		return [ 'source' => 'permalinkable.title' ];
	}
}
