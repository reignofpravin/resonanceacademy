@extends('layouts.app')

@section('content')
    @while (have_posts())
        @php(the_post())

        @php($item = \App\View\Composers\SingleData::collect(get_the_ID()))

        <article {!! post_class('m-single m-single--event') !!}>
            <header class="m-single__head">
                <div class="container">
                    <p class="c-kicker"><a href="{{ $item['relatedArchive'] }}">{{ $item['archiveLabel'] }}</a></p>
                    <h1 class="m-single__title">{{ get_the_title() }}</h1>

                    <p class="m-single__standfirst">
                        @if ($item['when'])
                            <time datetime="{{ $item['when']->format('Y-m-d H:i') }}">{{ $item['whenFormatted'] }}</time>
                        @endif

                        @if ($item['venue'])
                            <span>· {{ $item['venue'] }}</span>
                        @endif
                    </p>
                </div>
            </header>

            <div class="container m-single__grid">
                <div class="m-single__content">
                    @if (has_post_thumbnail())
                        <figure class="m-single__media">{!! get_the_post_thumbnail(get_the_ID(), 'large') !!}</figure>
                    @endif

                    <div class="m-single__body">
                        {!! $item['content'] !!}
                    </div>
                </div>

                <aside class="m-single__aside">
                    @if ($item['types'])
                        <h2 class="m-single__aside-title">{{ __('Event type', 'ra-theme') }}</h2>
                        <p class="m-single__aside-text">{{ implode(' · ', $item['types']) }}</p>
                    @endif

                    @if ($item['ticketUrl'])
                        <a class="btn btn-primary" href="{{ $item['ticketUrl'] }}">{{ __('Get tickets', 'ra-theme') }}</a>
                    @endif
                </aside>
            </div>
        </article>
    @endwhile
@endsection
