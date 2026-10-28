@php
    $level = \App\PostTypes\Meta::get('ra_course_level', get_the_ID());
    $duration = \App\PostTypes\Meta::get('ra_course_duration', get_the_ID());
    $format = \App\PostTypes\Meta::get('ra_course_format', get_the_ID());
    $instruments = get_the_terms(get_the_ID(), 'instrument');
@endphp
<article {!! post_class('c-card c-card--course') !!} data-ra-reveal>
    @if (has_post_thumbnail())
        <a class="c-card__thumb" href="{{ get_permalink() }}" tabindex="-1" aria-hidden="true">
            {!! get_the_post_thumbnail(get_the_ID(), 'medium_large') !!}
        </a>
    @endif

    <div class="c-card__body">
        <div class="c-card__chips">
            <span class="c-chip">{{ $level }}</span>

            @if ($format !== 'group')
                <span class="c-chip c-chip--soft">{{ ucfirst($format) }}</span>
            @endif
        </div>

        <h2 class="c-card__title">
            <a href="{{ get_permalink() }}">{{ get_the_title() }}</a>
        </h2>

        @if (get_the_excerpt())
            <p class="c-card__excerpt">{{ wp_strip_all_tags(get_the_excerpt()) }}</p>
        @endif

        <p class="c-card__meta">
            @if ($duration)
                <span>{{ $duration }}</span>
            @endif

            @if ($instruments && ! is_wp_error($instruments))
                <span>{{ implode(' · ', array_map(static fn ($term) => $term->name, is_array($instruments) ? $instruments : iterator_to_array($instruments))) }}</span>
            @endif
        </p>
    </div>
</article>
