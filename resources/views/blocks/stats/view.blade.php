<section {!! get_block_wrapper_attributes(['class' => 'm-stats', 'data-ra-block' => 'stats']) !!}>
    <div class="container">
        <dl class="m-stats__row m-stats__row--{{ $variant }}">
            @forelse ($stats as $stat)
                <div class="m-stats__item">
                    <dt class="m-stats__label">{{ $stat['label'] }}</dt>
                    <dd class="m-stats__value">
                        <span data-ra-count="{{ $stat['value'] }}"
                              data-ra-count-suffix="{{ $stat['suffix'] }}"
                              data-ra-count-duration="1.6">{{ $stat['value'] }}{{ $stat['suffix'] }}</span>
                    </dd>
                </div>
            @empty
                <div class="m-ra-placeholder"><p>{{ __('Add stats from block settings.', 'ra-theme') }}</p></div>
            @endforelse
        </dl>
    </div>
</section>
