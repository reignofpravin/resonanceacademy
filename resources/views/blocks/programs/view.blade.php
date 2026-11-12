<section {!! get_block_wrapper_attributes(['class' => 'm-programs', 'data-ra-block' => 'programs']) !!}>
    <div class="container">
        <header class="m-programs__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-programs__heading" data-ra-reveal>{!! $heading !!}</h2>

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
                @php($track = $course['track'] !== '' ? $course['track'] : 'method')
                <article
                    class="m-programs__card"
                    data-ra-reveal
                    data-ra-reveal-delay="{{ number_format($loop->iteration * 0.06, 2) }}"
                    data-track="{{ $track }}"
                >
                    <div class="m-programs__art" aria-hidden="true">
                        <i class="m-programs__art-waves"></i>
                        <i class="m-programs__art-motif"></i>
                        <i class="m-programs__art-motif m-programs__art-motif--b"></i>
                    </div>

                    <div class="m-programs__card-body">
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

                        <span class="m-programs__go" aria-hidden="true">→</span>
                    </div>
                </article>
            @empty
                <div class="m-programs__empty" data-ra-reveal>
                    <p>{{ __('New programs are being tuned up — check back soon.', 'ra-theme') }}</p>
                    <a class="btn btn-outline-primary" href="{{ $archiveUrl }}">{{ __('Browse all courses', 'ra-theme') }}</a>
                </div>
            @endforelse
        </div>

        @if ($courses !== [])
            <div class="m-programs__foot" data-ra-reveal>
                <a class="m-programs__all" href="{{ $archiveUrl }}">
                    {{ __('Full course catalog', 'ra-theme') }} <span aria-hidden="true">→</span>
                </a>
            </div>
        @endif
    </div>
</section>
