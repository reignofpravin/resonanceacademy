<section {!! get_block_wrapper_attributes(['class' => 'm-events', 'data-ra-block' => 'events']) !!}>
    <div class="container">
        <header class="m-events__header">
            <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
            <h2 class="m-events__heading" data-ra-words>{!! $heading !!}</h2>
        </header>

        <ol class="m-events__list m-events__list--{{ $style }}">
            @forelse ($events as $event)
                <li class="m-events__item" data-ra-reveal>
                    <div class="m-events__badge" aria-hidden="true">
                        @if ($event['timestamp'])
                            <span class="m-events__badge-day">{{ wp_date('j', $event['timestamp']) }}</span>
                            <span class="m-events__badge-month">{{ wp_date('M', $event['timestamp']) }}</span>
                        @else
                            <span class="m-events__badge-month">♪</span>
                        @endif
                    </div>

                    <div class="m-events__info">
                        <div class="m-events__chips">
                            @foreach ($event['type'] as $type)
                                <span class="c-chip c-chip--soft">{{ $type }}</span>
                            @endforeach
                        </div>

                        <h3 class="m-events__title">
                            <a href="{{ $event['url'] }}">{{ $event['title'] }}</a>
                        </h3>

                        <p class="m-events__meta">
                            @if ($event['timestamp'])
                                <time datetime="{{ $event['iso'] }}">{{ wp_date(get_option('date_format').' · g:i a', $event['timestamp']) }}</time>
                            @endif

                            @if ($event['venue'])
                                <span>· {{ $event['venue'] }}</span>
                            @endif
                        </p>
                    </div>

                    <div class="m-events__actions">
                        @if ($event['ticketUrl'])
                            <a class="m-events__tickets" href="{{ esc_url($event['ticketUrl']) }}">{{ __('Tickets', 'ra-theme') }} →</a>
                        @else
                            <a class="m-events__more" href="{{ $event['url'] }}">{{ __('Details', 'ra-theme') }} →</a>
                        @endif
                    </div>
                </li>
            @empty
                <li class="m-events__empty" data-ra-reveal>
                    <p>{{ __('No upcoming events right now — the next season is in rehearsal.', 'ra-theme') }}</p>
                </li>
            @endforelse
        </ol>
    </div>
</section>
