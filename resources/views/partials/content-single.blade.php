<article @php(post_class('m-entry__article h-entry'))>
  <header class="m-entry__head">
    <h1 class="m-entry__title p-name">
      {!! $title !!}
    </h1>

    @include('partials.entry-meta')
  </header>

  <div class="m-entry__body e-content">
    @php(the_content())
  </div>

  @if ($pagination())
    <nav class="m-entry__pagination" aria-label="{{ __('Page', 'ra-theme') }}">
      {!! $pagination !!}
    </nav>
  @endif

  @php(comments_template())
</article>
