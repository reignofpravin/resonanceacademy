<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * ra/contact — editorial contact intro + embedded Contact Form 7 form.
 *
 * Degrades gracefully when CF7 is not installed: the copy renders, the form
 * slot shows a static invitation that points visitors at the details below.
 */
final class Contact extends Block
{
    /**
     * Register the block type plus its editor asset global.
     */
    public function register(): void
    {
        parent::register();

        add_action('admin_head', [self::class, 'localizeForms'], 1);
    }

    /**
     * Print `window.raContactForms` before the editor bundle loads so
     * edit.jsx can offer a form picker. No-op when CF7 is inactive — the
     * editor then renders its install hint.
     */
    public static function localizeForms(): void
    {
        if (! function_exists('get_current_screen') || ! get_current_screen()?->is_block_editor() || ! class_exists('WPCF7_ContactForm')) {
            return;
        }

        $forms = \WPCF7_ContactForm::find();

        $list = array_values(array_map(static fn ($form): array => [
            'id' => $form->id(),
            'title' => $form->title(),
        ], is_array($forms) ? $forms : []));

        printf('<script>window.raContactForms = %s;</script>', wp_json_encode($list));
    }

    /**
     * Attributes → view data.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    protected function data(array $attributes, string $content): array
    {
        $formId = absint($attributes['formId'] ?? 0);
        $form = '';

        if (class_exists('WPCF7_ContactForm')) {
            $form = do_shortcode(
                '[contact-form-7 id="' . $formId . '" title="' . esc_attr__('Resonance enquiry', 'ra-theme') . '"]',
            );
        }

        return [
            'kicker' => sanitize_text_field($attributes['kicker'] ?? 'Get in touch'),
            'heading' => wp_kses_post($attributes['heading'] ?? __('Start your lessons.', 'ra-theme')),
            'text' => wp_kses_post($attributes['text'] ?? ''),
            'form' => $form,
            'formId' => $formId,
        ];
    }

    /**
     * Blade view.
     */
    protected function view(): string
    {
        return 'blocks.contact.view';
    }
}
