@extends('layouts/admin')

@section('styles')
@include('admin/common/IntlTelInput_styles')
@endsection

@section('admin-content')  
@include('admin/common/side')

<div class="pcoded-content">
   <div class="pcoded-inner-content">
      <div class="main-body">
         <div class="page-wrapper">
            <div class="page-header">
               <div class="page-header-title">
                  <h4>User Management</h4>
               </div>
               <div class="page-header-breadcrumb">
                  <ul class="breadcrumb-title">
                     <li class="breadcrumb-item">
                        <a href="{{route('admin.dashboard')}}" aria-label="Home">
                        <i class="icofont icofont-home"></i>
                        </a>
                     </li>
                     <li class="breadcrumb-item"><a href="#">Pages</a></li>
                     <li class="breadcrumb-item"><a href="{{route('admin.users')}}">Users</a></li>
                     <li class="breadcrumb-item">Edit</li>
                  </ul>
               </div>
            </div>
            <div class="page-body">
               <div class="row">                 
                  <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header table-card-header">  
                           <div class="row">
                              <div class="col-sm-9 text-left">
                                 <h5>Edit User Form</h5>
                              </div>                          
                              <div class="col-sm-3 text-right">
                                 <span class="text-danger">(*)Fields are Mandatory</span>
                              </div>                          
                           </div>
                        </div>
                        <div class="card-block">
                           <form method="POST" action="{{url('admin/edit_user/' . $user->id)}}" accept-charset="UTF-8" class="form-horizontal bordered" role="form">
                              {{ csrf_field() }}
                              <input type="hidden" value="{{$user->id}}" name="id">
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">First Name<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="text" name="first_name" class="form-control" value="{{$user->first_name}}" aria-label="First Name" required>
                                 </div>
                              </div>
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Last Name<span class="text-danger" >*</span></label>
                                 <div class="col-sm-6">
                                    <input type="text" name="last_name" class="form-control" value="{{$user->last_name}}" aria-label="Last Name" required>
                                 </div>
                              </div>                            
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Email<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="email" name="email" class="form-control" value="{{$user->email}}" aria-label="Email" required>
                                 </div>
                              </div>
                              <div class="form-group row input-group">
                                 <label class="col-sm-3 col-form-label text-right">Phone Number<span class="text-danger">*</span></label>
                                 <div class="col-sm-6"  style="padding-left: 23px;">
                                    <input type="tel" id="phonenumber" name="phone_number" class="form-control" value="{{$user->getPhoneNumberByUserID()}}" aria-label="Phone Number" required>
                                 </div>
                              </div>
                              
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Password<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="password" name="password" id="password" class="form-control" value="" aria-label="Password">
                                 </div>
                              </div>
                              
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Confirm Password<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="password" name="confirm_password" id="confirm_password" class="form-control" value="" aria-label="Confirm Password">
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">D.O.B</label>
                                 <div class="col-sm-6">
                                    <input type="date" name="dob" class="form-control" value="{{$user->dob}}" aria-label="D.O.B">
                                 </div>
                              </div>
                              
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Gender<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <select name="gender" class="form-control form-control-default" aria-label="Gender" required>
                                       <option>Gender</option>
                                       <option value="Male" <?php echo $user->gender=="Male"?"selected":"";  ?>>Male</option>                                            
                                       <option value="Female" <?php echo $user->gender=="Female"?"selected":"";  ?>>Female</option>                                            
                                       <option value="Other" <?php echo $user->gender=="Other"?"selected":"";  ?>>Other</option>                                            
                                    </select>
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Where You Live</label>
                                 <div class="col-sm-6">
                                    <input type="text" name="live" class="form-control" value="{{$user->live}}" placeholder="e.g. Paris, FR/Brooklyn, NY/Chicago, IL" aria-label="Where You Live" >
                                 </div>
                              </div>     

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Describe Yourself</label>
                                 <div class="col-sm-6">
                                    <textarea type="text" name="about" class="form-control" aria-label="Describe Yourself">{{$user->about}}</textarea>
                                 </div>
                              </div>     

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Status<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <select name="status" class="form-control form-control-default" aria-label="Status" required>
                                       <option>Select</option>
                                       <option value="Active" <?php echo $user->status=="Active"?"selected":"";  ?>>Active</option>                                            
                                       <option value="Inactive" <?php echo $user->status=="Inactive"?"selected":"";  ?>>Inactive</option> 
                                    </select>
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Property Manager<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <select name="property_manager" class="form-control form-control-default" aria-label="Property Manager" required>
                                       <option>Select</option>
                                       <option value="Yes"  <?php echo $user->property_manager=="Yes"?"selected":"";  ?>>Yes</option>                                            
                                       <option value="No" <?php echo $user->property_manager=="No"?"selected":"";  ?>>No</option> 
                                    </select>
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Website</label>
                                 <div class="col-sm-6">
                                    <input type="text" name="website" class="form-control" value="{{$user->website}}" aria-label="Website">
                                 </div>
                              </div>     

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">School</label>
                                 <div class="col-sm-6">
                                    <input type="text" name="school" class="form-control" value="{{$user->school}}" aria-label="School">
                                 </div>
                              </div>     

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Work</label>
                                 <div class="col-sm-6">
                                    <input type="text" name="work" class="form-control" value="{{$user->work}}" aria-label="Work" >
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Timezone</label>
                                 <div class="col-sm-6">
                                    <select name="timezone" class="form-control form-control-default" aria-label="Timezone">
                                       <option>Select Timezone</option>
                                       @if(count($timezones) != 0)
                                          @foreach($timezones as $row)
                                             <option value="{{$row->value}}" <?php echo $row->value == $user->timezone?"selected":"";  ?>>{{$row->name}}</option>
                                          @endforeach
                                       @endif
                                    </select>
                                 </div>
                              </div>
                              
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Langusges</label>
                                 <div class="col-sm-9 row">                                          
                                    @foreach($languages as $item)                                        
                                       <div class="border-checkbox-group border-checkbox-group-primary col-sm-3">
                                          <input class="border-checkbox" type="checkbox" name="language[]" <?php echo strpos($user->languages, (string)$item->id)===false?"":"checked"; ?> value="{{ $item->id }}" aria-label="Langusges">
                                          <label class="border-checkbox-label" for="checkbox1">{{$item->name}}</label>
                                       </div>
                                    @endforeach
                                 </div>
                              </div>

                              <div class="form-group row">
                                 <div class="col-sm-12 text-center">
                                    <button type="button" id="createuserbtn" class="btn btn-info btn-round">Submit</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <a href="{{route('admin.admin.users')}}" class="btn btn-default btn-round">Cancel</a>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div id="styleSelector"></div>
         </div>
      </div>
   </div>
</div>

@section('scripts')
@include('admin/common/IntlTelInput_scripts')
<script>
   $("#phonenumber").intlTelInput({
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js"
   });

   $(document).on('click', '#createuserbtn', function(){
      if($('#password').val() == $('#confirm_password').val()){
            $('form').submit();
      }else{
            alert("Must be matched password and confirm password!");
      }
   });
</script>
@endsection

@endsection