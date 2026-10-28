<section {!! get_block_wrapper_attributes(['class' => 'm-programs', 'data-ra-block' => 'programs']) !!}>
    <div class="container">
        <header class="m-programs__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-programs__heading" data-ra-split>{!! $heading !!}</h2>

            <nav class="m-programs__filters" aria-label="{{ __('Program categories', 'ra-theme') }}">
                <a href="{{ $archiveUrl }}"
                   class="m-programs__filter {{ (request()->input('category') ? '' : 'is-active') }}">
                    {{ __('All', 'ra-theme') }}
                </a>

                @foreach ($categories as $category)
                    <a href="{{ add_query_arg('category', $category->slug, $archiveUrl) }}"
                       class="m-programs__filter {{ (request()->input('category') === $category->slug ? 'is-active' : '') }}">
                        {{ $category->name }}
                    </a>
                @endforeach
            </nav>
        </header>

        <div class="m-programs__grid" data-ra-block-programs>
            @forelse ($courses as $course)
                <article class="m-programs__card" data-ra-reveal>
                    <div class="m-programs__disc js-ra-vinyl" aria-hidden="true"></div>

                    @if ($course['thumbnail'])
                        <a class="m-programs__thumb" href="{{ $course['url'] }}"
                           tabindex="-1" aria-hidden="true">{!! $course['thumbnail'] !!}</a>
                    @endif

                    <div class="m-programs__body">
                        <div class="m-programs__chips">
                            <span class="c-chip">{{ $course['level'] }}</span>
                            @if ($course['format'] !== 'group')
                                <span class="c-chip c-chip--soft">{{ ucfirst($course['format']) }}</span>
                            @endif
                        </div>

                        <h3 class="m-programs__title">
                            <a href="{{ $course['url'] }}">{{ $course['title'] }}</a>
                        </h3>

                        <p class="m-programs__meta">
                            @if ($course['duration'])
                                <span>{{ $course['duration'] }}</span>
                            @endif
                        </p>

                        @if ($course['instruments'])
                            <p class="m-programs__instruments">{!! $course['instruments'] !!}</p>
                        @endif
                    </div>
                </article>
            @empty
                <div class="m-programs__empty" data-ra-reveal>
                    <p>{{ __('New programs are being tuned up — check back soon.', 'ra-theme') }}</p>
                    <a class="btn btn-outline-primary" href="{{ $archiveUrl }}">{{ __('Browse all courses', 'ra-theme') }}</a>
                </div>
            @endforelse
        </div>
    </div>
</section>
