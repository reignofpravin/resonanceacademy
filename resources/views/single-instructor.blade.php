@extends('layouts.app')

@section('content')
    @while (have_posts())
        @php(the_post())

        @php($item = \App\View\Composers\SingleData::collect(get_the_ID()))

        <article {!! post_class('m-single m-single--instructor') !!}>
            <header class="m-single__head">
                <div class="container">
                    <p class="c-kicker"><a href="{{ $item['relatedArchive'] }}">{{ $item['archiveLabel'] }}</a></p>
                    <h1 class="m-single__title">{{ get_the_title() }}</h1>

                    @if ($item['role'])
                        <p class="m-single__standfirst">{{ $item['role'] }}</p>
                    @endif
                </div>
            </header>

            <div class="container m-single__grid m-single__grid--instructor">
                <div class="m-single__content">
                    @if (has_post_thumbnail())
                        <figure class="m-single__media m-single__media--portrait">{!! get_the_post_thumbnail(get_the_ID(), 'large') !!}</figure>
                    @else
                        <figure class="m-single__media m-single__media--portrait m-single__media--ph" aria-hidden="true">
                            <span>♪</span>
                        </figure>
                    @endif

                    <div class="m-single__body">
                        {!! $item['content'] !!}
                    </div>
                </div>

                <aside class="m-single__aside">
                    <h2 class="m-single__aside-title">{{ __('Teaches', 'ra-theme') }}</h2>
                    <p class="m-single__aside-text">{{ $item['instruments'] ? implode(' · ', $item['instruments']) : '—' }}</p>

                    @if ($item['related'])
                        <h2 class="m-single__aside-title">{{ $item['relatedLabel'] }}</h2>
                        <ul class="m-single__aside-list">
                            @foreach ($item['related'] as $relatedId)
                                <li><a href="{{ get_permalink($relatedId) }}">{{ get_the_title($relatedId) }}</a></li>
                            @endforeach
                        </ul>
                    @endif
                </aside>
            </div>
        </article>
    @endwhile
@endsection
