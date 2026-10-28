@extends('layouts.app')

@php
    // Generic archive shell: post-type archives (course/instructor/event),
    // taxonomy archives (course_category, instrument, event_type) and the
    // blog index all resolve here through Sage's fallback chain.
    $postType = get_query_var('post_type');

    if (is_tax('instrument') || is_tax('course_category')) {
        $postType = 'course';
    } elseif (is_tax('event_type')) {
        $postType = 'event';
    }

    $identity = match ($postType) {
        'course' => __('Programs', 'ra-theme'),
        'instructor' => __('Faculty', 'ra-theme'),
        'event' => __('Calendar', 'ra-theme'),
        default => __('Journal', 'ra-theme'),
    };

    $title = is_tax() || is_tag() || is_category()
        ? (single_term_title('', false) ?: get_the_archive_title())
        : (post_type_archive_title('', false) ?: get_the_archive_title());
@endphp

@section('content')
    <section class="m-archive-head">
        <div class="container">
            <p class="c-kicker">{{ $identity }}</p>
            <h1 class="m-archive-head__title">{{ $title }}</h1>

            @if (get_the_archive_description())
                <div class="m-archive-head__desc">{!! get_the_archive_description() !!}</div>
            @endif
        </div>
    </section>

    <section class="m-archive">
        <div class="container">
            <div class="m-archive__grid">
                @while (have_posts())
                    @php(the_post())
                    @include('partials.card-' . get_post_type())
                @endwhile
            </div>

            {!! get_the_posts_pagination(['mid_size' => 1, 'class' => 'm-archive__pagination']) !!}
        </div>
    </section>
@endsection
