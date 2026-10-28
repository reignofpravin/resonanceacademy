<section {!! get_block_wrapper_attributes(['class' => 'm-method', 'data-ra-block' => 'method']) !!}>
    <div class="container">
        <div class="m-method__inner">
            <div class="m-method__sticky">
                <div class="m-method__copy">
                    <p class="c-kicker" data-ra-reveal>{{ $kicker }}</p>
                    <h2 class="m-method__heading" data-ra-split>{!! $heading !!}</h2>
                </div>

                <div class="m-method__media">
                    {!! $image ?: '' !!}
                    <div class="m-method__clef" aria-hidden="true">
                        <x-icon icon="treble" />
                    </div>
                </div>
            </div>

            <ol class="m-method__steps">
                @forelse ($steps as $index => $step)
                    <li class="m-method__step" data-ra-reveal>
                        <span class="m-method__num">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span>
                        <div class="m-method__step-body">
                            <h3 class="m-method__step-title">{{ $step['title'] }}</h3>
                            <p class="m-method__step-text">{{ $step['text'] }}</p>
                        </div>
                    </li>
                @empty
                    <li class="m-method__empty"><p>{{ __('Add steps from the block settings.', 'ra-theme') }}</p></li>
                @endforelse
            </ol>
        </div>
    </div>
</section>
