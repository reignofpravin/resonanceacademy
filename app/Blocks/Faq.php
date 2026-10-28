<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/faq — native <details> accordion with smooth height interpolation.
 */
final class Faq extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $items = array_values(array_filter(
            array_map(static fn ($item): array => [
                'question' => sanitize_text_field($item['question'] ?? ''),
                'answer' => wp_kses_post($item['answer'] ?? ''),
            ], $attributes['items'] ?? []),
            static fn (array $item): bool => $item['question'] !== '',
        ));

        // Keep the answer markup consistent even for plain-string (REST
        // round-trip) payloads.
        $firstOpen = array_key_first($items);

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Good to know'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Questions, answered.', 'ra-theme')),
            'items' => $items,
            'firstOpen' => $firstOpen,
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.faq.view';
    }
}
