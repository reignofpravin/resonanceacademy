@extends('layouts.app')

@php
    // Dedicated course catalog: every published course, instantly filterable.
    // Taxonomy/meta data prep lives in the CourseCatalog composer; the view
    // stays markup-only.
    $catalog = \App\View\Composers\CourseCatalog::collect();
@endphp

@section('content')
    <section class="m-catalog" data-ra-catalog>
        <div class="m-catalog__head">
            <div class="container">
                <svg class="m-catalog__head-wave" viewBox="0 0 260 140" aria-hidden="true" focusable="false">
                    <g fill="currentColor">
                        <rect x="6" y="114" width="10" height="26" rx="5" opacity="0.5" />
                        <rect x="24" y="92" width="10" height="48" rx="5" opacity="0.5" />
                        <rect x="42" y="104" width="10" height="36" rx="5" opacity="0.5" />
                        <rect x="60" y="70" width="10" height="70" rx="5" opacity="0.5" />
                        <rect x="78" y="88" width="10" height="52" rx="5" opacity="0.5" />
                        <rect x="96" y="48" width="10" height="92" rx="5" opacity="0.5" />
                        <rect x="114" y="74" width="10" height="66" rx="5" opacity="0.5" />
                        <rect x="132" y="24" width="10" height="116" rx="5" opacity="0.7" />
                        <rect x="150" y="60" width="10" height="80" rx="5" opacity="0.5" />
                        <rect x="168" y="8" width="10" height="132" rx="5" opacity="0.95" />
                        <rect x="186" y="44" width="10" height="96" rx="5" opacity="0.5" />
                        <rect x="204" y="82" width="10" height="58" rx="5" opacity="0.5" />
                        <rect x="222" y="56" width="10" height="84" rx="5" opacity="0.5" />
                        <rect x="240" y="102" width="10" height="38" rx="5" opacity="0.5" />
                    </g>
                </svg>

                <p class="c-kicker" data-ra-reveal>{{ __('All courses', 'ra-theme') }}</p>
                <h1 class="m-catalog__title" data-ra-reveal>{{ __('Find your track.', 'ra-theme') }}</h1>
                <p class="m-catalog__standfirst" data-ra-reveal data-ra-reveal-delay="0.15">
                    {{ __('Every course, filtered the way you study — pick a track, a level and the pathway you are aiming at.', 'ra-theme') }}
                </p>

                <div class="m-catalog__ticker" aria-hidden="true">
                    <span class="m-catalog__ticker-track" data-ra-marquee data-ra-marquee-duration="38">
                        {{ __('Choose your track ✦ Beginner to Advanced ✦ Six faculties ✦ Trinity affiliated degree pathways ✦ 22 ways in ✦ ', 'ra-theme') }}
                    </span>
                </div>
            </div>
        </div>

        {{-- One opaque band pinned under the header: nothing scrolls through
             the gaps between the header plates, and the facet panel grows
             inside the band instead of floating over the list. --}}
        <div class="m-catalog__bar" data-ra-catalog-bar>
            <div class="m-catalog__bar-inner container">
                <div class="m-catalog__toolbar">
                    <button
                        type="button"
                        class="m-catalog__toggle js-catalog-toggle"
                        aria-expanded="false"
                        aria-controls="catalog-groups"
                    >
                        {{ __('Filters', 'ra-theme') }}
                        <span class="m-catalog__toggle-count js-catalog-filter-count" hidden></span>
                        <svg class="m-catalog__toggle-icon" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
                            <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <input
                        type="search"
                        class="m-catalog__search js-catalog-search"
                        value="{{ $catalog['state']['q'] }}"
                        placeholder="{{ __('Search courses…', 'ra-theme') }}"
                        aria-label="{{ __('Search courses', 'ra-theme') }}"
                    >

                    <div class="m-catalog__status">
                        <p class="m-catalog__count js-catalog-count" aria-live="polite">
                            <strong data-ra-catalog-count>{{ $catalog['total'] }}</strong>
                            {{ __('courses', 'ra-theme') }}
                        </p>

                        <button type="button" class="m-catalog__clear js-catalog-clear" data-ra-active="false">
                            {{ __('Clear', 'ra-theme') }}
                        </button>
                    </div>
                </div>

                <div class="m-catalog__groups" id="catalog-groups">
                    @foreach ($catalog['groups'] as $group)
                        <div class="m-catalog__group">
                            <span class="m-catalog__group-label" id="catalog-group-{{ $group['key'] }}">{{ $group['label'] }}</span>

                            <div class="m-catalog__options" role="group" aria-labelledby="catalog-group-{{ $group['key'] }}">
                                <button
                                    type="button"
                                    class="m-catalog__chip {{ $catalog['state'][$group['key']] === '' ? 'is-active' : '' }}"
                                    data-ra-filter="{{ $group['key'] }}"
                                    data-ra-value="all"
                                    aria-pressed="{{ $catalog['state'][$group['key']] === '' ? 'true' : 'false' }}"
                                >
                                    {{ __('All', 'ra-theme') }}
                                </button>

                                @foreach ($group['options'] as $option)
                                    <button
                                        type="button"
                                        class="m-catalog__chip {{ $catalog['state'][$group['key']] === $option['value'] ? 'is-active' : '' }}"
                                        data-ra-filter="{{ $group['key'] }}"
                                        data-ra-value="{{ $option['value'] }}"
                                        aria-pressed="{{ $catalog['state'][$group['key']] === $option['value'] ? 'true' : 'false' }}"
                                    >
                                        {{ $option['label'] }} <em class="m-catalog__chip-count">{{ $option['count'] }}</em>
                                    </button>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="container">
            <div class="m-catalog__list" data-ra-catalog-list>
                @foreach ($catalog['rows'] as $row)
                    @php
                        $artTrack = trim(explode(',', $row['track'])[0] ?? '') ?: 'general';
                        $firstTrack = $row['trackNames'] ? trim(explode(', ', $row['trackNames'])[0]) : '';
                    @endphp
                    <article
                        class="m-catalog__card"
                        data-ra-row
                        data-track="{{ $row['track'] }}"
                        data-level="{{ $row['level'] }}"
                        data-path="{{ $row['path'] }}"
                        data-search="{{ $row['search'] }}"
                        data-art="{{ $artTrack }}"
                        @if (!empty($row['levelName']))
                            data-level-name="{{ $row['levelName'] }}"
                        @endif
                    >
                        <a class="m-catalog__card-media" href="{{ $row['url'] }}" tabindex="-1" aria-hidden="true">
                            <span class="m-catalog__card-art"></span>

                            @if ($firstTrack)
                                <span class="m-catalog__card-track">{{ $firstTrack }}</span>
                            @endif
                        </a>

                        <div class="m-catalog__card-body">
                            <p class="m-catalog__meta">
                                @if ($row['levelName'])
                                    <span>{{ $row['levelName'] }}</span>
                                @endif

                                @if ($row['duration'])
                                    <span>{{ $row['duration'] }}</span>
                                @endif

                                @if ($row['format'] !== 'group')
                                    <span>{{ ucfirst($row['format']) }}</span>
                                @endif
                            </p>

                            <h2 class="m-catalog__card-title">
                                <a href="{{ $row['url'] }}">{{ $row['title'] }}</a>
                            </h2>

                            @if ($row['excerpt'])
                                <p class="m-catalog__card-excerpt">{{ $row['excerpt'] }}</p>
                            @endif

                            <a class="m-catalog__card-cta" href="{{ $row['url'] }}" tabindex="-1" aria-hidden="true">
                                {{ __('View course', 'ra-theme') }}
                                <svg viewBox="0 0 14 10" aria-hidden="true" focusable="false">
                                    <path d="M1 5h11M8.5 1.5 12 5 8.5 8.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </article>
                @endforeach
            </div>

            <div class="m-catalog__empty" data-ra-empty hidden>
                <p>{{ __('Nothing settles at that combination yet — try loosening a filter.', 'ra-theme') }}</p>
            </div>

            <noscript>
                <p class="m-catalog__noscript">
                    {{ __('Filters need JavaScript; without it, the full course list above stays browsable and every course is one click away.', 'ra-theme') }}
                </p>
            </noscript>
        </div>
    </section>
@endsection
