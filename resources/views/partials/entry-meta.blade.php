<div class="c-entry-meta">
  <time class="c-entry-meta__item" datetime="{{ get_post_time('c', true) }}">
    {{ get_the_date() }}
  </time>

  <span class="c-entry-meta__item">
    {{ __('By', 'ra-theme') }}
    <a href="{{ get_author_posts_url(get_the_author_meta('ID')) }}" class="c-entry-meta__author p-author h-card">
      {{ get_the_author() }}
    </a>
  </span>
</div>
