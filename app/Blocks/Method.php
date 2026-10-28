<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/method — sticky storytelling section: media + numbered steps.
 */
final class Method extends Block
{
    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $steps = array_values(array_filter(array_map(static fn ($step): array => [
            'title' => sanitize_text_field($step['title'] ?? ''),
            'text' => wp_kses_post($step['text'] ?? ''),
        ], $attributes['steps'] ?? []), static fn (array $step): bool => $step['title'] !== ''));

        $imageId = (int) ($attributes['imageId'] ?? 0);

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'The Method'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Sound is a skill you can build.', 'ra-theme')),
            'image' => $imageId > 0 ? wp_get_attachment_image($imageId, 'large', false, ['class' => 'm-method__img', 'data-ra-reveal' => '']) : '',
            'steps' => $steps,
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.method.view';
    }
}
