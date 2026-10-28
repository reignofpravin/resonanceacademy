<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/stats — animated count-up stat strip.
 */
final class Stats extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $stats = array_values(array_map(static fn ($stat): array => [
            'value' => max(0, (int) ($stat['value'] ?? 0)),
            'label' => sanitize_text_field($stat['label'] ?? ''),
            'suffix' => sanitize_text_field($stat['suffix'] ?? ''),
        ], $attributes['stats'] ?? []));

        return [
            'stats' => $stats,
            'variant' => in_array($attributes['variant'] ?? 'inline', ['inline', 'band'], true) ? $attributes['variant'] : 'inline',
        ];
    }

    protected function view(): string
    {
        return 'blocks.stats.view';
    }
}
