@php
  $tagline = trim(\App\Customizer\HeaderFooter::value('ra_footer_tagline'));
  $email = trim(\App\Customizer\HeaderFooter::value('ra_footer_email'));
  $phone = trim(\App\Customizer\HeaderFooter::value('ra_footer_phone'));
  $address = \App\Customizer\HeaderFooter::lines('ra_footer_address');
  $hours = \App\Customizer\HeaderFooter::lines('ra_footer_hours');
  $socials = \App\Customizer\HeaderFooter::socials();
@endphp
<footer class="m-site-footer">
  <div class="m-site-footer__inner container">
    <div class="m-site-footer__brand-block">
      <a class="m-site-footer__brand c-wordmark" href="{{ home_url('/') }}">
        <span class="c-wordmark__accent" aria-hidden="true">♪</span>
        <span class="c-wordmark__text">{{ $siteName }}</span>
      </a>

      @if ($tagline !== '')
        <p class="m-site-footer__tagline">{{ esc_html($tagline) }}</p>
      @endif

      @if ($socials !== [])
        <ul class="m-site-footer__social" aria-label="{{ __('Social media', 'ra-theme') }}">
          @foreach ($socials as $network => $url)
            <li>
              <a href="{{ esc_url($url) }}">
                <x-icon icon="note" />
                <span>{{ esc_html(ucfirst($network)) }}</span>
              </a>
            </li>
          @endforeach
        </ul>
      @endif
    </div>

    @if (has_nav_menu('footer_navigation'))
      <nav class="m-site-footer__nav" aria-label="{{ wp_get_nav_menu_name('footer_navigation') }}">
        <h2 class="m-site-footer__heading">{{ __('Explore', 'ra-theme') }}</h2>
        {!! wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'c-nav c-nav--footer', 'echo' => false]) !!}
      </nav>
    @endif

    @if ($email !== '' || $phone !== '' || $address !== [] || $hours !== [])
      <div class="m-site-footer__visit">
        <h2 class="m-site-footer__heading">{{ __('Visit', 'ra-theme') }}</h2>
        <ul class="m-site-footer__contact">
          @if ($email !== '')
            <li>
              <a class="m-site-footer__contact-link" href="mailto:{{ esc_attr($email) }}">{{ esc_html($email) }}</a>
            </li>
          @endif
          @if ($phone !== '')
            <li>
              <a class="m-site-footer__contact-link" href="tel:{{ esc_attr(preg_replace('/[^0-9+]/', '', $phone)) }}">{{ esc_html($phone) }}</a>
            </li>
          @endif
          @foreach ($address as $line)
            <li><span class="m-site-footer__contact-line">{{ esc_html($line) }}</span></li>
          @endforeach
        </ul>

        @if ($hours !== [])
          <h2 class="m-site-footer__heading">{{ __('Hours', 'ra-theme') }}</h2>
          <ul class="m-site-footer__hours">
            @foreach ($hours as $line)
              <li><span class="m-site-footer__contact-line">{{ esc_html($line) }}</span></li>
            @endforeach
          </ul>
        @endif
      </div>
    @endif

    <div class="m-site-footer__bottom">
      <p class="m-site-footer__legal">
        &copy; {{ date_i18n('Y') }} {{ $siteName }} &middot; {{ __('All rights reserved.', 'ra-theme') }}
      </p>

      <p class="m-site-footer__signoff">
        <x-icon icon="note" />
        <span>{{ __('Let the music move you.', 'ra-theme') }}</span>
      </p>

      <!-- <button type="button" class="c-bird-sound c-bird-sound--inline js-ra-sound" aria-pressed="false">
        <span aria-hidden="true">&#9834;</span>
      </button> -->
    </div>
  </div>
</footer>
