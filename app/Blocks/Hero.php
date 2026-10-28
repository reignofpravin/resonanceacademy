<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/hero — full-width editorial hero with animated canvas behind the type.
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
        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Resonance Academy'),
            'heading' => wp_kses_post($attributes['heading'] ?? 'Find your frequency.'),
            'text' => wp_kses_post($attributes['text'] ?? ''),
            'ctaLabel' => sanitize_text_field($attributes['ctaLabel'] ?? ''),
            'ctaUrl' => esc_url_raw($attributes['ctaUrl'] ?? ''),
            'secondaryLabel' => sanitize_text_field($attributes['secondaryLabel'] ?? ''),
            'secondaryUrl' => esc_url_raw($attributes['secondaryUrl'] ?? ''),
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
