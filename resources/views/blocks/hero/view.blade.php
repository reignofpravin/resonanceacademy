<section {!! get_block_wrapper_attributes(['class' => 'm-hero']) !!}>
    <canvas class="m-hero__canvas"
            data-ra-hero-wave="{{ $canvasStyle }}"
            aria-hidden="true"></canvas>

    <div class="m-hero__inner container">
        <div class="m-hero__copy">
            <p class="c-kicker m-hero__kicker" data-ra-reveal>{{ $kicker }}</p>

            <h1 class="m-hero__heading" data-ra-split>{!! $heading !!}</h1>

            @if ($text)
                <p class="m-hero__lead" data-ra-reveal>{!! $text !!}</p>
            @endif

            @if ($ctaLabel || $secondaryLabel)
                <div class="m-hero__actions" data-ra-reveal>
                    @if ($ctaLabel)
                        <a class="btn btn-primary btn-lg" href="{{ $ctaUrl ?: '#contact' }}">{{ $ctaLabel }}</a>
                    @endif

                    @if ($secondaryLabel)
                        <a class="btn btn-outline-primary btn-lg" href="{{ $secondaryUrl ?: '#contact' }}">{{ $secondaryLabel }}</a>
                    @endif
                </div>
            @endif
        </div>

    </div>

    <div class="m-hero__scroll-cue" aria-hidden="true" data-ra-reveal>
        <span>{{ __('Scroll', 'ra-theme') }}</span>
        <svg width="12" height="36" viewBox="0 0 12 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0v30M1 26l5 6 5-6" stroke="currentColor" stroke-width="1.5" data-ra-path></path>
        </svg>
    </div>
</section>
