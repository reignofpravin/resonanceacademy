<section {!! get_block_wrapper_attributes(['class' => 'm-instructors', 'data-ra-block' => 'instructors']) !!}>
    <div class="container">
        <header class="m-instructors__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-instructors__heading" data-ra-words>{!! $heading !!}</h2>
        </header>
    </div>

    <div class="m-instructors__track js-ra-instructors" tabindex="0" role="region"
         aria-label="{{ __('Instructors', 'ra-theme') }}">
        @forelse ($instructors as $instructor)
            <article class="m-instructors__card" data-ra-reveal>
                @if ($instructor['thumbnail'])
                    <div class="m-instructors__photo">{!! $instructor['thumbnail'] !!}</div>
                @else
                    <div class="m-instructors__photo m-instructors__photo--ph" aria-hidden="true">
                        <span>♪</span>
                    </div>
                @endif

                <div class="m-instructors__body">
                    @if ($instructor['role'])
                        <p class="c-kicker m-instructors__role">{{ $instructor['role'] }}</p>
                    @endif

                    <h3 class="m-instructors__name">
                        <a href="{{ $instructor['url'] }}">{{ $instructor['title'] }}</a>
                    </h3>

                    @if (count($instructor['instruments']))
                        <p class="m-instructors__instruments">
                            {{ implode(' · ', $instructor['instruments']) }}
                        </p>
                    @endif

                    @if ($instructor['excerpt'])
                        <p class="m-instructors__excerpt">{{ Str::limit($instructor['excerpt'], 110) }}</p>
                    @endif
                </div>
            </article>
        @empty
            <div class="m-instructors__empty" data-ra-reveal>
                <p>{{ __('Our faculty roster is being tuned — check back soon.', 'ra-theme') }}</p>
            </div>
        @endforelse
    </div>

    <div class="m-instructors__nav container">
        <button type="button" class="m-instructors__arrow js-ra-instructors-prev" aria-label="{{ __('Previous instructors', 'ra-theme') }}">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M20 6H2m5 5L2 6l5-5" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <button type="button" class="m-instructors__arrow js-ra-instructors-next" aria-label="{{ __('Next instructors', 'ra-theme') }}">
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M0 6h18m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
    </div>
</section>
