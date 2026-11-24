<article @php(post_class('m-entry__result'))>
  <header class="m-entry__result-head">
    <h2 class="m-entry__result-title entry-title">
      <a href="{{ get_permalink() }}">
        {!! $title !!}
      </a>
    </h2>

    @includeWhen(get_post_type() === 'post', 'partials.entry-meta')
  </header>

  <div class="m-entry__result-summary entry-summary">
    @php(the_excerpt())
  </div>
</article>
