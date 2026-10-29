<section {!! get_block_wrapper_attributes(['class' => 'm-programs', 'data-ra-block' => 'programs']) !!}>
    <div class="container">
        <header class="m-programs__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-programs__heading" data-ra-words>{!! $heading !!}</h2>

            <nav class="m-programs__filters" aria-label="{{ __('Program categories', 'ra-theme') }}">
                <a href="{{ $archiveUrl }}"
                   class="m-programs__filter {{ is_tax('course_category') ? '' : 'is-active' }}">
                    {{ __('All', 'ra-theme') }}
                </a>

                @foreach ($categories as $category)
                    <a href="{{ esc_url(get_term_link($category)) }}"
                       class="m-programs__filter {{ is_tax('course_category', $category->term_id) ? 'is-active' : '' }}">
                        {{ $category->name }}
                    </a>
                @endforeach
            </nav>
        </header>

        <div class="m-programs__list" data-ra-block-programs>
            @forelse ($courses as $course)
                <article class="m-programs__row" data-ra-reveal>
                    <span class="m-programs__num" aria-hidden="true">{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>

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

                            @if ($course['instruments'])
                                <span> · {!! $course['instruments'] !!}</span>
                            @endif
                        </p>
                    </div>

                    <span class="m-programs__go" aria-hidden="true">→</span>
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
