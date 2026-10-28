@php
    $role = \App\PostTypes\Meta::get('ra_instructor_role', get_the_ID());
    $instruments = get_the_terms(get_the_ID(), 'instrument');
@endphp
<article {!! post_class('c-card c-card--instructor') !!} data-ra-reveal>
    @if (has_post_thumbnail())
        <a class="c-card__thumb c-card__thumb--portrait" href="{{ get_permalink() }}" tabindex="-1" aria-hidden="true">
            {!! get_the_post_thumbnail(get_the_ID(), 'medium') !!}
        </a>
    @else
        <div class="c-card__thumb c-card__thumb--ph" aria-hidden="true"><span>♪</span></div>
    @endif

    <div class="c-card__body">
        @if ($role)
            <p class="c-kicker c-card__kicker">{{ $role }}</p>
        @endif

        <h2 class="c-card__title">
            <a href="{{ get_permalink() }}">{{ get_the_title() }}</a>
        </h2>

        @if ($instruments && ! is_wp_error($instruments))
            <p class="c-card__meta">
                {{ implode(' · ', array_map(static fn ($term) => $term->name, is_array($instruments) ? $instruments : iterator_to_array($instruments))) }}
            </p>
        @endif
    </div>
</article>
