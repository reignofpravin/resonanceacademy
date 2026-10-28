@props(['icon' => 'note'])

@switch ($icon)
    @case ('treble')
        <svg {{ $attributes->merge(['class' => 'c-icon c-icon--treble', 'width' => '28', 'height' => '96', 'viewBox' => '0 0 28 96', 'fill' => 'none', 'aria-hidden' => 'true']) }}>
            <path d="M14 4c-6 0-9.5 4.4-9.5 9.4 0 6.9 5.9 10.4 5.9 17.3 0 10-9.4 13.8-9.4 29.2C1 76.6 12 84 15.6 92.6c1-21.2-1.4-34.7-1.4-47.2 0-6.6-6.1-9.7-6.1-16.5 0-4.4 3-7 6.5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1" data-ra-path></path>
            <circle cx="17.5" cy="66" r="4.5" stroke="currentColor" stroke-width="2"></circle>
            <circle cx="17.5" cy="80" r="4.5" stroke="currentColor" stroke-width="2"></circle>
        </svg>
        @break

    @case ('note')
        <svg {{ $attributes->merge(['class' => 'c-icon c-icon--note', 'width' => '20', 'height' => '28', 'viewBox' => '0 0 20 28', 'fill' => 'none', 'aria-hidden' => 'true']) }}>
            <path d="M8 21V2l10-2v18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
            <circle cx="5.5" cy="21.5" r="3.5" fill="currentColor"></circle>
            <circle cx="15.5" cy="18.5" r="3.5" fill="currentColor"></circle>
        </svg>
        @break

    @case ('equalizer')
        <svg {{ $attributes->merge(['class' => 'c-icon c-icon--equalizer', 'width' => '26', 'height' => '20', 'viewBox' => '0 0 26 20', 'fill' => 'none', 'aria-hidden' => 'true']) }}>
            <rect x="0.5" y="7" width="3" height="13" rx="1.5" fill="currentColor"></rect>
            <rect x="7.5" y="0" width="3" height="20" rx="1.5" fill="currentColor"></rect>
            <rect x="14.5" y="4" width="3" height="16" rx="1.5" fill="currentColor"></rect>
            <rect x="21.5" y="9" width="3" height="11" rx="1.5" fill="currentColor"></rect>
        </svg>
        @break

    @default
        <span class="c-icon c-icon--missing">♪</span>
@endswitch
