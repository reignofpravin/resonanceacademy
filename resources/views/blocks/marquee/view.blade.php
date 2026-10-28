<section {!! get_block_wrapper_attributes(['class' => 'm-marquee', 'data-ra-block' => 'marquee']) !!} aria-label="{{ __('Highlights tape', 'ra-theme') }}">
    <div class="c-marquee" data-ra-marquee data-ra-marquee-duration="{{ $duration }}">
        <div class="c-marquee__track">
            @forelse ($items as $item)
                <span class="m-marquee__item">{{ $item }}</span>
                <span class="m-marquee__sep" aria-hidden="true">♪</span>
            @empty
                <span class="m-marquee__item">{{ __('Summer enrolment opens soon', 'ra-theme') }}</span>
                <span class="m-marquee__sep" aria-hidden="true">♪</span>
                <span class="m-marquee__item">{{ __('Open lessons every evening', 'ra-theme') }}</span>
                <span class="m-marquee__sep" aria-hidden="true">♪</span>
            @endforelse
        </div>
    </div>
</section>
