@extends('layouts/admin')

@section('styles')
@include('admin/common/dropify_styles')
@endsection

@section('admin-content')
@include('admin/common/side')
<div class="pcoded-content">
   <div class="pcoded-inner-content">
      <div class="main-body">
         <div class="page-wrapper">
            <div class="page-header">
               <div class="page-header-title">
                    <h4>Our Communities Manage</h4>
               </div>
               <div class="page-header-breadcrumb">
                  <ul class="breadcrumb-title">
                     <li class="breadcrumb-item">
                        <a href="{{route('admin.dashboard')}}" aria-label="Home">
                        <i class="icofont icofont-home"></i>
                        </a>
                     </li>
                     <li class="breadcrumb-item"><a href="#">Pages</a></li>
                     <li class="breadcrumb-item"><a href="{{route('admin.our_community_banners')}}">Our Communities</a></li>
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
                                 <h5>Edit Our Community Form</h5>
                              </div>                          
                              <div class="col-sm-3 text-right">
                                 <span class="text-danger">(*)Fields are Mandatory</span>
                              </div>                          
                           </div> 
                        </div>
                        <div class="card-block">
                           <form method="POST" action="{{url('admin/edit_our_community_banners/'.$cbanner->id)}}" enctype="multipart/form-data"  accept-charset="UTF-8" class="form-horizontal bordered" role="form">
                              {{ csrf_field() }}
                              <input type="hidden" value="{{$cbanner->id}}" name="id">
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Title<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="text" name="title" class="form-control" value="{{$cbanner->title}}" placeholder="Title" aria-label="Title" required>
                                 </div>
                              </div>
                                             
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Description<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <textarea  name="description" class="form-control"  placeholder="Description" aria-label="Description" required>{{$cbanner->description}}</textarea>
                                 </div>
                              </div>
                                             
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Link<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="text" name="link" value="{{$cbanner->link}}" class="form-control" placeholder="Link..." aria-label="Link" required>
                                 </div>
                              </div>
                                             
                              <div class="form-group row">
                                 <label class="col-sm-3 col-form-label text-right">Image<span class="text-danger">*</span></label>
                                 <div class="col-sm-6">
                                    <input type="file" name="image" id="input-file-now1" class="dropify required" alt="Image" data-default-file="{{asset("images/our_community_banners/$cbanner->image")}}"/>                                      
                                    <input type="hidden" value="{{$cbanner->image}}" name="orginalimage">
                                 </div>
                              </div>                    
                              
                              <div class="form-group row">
                                 <div class="col-sm-12 text-center">
                                    <button type="submit" id="createuserbtn" class="btn btn-info btn-round">Submit</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <a href="{{route('admin.our_community_banners')}}" class="btn btn-default btn-round">Cancel</a>
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
@include('admin/common/dropify_scripts')
<script>
    $('.dropify').dropify();
</script>
@endsection

@endsection