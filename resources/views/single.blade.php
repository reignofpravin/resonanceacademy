@extends('layouts.app')

@section('content')
  <section class="m-entry">
    <div class="container">
      <div class="m-entry__inner">
        @while (have_posts()) @php(the_post())
          @includeFirst(['partials.content-single-' . get_post_type(), 'partials.content-single'])
        @endwhile
      </div>
    </div>
  </section>
@endsection
