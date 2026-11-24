@extends('layouts.app')

@section('content')
  @if (is_front_page())
    @while (have_posts()) @php(the_post())
      @include('partials.content-page')
    @endwhile
  @else
    <section class="m-entry">
      <div class="container">
        <div class="m-entry__inner">
          @while (have_posts()) @php(the_post())
            @include('partials.page-header')
            @includeFirst(['partials.content-page', 'partials.content'])
          @endwhile
        </div>
      </div>
    </section>
  @endif
@endsection
