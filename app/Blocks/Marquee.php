<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/marquee — infinite editorial ticker with note separators.
 */
final class Marquee extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $items = array_values(array_filter(array_map(
            static fn ($item): string => sanitize_text_field($item['text'] ?? ''),
            $attributes['items'] ?? [],
        )));

        return [
            'items' => $items,
            'duration' => max(10, (int) ($attributes['duration'] ?? 30)),
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.marquee.view';
    }
}
