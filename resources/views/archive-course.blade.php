@extends('layouts.app')

@php
    // Dedicated course catalog: every published course as an animated,
    // instantly filterable row. Taxonomy/meta data prep lives in the
    // CourseCatalog composer; the view stays markup-only.
    $catalog = \App\View\Composers\CourseCatalog::collect();
@endphp

@section('content')
    <section class="m-catalog" data-ra-catalog>
        <div class="m-catalog__head">
            <div class="container">
                <p class="c-kicker" data-ra-reveal>{{ __('All courses', 'ra-theme') }}</p>
                <h1 class="m-catalog__title" data-ra-split>{{ __('Find your track.', 'ra-theme') }}</h1>
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

        <div class="container">
            <div class="m-catalog__bar" data-ra-catalog-bar>
                <div class="m-catalog__groups">
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

                    <div class="m-catalog__group m-catalog__group--search">
                        <input
                            type="search"
                            class="m-catalog__search js-catalog-search"
                            value="{{ $catalog['state']['q'] }}"
                            placeholder="{{ __('Search courses…', 'ra-theme') }}"
                            aria-label="{{ __('Search courses', 'ra-theme') }}"
                        >
                    </div>
                </div>

                <div class="m-catalog__status">
                    <p class="m-catalog__count js-catalog-count" aria-live="polite">
                        {{ __('Showing', 'ra-theme') }}
                        <strong data-ra-catalog-count>{{ $catalog['total'] }}</strong>
                        {{ __('of', 'ra-theme') }}
                        {{ $catalog['total'] }}
                        {{ __('courses', 'ra-theme') }}
                    </p>

                    <button type="button" class="m-catalog__clear js-catalog-clear" data-ra-active="false">
                        {{ __('Clear filters', 'ra-theme') }} ✕
                    </button>
                </div>

                <i class="m-catalog__progress" aria-hidden="true"></i>
            </div>

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
                        <span class="m-catalog__num" aria-hidden="true">{{ str_pad((string) ($loop->iteration), 2, '0', STR_PAD_LEFT) }}</span>

                        <div class="m-catalog__body">
                            <div class="m-catalog__chips">
                                <span class="c-chip" data-ra-level-label>{{ $row['levelName'] }}</span>

                                @if ($row['format'] !== 'group')
                                    <span class="c-chip c-chip--soft">{{ ucfirst($row['format']) }}</span>
                                @endif

                                @if ($row['path'] !== '')
                                    <span class="c-chip c-chip--soft">
                                        @if (str_contains($row['path'], 'affiliated-degree-programmes'))
                                            {{ __('Degree pathway', 'ra-theme') }}
                                        @else
                                            {{ __('Core', 'ra-theme') }}
                                        @endif
                                    </span>
                                @endif
                            </div>

                            <h2 class="m-catalog__title">
                                <a href="{{ $row['url'] }}">{{ $row['title'] }}</a>
                            </h2>

                            <p class="m-catalog__meta">
                                @if ($row['duration'])
                                    <span>{{ $row['duration'] }}</span>
                                @endif

                                @if ($row['trackNames'])
                                    <span> · {{ $row['trackNames'] }}</span>
                                @endif
                            </p>

                            @if ($row['excerpt'])
                                <p class="m-catalog__excerpt">{{ $row['excerpt'] }}</p>
                            @endif
                        </div>

                        <span class="m-catalog__wave" aria-hidden="true"></span>

                        <span class="m-catalog__go" aria-hidden="true">→</span>
                    </article>
                @endforeach
            </div>

            <div class="m-catalog__empty" data-ra-empty hidden>
                <p>{{ __('Nothing settles at that combination yet — try loosening a filter.', 'ra-theme') }}</p>
            </div>

            <noscript>
                <p class="m-catalog__noscript">
                    {{ __('Filters animate live with JavaScript; without it, the full course list above stays browsable and every course is one click away.', 'ra-theme') }}
                </p>
            </noscript>
        </div>
    </section>
@endsection
