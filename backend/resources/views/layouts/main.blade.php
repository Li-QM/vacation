<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        @include('common.noindex')
        @include('common.head')
    </head>
    <body>
        @include('common.header')
        @yield('content')
        @include('common.footer')
    </body>
</html>