@props(['class' => ''])

@php
    $logoId = (int) get_theme_mod('custom_logo');
    $siteName = get_bloginfo('name', 'display');
    $logoAlt = $logoId ? trim((string) get_post_meta($logoId, '_wp_attachment_image_alt', true)) : '';
    $logoAlt = $logoAlt !== '' ? $logoAlt : $siteName;
@endphp

@if ($logoId)
    <a class="c-site-logo {{ $class }}" href="{{ home_url('/') }}">
        {!! wp_get_attachment_image($logoId, 'medium', false, ['class' => 'c-site-logo__img', 'alt' => $logoAlt]) !!}
    </a>
@else
    <a class="c-wordmark {{ $class }}" href="{{ home_url('/') }}">
        <span class="c-wordmark__accent" aria-hidden="true">♪</span>
        <span class="c-wordmark__text">{{ $siteName }}</span>
    </a>
@endif
