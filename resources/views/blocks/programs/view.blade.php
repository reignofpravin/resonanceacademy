@php
    $total = max(1, count($courses));
    $side = static fn (int $position): string => $position < (int) ceil($total / 2) ? 'SIDE A' : 'SIDE B';
@endphp
<section {!! get_block_wrapper_attributes(['class' => 'm-programs', 'id' => 'programmes']) !!}>
    <div class="container">
        <header class="m-programs__head">
            <div class="m-programs__head-copy">
                <p class="m-programs__eyebrow">
                    <span class="m-programs__eyebrow-num">02</span>
                    {{ $kicker }}
                </p>
                <h2 class="m-programs__heading">{!! $heading !!}</h2>
            </div>

            <p class="m-programs__count">
                <span class="m-programs__count-num">{{ str_pad((string) count($courses), 2, '0', STR_PAD_LEFT) }}</span>
                <span>{{ __('programmes running now', 'ra-theme') }}</span>
            </p>
        </header>

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

        @if ($deckIndex !== [])
            <nav class="m-programs__index" aria-label="{{ __('Jump to an instrument in the deck', 'ra-theme') }}">
                @foreach ($deckIndex as $entry)
                    <button type="button"
                            class="m-programs__idx"
                            data-ra-jump="{{ $entry['position'] }}"
                            data-ra-track="{{ $entry['slug'] }}">
                        <span class="m-programs__idx-arrow" aria-hidden="true">→</span>
                        {{ $entry['name'] }}
                    </button>
                @endforeach
            </nav>
        @endif

        <div class="m-programs__stage"
             data-ra-deck
             role="region"
             aria-roledescription="carousel"
             aria-label="{{ __('Course deck — drag, or use the arrow keys', 'ra-theme') }}"
             tabindex="0">
            <canvas class="m-programs__spectrum" data-ra-spectrum aria-hidden="true"></canvas>

            <div class="m-programs__strings" data-ra-strings aria-hidden="true">
                <i></i><i></i>
            </div>

            <div class="m-programs__rail" data-ra-rail>
                @forelse ($courses as $course)
                    @php
                        $chips = array_values(array_filter([
                            $course['level'] ?? '',
                            $course['format'] ?? '',
                            $course['duration'] ?? '',
                        ]));
                    @endphp

                    <article class="m-programs__card" data-ra-card
                             style="--a1: {{ $course['art']['a'] }}; --a2: {{ $course['art']['b'] }}; --a3: {{ $course['art']['c'] }}; --aa: {{ $course['art']['angle'] }}deg;">
                        <span class="m-programs__vinyl" aria-hidden="true"><i></i></span>

                        <div class="m-programs__art" aria-hidden="true">
                            <span class="m-programs__num">
                                {{ __('Track', 'ra-theme') }} {{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}
                            </span>
                        </div>

                        <div class="m-programs__body">
                            <h3 class="m-programs__title">
                                <a href="{{ $course['url'] }}">{{ $course['title'] }}</a>
                            </h3>

                            @if ($course['instruments'])
                                <p class="m-programs__instruments">{{ $course['instruments'] }}</p>
                            @endif

                            @if ($chips !== [])
                                <ul class="m-programs__chips">
                                    @foreach ($chips as $chip)
                                        <li>{{ $chip }}</li>
                                    @endforeach
                                </ul>
                            @endif
                        </div>
                    </article>
                @empty
                    <div class="m-programs__empty">
                        <p>{{ __('New programs are being tuned up — check back soon.', 'ra-theme') }}</p>
                        <a class="btn btn-outline-primary" href="{{ $archiveUrl }}">{{ __('Browse all courses', 'ra-theme') }}</a>
                    </div>
                @endforelse
            </div>

            <div class="m-programs__scrub" aria-hidden="true">
                <span class="m-programs__scrub-fill" data-ra-scrub></span>
            </div>
        </div>

        <div class="m-programs__transport">
            <button type="button" class="m-programs__tbtn" data-ra-prev aria-label="{{ __('Previous programme', 'ra-theme') }}">
                <span aria-hidden="true">←</span>
            </button>

            <p class="m-programs__counter">
                <span class="m-programs__counter-word">{{ __('Now playing', 'ra-theme') }}</span>
                <span class="m-programs__counter-num" data-ra-counter>01</span>
                <span class="m-programs__counter-total">/ {{ str_pad((string) $total, 2, '0', STR_PAD_LEFT) }}</span>
                <span class="m-programs__counter-side" data-ra-side>{{ $side(0) }}</span>
            </p>

            <button type="button" class="m-programs__tbtn" data-ra-next aria-label="{{ __('Next programme', 'ra-theme') }}">
                <span aria-hidden="true">→</span>
            </button>
        </div>

        @if ($courses !== [])
            <div class="m-programs__foot">
                <a class="m-programs__all" href="{{ $archiveUrl }}">
                    {{ __('Full course catalogue', 'ra-theme') }}
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        @endif
    </div>
</section>
