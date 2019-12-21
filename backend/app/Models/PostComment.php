<?php

namespace App\Models;
use App\Models\Front\User;
use Illuminate\Database\Eloquent\Model;

class PostComment extends Model
{
    protected $appends = ['comment_profile_image', 'comment_profile_name', 'child_comments'];
    public function getUser(){
        return User::find($this->userId);
    }
    public function getCommentProfileImageAttribute(){
        return User::find($this->attributes["userId"])->profile_picture->src;
    }
    public function getCommentProfileNameAttribute(){
        return User::find($this->attributes["userId"])->full_name;
    }

    public function getChildCommentsAttribute(){
        return self::where('parent', $this->attributes['id'])->get();
    }
}
