<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use App\User;
use Illuminate\Http\Request;
use Mail;
use App\Mail\ForgotPasswordSuccessNotification;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }
	
	public function forgotPassword(Request $request){
        $auth = false;
        //$credentials = $request->only('email', 'password');
		
		$user = User::where('email', $request->email)->count();
    
        if ($user > 0) {
            $auth = true; // Success
        }
        if ($request->ajax()) {
            if($auth){
                
                $user = User::where('email', $request->email)->first();
				$password = $this->randomPassword();
				
				$user->password = bcrypt($password);
                $user->save();
                
                return ['status' => $user];
				
				Mail::to($user->email)->send(new ForgotPasswordSuccessNotification($user, $password));
				//Mail::to('iamirfanwebdeveloper@gmail.com')->send(new ForgotPasswordSuccessNotification($user, $password));
				//$result = array('success' => true, 'status_message' => 'Success',"result" => "Success");
                
				return response()->json([
                    'success' => $auth
                    ]);
            }
            else{
                    // return ['status'=> $request->ajax()];
                return response()->json([
                    'success' => $auth 
                ]);
            }
        } else {
           
        }
        // return redirect(URL::route('login_page'));
    }
	
	private function randomPassword() {
		$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		$pass = array(); //remember to declare $pass as an array
		$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
		for ($i = 0; $i < 8; $i++) {
			$n = rand(0, $alphaLength);
			$pass[] = $alphabet[$n];
		}
		return implode($pass); //turn the array into a string
	}
}
