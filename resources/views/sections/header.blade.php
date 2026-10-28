<header class="m-header" data-header>
  <div class="m-header__inner container">
    <a class="m-header__brand c-wordmark" href="{{ home_url('/') }}">
      <span class="c-wordmark__accent" aria-hidden="true">♪</span>
      <span class="c-wordmark__text">{{ $siteName }}</span>
    </a>

    <input type="checkbox" id="nav-toggle" class="c-nav-toggle__checkbox js-ra-nav-toggle" autocomplete="off" />
    <label for="nav-toggle" class="c-nav-toggle" aria-hidden="true">
      <span class="c-nav-toggle__line"></span>
      <span class="c-nav-toggle__line"></span>
      <span class="c-nav-toggle__line"></span>
    </label>

    @if (has_nav_menu('primary_navigation'))
      <nav class="m-header__nav" aria-label="{{ wp_get_nav_menu_name('primary_navigation') }}">
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'c-nav', 'echo' => false]) !!}
      </nav>
    @endif
  </div>
</header>
