 @extends('template')

@section('main')

<main id="site-content" role="main">
      
<div class="page-container-responsive">
  <div class="row row-space-top-8 row-space-8">
    <div class="col-md-12 text-center">
      <h1 class="text-jumbo text-ginormous hide-sm">{{ trans('messages.errors.connection') }}!</h1>
      <h2>{{ trans('messages.errors.date') }}</h2>
    </div>
  </div>
</div>

    </main>

@stop