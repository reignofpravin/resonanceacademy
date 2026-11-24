@extends('layouts.app')

@section('content')
  <section class="m-entry">
    <div class="container">
      <div class="m-entry__inner">
        @include('partials.page-header')

        @if (! have_posts())
          <div class="m-entry__empty">
            <x-alert type="warning">
              {!! __('Sorry, but the page you are trying to view does not exist.', 'ra-theme') !!}
            </x-alert>

            {!! get_search_form(false) !!}
          </div>
        @endif
      </div>
    </div>
  </section>
@endsection
