<section {!! get_block_wrapper_attributes(['class' => 'm-contact', 'data-ra-block' => 'contact']) !!} id="contact">
    <div class="container m-contact__inner">
        <div class="m-contact__copy">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-contact__heading" data-ra-split>{!! $heading !!}</h2>

            @if ($text)
                <p class="m-contact__text" data-ra-reveal>{!! $text !!}</p>
            @endif
        </div>

        <div class="m-contact__form" data-ra-reveal>
            @if ($form !== '')
                {!! $form !!}
            @else
                <div class="m-contact__fallback">
                    <p class="m-contact__fallback-title">{{ __('Ready to begin?', 'ra-theme') }}</p>
                    <p class="m-contact__fallback-text">{{ __('Call the academy desk or drop by during opening hours — we will set up your first lesson.', 'ra-theme') }}</p>
                </div>
            @endif
        </div>
    </div>
</section>
