<section {!! get_block_wrapper_attributes(['class' => 'm-faq', 'data-ra-block' => 'faq']) !!}>
    <div class="container">
        <header class="m-faq__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-faq__heading" data-ra-words>{!! $heading !!}</h2>
        </header>

        <div class="m-faq__list">
            @forelse ($items as $index => $item)
                <details class="m-faq__item" {!! ($firstOpen === $index) ? 'open' : '' !!} data-ra-faq>
                    <summary class="m-faq__question">
                        <span>{{ $item['question'] }}</span>
                        <svg class="m-faq__chevron" width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                            <path d="m1 1 7 7 7-7" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </summary>

                    <div class="m-faq__answer" data-ra-faq-answer>
                        <p>{{ $item['answer'] }}</p>
                    </div>
                </details>
            @empty
                <div class="m-faq__empty" data-ra-reveal>
                    <p>{{ __('No questions yet — ask us anything at the contact form below.', 'ra-theme') }}</p>
                </div>
            @endforelse
        </div>
    </div>
</section>
