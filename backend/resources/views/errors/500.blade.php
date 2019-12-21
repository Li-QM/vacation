<!DOCTYPE html>
<!-- saved from url=(0042){{URL::to('/')}}/signup_login?sm=4 -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <title>500 {{ trans('messages.errors.internal_server_error') }} - {{ @$site_name }}</title>

  {!! Html::style('dist/client/css/business/common/common.min.css') !!}

  <link rel="shortcut icon" type="image/x-icon" href="#">

  <!-- Replace by loading from stylesheet -->
  <style type="text/css">
    .text-ginormous {
      font-size: 145px;
    }

    .navbar .container.fixed-height {
      height: 46px;
    }

    .brand.makent.center {
      float: none;
      margin: 7px auto 0 auto;
    }
  </style>
</head>

<body>

  <div id="header" class="navbar navbar-top">
    <div class="navbar-inner">
      <div class="fixed-height container container-full-width page-container page-container-responsive navbar-container">
        <a href="{{URL::to('/')}}/" class="brand makent center">{{ @$site_name }}</a>
      </div>
    </div>
  </div>

  <div class="page-container page-container-responsive">
    <div class="row row-space-top-8 row-space-8">
      <div class="col-5 col-offset-1">
        <h1 class="text-jumbo text-ginormous">{{ trans('messages.errors.shoot') }}!</h1>
        <h2>{{ trans('messages.errors.this_unexpected') }}…</h2>
        <h6>{{ trans('messages.errors.error_code') }}: 500</h6>
        <p>{{ trans('messages.errors.500_desc1') }}</p>

        <p>{{ trans('messages.errors.500_desc2') }}!</p>

      </div>
    </div>
  </div>

<div id="cboxOverlay" style="display: none;"></div><div id="colorbox" class="cboxIE" style="display: none;"><div id="cboxWrapper"><div><div id="cboxTopLeft" style="float: left;"></div><div id="cboxTopCenter" style="float: left;"></div><div id="cboxTopRight" style="float: left;"></div></div><div style="clear: left;"><div id="cboxMiddleLeft" style="float: left;"></div><div id="cboxContent" style="float: left;"><div id="cboxLoadedContent" style="width: 0px; height: 0px; overflow: hidden; float: left;"></div><div id="cboxLoadingOverlay" style="float: left;"></div><div id="cboxLoadingGraphic" style="float: left;"></div><div id="cboxTitle" style="float: left;"></div><div id="cboxCurrent" style="float: left;"></div><div id="cboxNext" style="float: left;"></div><div id="cboxPrevious" style="float: left;"></div><div id="cboxSlideshow" style="float: left;"></div><div id="cboxClose" style="float: left;"></div></div><div id="cboxMiddleRight" style="float: left;"></div></div><div style="clear: left;"><div id="cboxBottomLeft" style="float: left;"></div><div id="cboxBottomCenter" style="float: left;"></div><div id="cboxBottomRight" style="float: left;"></div></div></div><div style="position: absolute; width: 9999px; visibility: hidden; display: none;"></div></div></body></html>