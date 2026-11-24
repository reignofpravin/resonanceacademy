@extends('layouts.app')

@section('content')
  <section class="m-entry">
    <div class="container">
      <div class="m-entry__inner">
        @include('partials.page-header')

        @if (! have_posts())
          <div class="m-entry__empty">
            <x-alert type="warning">
              {!! __('Sorry, no results were found.', 'ra-theme') !!}
            </x-alert>

            {!! get_search_form(false) !!}
          </div>
        @else
          <div class="m-entry__results">
            @while (have_posts()) @php(the_post())
              @include('partials.content-search')
            @endwhile
          </div>

          @php($navigation = get_the_posts_navigation())
          @if ($navigation)
            <nav class="m-entry__pagination" aria-label="{{ __('Posts', 'ra-theme') }}">
              {!! $navigation !!}
            </nav>
          @endif
        @endif
      </div>
    </div>
  </section>
@endsection
