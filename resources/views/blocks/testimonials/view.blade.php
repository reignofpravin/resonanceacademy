<section {!! get_block_wrapper_attributes(['class' => 'm-testimonials', 'data-ra-block' => 'testimonials', 'data-ra-slider-interval' => $interval]) !!}>
    <div class="container">
        <header class="m-testimonials__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-testimonials__heading" data-ra-split>{!! $heading !!}</h2>
        </header>

        @forelse ($quotes as $quote)
            <figure class="m-testimonials__slide {{ $loop->first ? 'is-active' : '' }}"
                    data-ra-slider-slide
                    @unless ($loop->first) aria-hidden="true" hidden @endunless>
                <svg class="m-testimonials__mark" width="44" height="32" viewBox="0 0 44 32" fill="none" aria-hidden="true">
                    <path d="M0 32V19.5C0 8.7 6.4 1.4 17 0l2 5.6c-6.3 1.5-9.5 4.6-9.9 9.4H17V32H0Zm27 0V19.5C27 8.7 33.4 1.4 44 0l-2 5.6c-6.3 1.5-9.5 4.6-9.9 9.4H44V32H27Z" fill="var(--ra-accent)" opacity="0.25"/>
                </svg>

                <blockquote class="m-testimonials__quote">{{ $quote['quote'] }}</blockquote>

                <figcaption class="m-testimonials__meta">
                    <span class="m-testimonials__name">{{ $quote['name'] }}</span>
                    @if ($quote['role'])
                        <span class="m-testimonials__role">· {{ $quote['role'] }}</span>
                    @endif
                </figcaption>
            </figure>
        @empty
            <div class="m-testimonials__empty" data-ra-reveal>
                <p>{{ __('Student stories are still being written — check back soon.', 'ra-theme') }}</p>
            </div>
        @endforelse

        @if (count($quotes) > 1)
            <div class="m-testimonials__controls">
                <button type="button" class="m-testimonials__arrow js-ra-slider-prev" aria-label="{{ __('Previous quote', 'ra-theme') }}">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M20 6H2m5 5L2 6l5-5" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>

                <div class="m-testimonials__dots js-ra-slider-dots" role="tablist" aria-label="{{ __('Quote selector', 'ra-theme') }}">
                    @foreach ($quotes as $quote)
                        <button type="button" class="m-testimonials__dot {{ $loop->first ? 'is-active' : '' }}"
                                data-ra-slider-dot="{{ $loop->index }}"
                                role="tab"
                                aria-label="{{ sprintf(__('Quote %d of %d', 'ra-theme'), $loop->index + 1, count($quotes)) }}"></button>
                    @endforeach
                </div>

                <button type="button" class="m-testimonials__arrow js-ra-slider-next" aria-label="{{ __('Next quote', 'ra-theme') }}">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M0 6h18m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>
            </div>
        @endif
    </div>
</section>
