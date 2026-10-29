<input type="checkbox" id="nav-toggle" class="c-nav-toggle__checkbox js-ra-nav-toggle" autocomplete="off" />
<div class="m-header__plate m-header__plate--brand">
  <a class="c-wordmark" href="{{ home_url('/') }}">
    <span class="c-wordmark__accent" aria-hidden="true">♪</span>
    <span class="c-wordmark__text">{{ $siteName }}</span>
  </a>

  <label for="nav-toggle" class="m-header__toggle">
    <span class="m-header__toggle-label" aria-hidden="true"></span>
    <span class="c-nav-toggle" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="u-visually-hidden">{{ __('Toggle menu', 'ra-theme') }}</span>
  </label>
</div>

@php($ctaText = trim(\App\Customizer\HeaderFooter::value('ra_cta_text')))
@php($ctaUrl = trim(\App\Customizer\HeaderFooter::value('ra_cta_url')))
@if ($ctaText !== '' && $ctaUrl !== '')
  <a class="m-header__plate m-header__plate--cta" href="{{ esc_url($ctaUrl) }}">{{ esc_html($ctaText) }}</a>
@endif

<div class="m-menu-overlay">
  <div class="m-menu-overlay__card m-menu-overlay__card--explore">
    <p class="m-menu-overlay__eyebrow">{{ __('Explore', 'ra-theme') }}</p>
    <hr class="m-menu-overlay__rule" />

    @if (has_nav_menu('primary_navigation'))
      <nav aria-label="{{ wp_get_nav_menu_name('primary_navigation') }}">
        {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'c-menu-links', 'echo' => false]) !!}
      </nav>
    @endif
  </div>

  <div class="m-menu-overlay__card m-menu-overlay__card--enquire">
    <p class="m-menu-overlay__eyebrow">{{ $ctaText !== '' ? $ctaText : __('Enquire', 'ra-theme') }}</p>
    <hr class="m-menu-overlay__rule" />

    @php($email = trim(\App\Customizer\HeaderFooter::value('ra_footer_email')))
    @php($phone = trim(\App\Customizer\HeaderFooter::value('ra_footer_phone')))
    <ul class="m-menu-overlay__contact">
      @if ($email !== '')
        <li><a href="mailto:{{ esc_attr($email) }}">{{ esc_html($email) }}</a></li>
      @endif
      @if ($phone !== '')
        <li><a href="tel:{{ esc_attr(preg_replace('/[^0-9+]/', '', $phone)) }}">{{ esc_html($phone) }}</a></li>
      @endif
    </ul>

    @if ($ctaText !== '' && $ctaUrl !== '')
      <a class="btn btn-primary" href="{{ esc_url($ctaUrl) }}">{{ esc_html($ctaText) }}</a>
    @endif
  </div>
</div>
