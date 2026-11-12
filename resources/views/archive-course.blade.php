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
                    <article
                        class="m-catalog__row"
                        data-ra-row
                        data-track="{{ $row['track'] }}"
                        data-level="{{ $row['level'] }}"
                        data-path="{{ $row['path'] }}"
                        data-search="{{ $row['search'] }}"
                        @if (!empty($row['levelName']))
                            data-level-name="{{ $row['levelName'] }}"
                        @endif
                    >
                        <p class="m-catalog__meta">
                            @if ($row['levelName'])
                                <span>{{ $row['levelName'] }}</span>
                            @endif

                            @if ($row['duration'])
                                <span> · {{ $row['duration'] }}</span>
                            @endif

                            @if ($row['trackNames'])
                                <span> · {{ explode(', ', $row['trackNames'])[0] }}</span>
                            @endif

                            @if ($row['format'] !== 'group')
                                <span> · {{ ucfirst($row['format']) }}</span>
                            @endif
                        </p>

                        <h2 class="m-catalog__row-title">
                            <a href="{{ $row['url'] }}">{{ $row['title'] }}</a>
                        </h2>

                        @if ($row['excerpt'])
                            <p class="m-catalog__excerpt">{{ $row['excerpt'] }}</p>
                        @endif
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
