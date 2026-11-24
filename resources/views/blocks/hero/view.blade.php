<section {!! get_block_wrapper_attributes(['class' => 'm-stage', 'data-ra-stage' => '']) !!}>
    <div class="m-stage__glow" aria-hidden="true"></div>
    <div class="m-stage__grooves" aria-hidden="true"></div>

    <div class="m-stage__inner container">
        <canvas class="m-stage__ribbons" data-ra-ribbons aria-hidden="true"></canvas>
        <canvas class="m-stage__dust" data-ra-dust aria-hidden="true"></canvas>

        <div class="m-stage__head">
            <p class="m-stage__kicker">
                <span class="m-stage__pulse" aria-hidden="true"></span>
                {{ $kicker }}
            </p>

            <div class="m-stage__aside">
                <p class="m-stage__chapter" aria-hidden="true">
                    <em>01</em><span> / 05</span>
                </p>

                <div class="m-stage__notes" aria-hidden="true">
                    <span>{{ __('Enrolments open', 'ra-theme') }}</span>
                    <span>{{ __('Autumn 2026 intake', 'ra-theme') }}</span>
                    <span>{{ __('Every course ends on stage', 'ra-theme') }}</span>
                </div>
            </div>
        </div>

        <div class="m-stage__media">
            <div class="m-stage__object" data-ra-stage-object>
                <img
                    src="{{ Vite::asset('resources/images/emblem-stage.jpg') }}"
                    alt=""
                    width="900"
                    height="900"
                    fetchpriority="high"
                    decoding="async"
                >

                {{-- Sticker sits on the medallion's rim and travels with it. --}}
                <div class="m-stage__stamp" aria-hidden="true">
                    <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
                        <defs>
                            <path id="ra-stamp-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
                        </defs>
                        <text class="m-stage__stamp-text">
                            <textPath href="#ra-stamp-path" startOffset="0">
                                A MUSIC ACADEMY · LALITPUR · NEPAL · SINCE 2011 ·
                            </textPath>
                        </text>
                        <circle class="m-stage__stamp-ring" cx="100" cy="100" r="56" />
                        <path class="m-stage__stamp-note" d="M104 76v34" />
                        <circle class="m-stage__stamp-dot" cx="96" cy="112" r="8" />
                        <circle class="m-stage__stamp-dot" cx="118" cy="107" r="8" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="m-stage__copy">
            <h1 class="m-stage__title" data-ra-split>{!! $heading !!}</h1>

            @if ($text)
                <p class="m-stage__lead">{!! $text !!}</p>
            @endif

            @if ($ctaLabel || $secondaryLabel)
                <div class="m-stage__actions">
                    @if ($ctaLabel)
                        <a class="btn btn-primary btn-lg" href="{{ $ctaUrl ?: home_url('/#contact') }}">{{ $ctaLabel }}</a>
                    @endif

                    @if ($secondaryLabel)
                        <a class="btn btn-outline-primary btn-lg" href="{{ $secondaryUrl ?: home_url('/#contact') }}">{{ $secondaryLabel }}</a>
                    @endif
                </div>
            @endif

            <span class="m-stage__cue" aria-hidden="true">
                <span></span>
            </span>

            <ul class="m-stage__facts">
                <li>{{ __('Est. 2011', 'ra-theme') }}</li>
                <li>{{ __('1:1 & ensemble', 'ra-theme') }}</li>
                <li>{{ __('All ages', 'ra-theme') }}</li>
            </ul>
        </div>

        <p class="m-stage__wordmark" aria-hidden="true">
            @foreach (str_split('Resonance') as $i => $letter)
                <span style="--i: {{ $i }}">{{ $letter }}</span>
            @endforeach
        </p>

        <div class="m-stage__rail">
            <span class="m-stage__rail-label">{{ __('Scroll to take the stage', 'ra-theme') }}</span>
            <i class="m-stage__rail-line" data-ra-stage-rail aria-hidden="true"></i>
            <span class="m-stage__rail-meta">{{ __('Kathmandu Valley · Nepal', 'ra-theme') }}</span>
        </div>
    </div>
</section>
