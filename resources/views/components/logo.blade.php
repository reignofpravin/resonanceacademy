@props(['class' => ''])

@php
    $siteName = get_bloginfo('name', 'display');
    $mark = Vite::asset('resources/images/emblem.png');
@endphp

<a class="c-logo {{ $class }}" href="{{ home_url('/') }}" aria-label="{{ $siteName }} — {{ __('home', 'ra-theme') }}">
    <img class="c-logo__mark" src="{{ $mark }}" alt="" width="256" height="256" decoding="async">

    <span class="c-logo__lockup">
        <span class="c-logo__name">Resonance</span>
        <span class="c-logo__sub">{{ __('Music Academy', 'ra-theme') }}</span>
    </span>
</a>
