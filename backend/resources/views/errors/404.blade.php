<!--
Author: W3layouts
Author URL: http://w3layouts.com
License: Creative Commons Attribution 3.0 Unported
License URL: http://creativecommons.org/licenses/by/3.0/
-->
<!DOCTYPE html>
<html>
<head>
  <title> Error Page </title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

  @include('common.noindex')
  
  <meta name="keywords" content="Smooth Error Page template Responsive, Login form web template,Flat Pricing tables,Flat Drop downs  Sign up Web Templates, Flat Web forms, Login sign up Responsive web Forms, SmartPhone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design" />
  <script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
  <!-- Custom Theme files -->
  <link href="{{asset('errors/css/style.css')}}" rel="stylesheet" type="text/css" media="all" />
  <!-- //Custom Theme files -->
  <!-- web font -->
  <link href="//fonts.googleapis.com/css?family=Josefin+Sans" rel="stylesheet">
  <link href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
  <!-- //web font -->

  <style>
    #site-content {
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      min-height: 100vh;
      color: #fff;
    }


    a {
      color: white;
      margin: 5px;
    }

    a:hover {
      color: tomato;

    }

  </style>
</head>
<body>
<!--mian-content-->
{{--<h1>Error Page</h1>--}}
  {{--<h2>404</h2>--}}
  {{--<p><span class="sub-agileinfo">Sorry! </span>The page you requested was not found!....</p>--}}

  <main id="site-content" role="main">

      <div class="row row-space-top-8 row-space-8">
        <div class="col-md-12 text-center">
          <h1 class="text-jumbo text-ginormous hide-sm">{{ trans('messages.errors.oops') }}!</h1>
          <!-- <h1 class="text-jumbo text-ginormous hide-sm">Coming Soon!</h1> -->
          <h2>{{ trans('messages.errors.404_desc') }}</h2>
          <!-- <h2>We are working on this page, will update it soon.</h2> -->
          <h6>{{ trans('messages.errors.error_code') }}: 404</h6>
          <ul class="list-unstyled">
            <li>{{ trans('messages.errors.helpful_links') }}:</li>
            <li><a href="{{URL::to('/')}}/">{{ trans('messages.header.home') }}</a></li>
            <li><a href="{{URL::to('/')}}/dashboard">{{ trans('messages.header.dashboard') }}</a></li>
          </ul>
        </div>
      </div>

  </main>
<!--//mian-content-->
<!-- copyright -->


<!-- //copyright -->

</body>
</html>