<footer class="m-site-footer">
  <div class="m-site-footer__inner container">
    <a class="m-site-footer__brand c-wordmark" href="{{ home_url('/') }}">
      <span class="c-wordmark__accent" aria-hidden="true">♪</span>
      <span class="c-wordmark__text">{{ $siteName }}</span>
    </a>

    @if (has_nav_menu('footer_navigation'))
      <nav class="m-site-footer__nav" aria-label="{{ wp_get_nav_menu_name('footer_navigation') }}">
        {!! wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'c-nav c-nav--footer', 'echo' => false]) !!}
      </nav>
    @endif

    <p class="m-site-footer__legal">
      &copy; {{ date_i18n('Y') }} {{ $siteName }} &middot; {{ __('All rights reserved.', 'ra-theme') }}
    </p>
  </div>
</footer>
