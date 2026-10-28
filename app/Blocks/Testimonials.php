<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/testimonials — rotating quotes slider (auto + manual controls).
 */
final class Testimonials extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $quotes = array_values(array_filter(array_map(static fn ($quote): array => [
            'quote' => sanitize_text_field($quote['quote'] ?? ''),
            'name' => sanitize_text_field($quote['name'] ?? ''),
            'role' => sanitize_text_field($quote['role'] ?? ''),
            'avatar' => esc_url_raw($quote['avatar'] ?? ''),
        ], $attributes['quotes'] ?? []), static fn (array $quote): bool => $quote['quote'] !== ''));

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Student voices'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('What our players say.', 'ra-theme')),
            'quotes' => $quotes,
            'interval' => max(3, (int) ($attributes['interval'] ?? 8)),
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.testimonials.view';
    }
}
