<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/hero — full-height night stage with medallion, mega wordmark and rail.
 */
final class Hero extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        // Blocks saved before the "After Hours" redesign carry empty strings,
        // so a plain `??` fallback never fires. Treat blank as absent.
        $text = trim((string) ($attributes['text'] ?? ''));
        $ctaLabel = trim((string) ($attributes['ctaLabel'] ?? ''));
        $secondaryLabel = trim((string) ($attributes['secondaryLabel'] ?? ''));

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Resonance Academy'),
            'heading' => wp_kses_post($attributes['heading'] ?? 'Find your frequency.'),
            'text' => wp_kses_post($text !== '' ? $text : __('One-to-one lessons, ensembles and recitals in a converted hall in Lalitpur — taught by players who perform.', 'ra-theme')),
            'ctaLabel' => sanitize_text_field($ctaLabel !== '' ? $ctaLabel : __('Book a trial lesson', 'ra-theme')),
            'ctaUrl' => esc_url_raw($attributes['ctaUrl'] ?? ''),
            'secondaryLabel' => sanitize_text_field($secondaryLabel !== '' ? $secondaryLabel : __('Explore programmes', 'ra-theme')),
            'secondaryUrl' => esc_url_raw($attributes['secondaryUrl'] ?? '#programmes'),
            'canvasStyle' => in_array($attributes['canvasStyle'] ?? 'wave', ['wave', 'bars'], true) ? $attributes['canvasStyle'] : 'wave',
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.hero.view';
    }
}
