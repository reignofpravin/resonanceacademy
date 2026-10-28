@php
    $datetime = \App\PostTypes\Meta::get('ra_event_datetime', get_the_ID());
    $venue = \App\PostTypes\Meta::get('ra_event_venue', get_the_ID());
    $ticketUrl = \App\PostTypes\Meta::get('ra_event_ticket_url', get_the_ID());
    $types = get_the_terms(get_the_ID(), 'event_type');
    $ts = $datetime ? \DateTime::createFromFormat('Y-m-d H:i', $datetime, wp_timezone()) : false;
@endphp
<article {!! post_class('c-card c-card--event') !!} data-ra-reveal>
    <div class="c-card__body">
        <div class="c-card__chips">
            @if ($types && ! is_wp_error($types))
                @foreach ($types as $type)
                    <span class="c-chip c-chip--soft">{{ $type->name }}</span>
                @endforeach
            @endif
        </div>

        <h2 class="c-card__title">
            <a href="{{ get_permalink() }}">{{ get_the_title() }}</a>
        </h2>

        <p class="c-card__meta">
            @if ($ts instanceof \DateTime)
                <time datetime="{{ $datetime }}">{{ wp_date(get_option('date_format') . ' · g:i a', $ts->format('U')) }}</time>
            @endif

            @if ($venue)
                <span>· {{ $venue }}</span>
            @endif
        </p>
    </div>

    <div class="c-card__actions">
        @if ($ticketUrl)
            <a class="btn btn-outline-primary" href="{{ $ticketUrl }}">{{ __('Tickets', 'ra-theme') }}</a>
        @endif

        <a class="c-card__more" href="{{ get_permalink() }}">{{ __('Details', 'ra-theme') }}</a>
    </div>
</article>
