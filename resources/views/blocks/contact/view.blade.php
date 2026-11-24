<section {!! get_block_wrapper_attributes(['class' => 'm-contact', 'data-ra-block' => 'contact']) !!} id="contact">
    <div class="container m-contact__inner">
        <div class="m-contact__copy">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-contact__heading" data-ra-reveal>{!! $heading !!}</h2>

            @if ($text)
                <p class="m-contact__text" data-ra-reveal>{!! $text !!}</p>
            @endif

            @php($deskEmail = trim(\App\Customizer\HeaderFooter::value('ra_footer_email')))
            @php($deskPhone = trim(\App\Customizer\HeaderFooter::value('ra_footer_phone')))
            @php($deskAddress = trim(\App\Customizer\HeaderFooter::value('ra_footer_address')))
            @php($deskHours = trim(\App\Customizer\HeaderFooter::value('ra_footer_hours')))

            @if ($deskEmail || $deskPhone || $deskAddress || $deskHours)
                <dl class="m-contact__details" data-ra-reveal>
                    @if ($deskAddress)
                        <div>
                            <dt>{{ __('Visit', 'ra-theme') }}</dt>
                            <dd>{!! nl2br(esc_html($deskAddress)) !!}</dd>
                        </div>
                    @endif

                    @if ($deskHours)
                        <div>
                            <dt>{{ __('Hours', 'ra-theme') }}</dt>
                            <dd>{!! nl2br(esc_html($deskHours)) !!}</dd>
                        </div>
                    @endif

                    @if ($deskEmail)
                        <div>
                            <dt>{{ __('Write', 'ra-theme') }}</dt>
                            <dd><a href="mailto:{{ esc_attr($deskEmail) }}">{{ esc_html($deskEmail) }}</a></dd>
                        </div>
                    @endif

                    @if ($deskPhone)
                        <div>
                            <dt>{{ __('Call', 'ra-theme') }}</dt>
                            <dd><a href="tel:{{ esc_attr(preg_replace('/[^0-9+]/', '', $deskPhone)) }}">{{ esc_html($deskPhone) }}</a></dd>
                        </div>
                    @endif
                </dl>
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
