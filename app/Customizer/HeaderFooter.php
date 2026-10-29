<?php

declare(strict_types=1);

namespace App\Customizer;

/**
 * Registers the "Resonance — Header & Footer" Customizer section.
 *
 * Everything the header CTA and the footer blocks need lives in theme mods,
 * so content is editable from Appearance → Customize without touching code.
 * Social links stay optional: only networks given a URL are rendered.
 */
final class HeaderFooter
{
    private const SECTION = 'ra_header_footer';

    /**
     * Setting key → default value. Defaults keep the demo site looking
     * complete; socials default to empty (rendered only when filled).
     *
     * @return array<string, string>
     */
    private static function defaults(): array
    {
        return [
            'ra_cta_text' => 'Enquire',
            'ra_cta_url' => '#contact',
            'ra_footer_tagline' => 'Musicians made here.',
            'ra_footer_email' => 'hello@resonance-academy.local',
            'ra_footer_phone' => '+1 (555) 010-8240',
            'ra_footer_address' => "Resonance Hall\n42B Harding Mews\nLondon E2 0HA",
            'ra_footer_hours' => "Mon–Fri · 9am–7pm\nSat · 10am–4pm\nSun · Closed",
            'ra_social_instagram' => '',
            'ra_social_youtube' => '',
            'ra_social_spotify' => '',
            'ra_social_facebook' => '',
        ];
    }

    /**
     * Field specs: setting key → label, field type, sanitize callback.
     *
     * @return array<string, array{0: string, 1: string, 2: string}>
     */
    private static function fields(): array
    {
        return [
            'ra_cta_text' => [__('Header — call-to-action label', 'ra-theme'), 'text', 'text'],
            'ra_cta_url' => [__('Header — call-to-action link', 'ra-theme'), 'url', 'url'],
            'ra_footer_tagline' => [__('Footer — tagline', 'ra-theme'), 'text', 'text'],
            'ra_footer_email' => [__('Footer — email address', 'ra-theme'), 'text', 'text'],
            'ra_footer_phone' => [__('Footer — phone number', 'ra-theme'), 'text', 'text'],
            'ra_footer_address' => [__('Footer — street address (one line each)', 'ra-theme'), 'textarea', 'textarea'],
            'ra_footer_hours' => [__('Footer — opening hours (one line each)', 'ra-theme'), 'textarea', 'textarea'],
            'ra_social_instagram' => [__('Footer — Instagram URL', 'ra-theme'), 'url', 'url'],
            'ra_social_youtube' => [__('Footer — YouTube URL', 'ra-theme'), 'url', 'url'],
            'ra_social_spotify' => [__('Footer — Spotify URL', 'ra-theme'), 'url', 'url'],
            'ra_social_facebook' => [__('Footer — Facebook URL', 'ra-theme'), 'url', 'url'],
        ];
    }

    /**
     * Hook the Customizer registration.
     */
    public static function init(): void
    {
        add_action('customize_register', [self::class, 'register']);
    }

    /**
     * Merged value for a setting key (theme mod, falling back to default).
     */
    public static function value(string $key): string
    {
        return (string) get_theme_mod($key, self::defaults()[$key] ?? '');
    }

    /**
     * Configured social network → URL map; unconfigured networks are skipped.
     *
     * @return array<string, string>
     */
    public static function socials(): array
    {
        $socials = [];

        foreach (['instagram', 'youtube', 'spotify', 'facebook'] as $network) {
            $url = HeaderFooter::value("ra_social_{$network}");

            if ($url !== '') {
                $socials[$network] = $url;
            }
        }

        return $socials;
    }

    /**
     * Address/hours text areas split into trimmed, non-empty lines.
     *
     * @return list<string>
     */
    public static function lines(string $key): array
    {
        $raw = array_map('trim', explode("\n", (string) HeaderFooter::value($key)));

        return array_values(array_filter($raw, static fn (string $line): bool => $line !== ''));
    }

    /**
     * Register section, settings and controls.
     *
     * @param  \WP_Customize_Manager  $manager
     */
    public static function register($manager): void
    {
        $manager->add_section(self::SECTION, [
            'title' => __('Resonance — Header & Footer', 'ra-theme'),
            'priority' => 40,
        ]);

        foreach (self::fields() as $key => [$label, $type, $sanitizer]) {
            $manager->add_setting($key, [
                'type' => 'theme_mod',
                'default' => self::defaults()[$key],
                'sanitize_callback' => match ($sanitizer) {
                    'url' => 'esc_url_raw',
                    'textarea' => 'sanitize_textarea_field',
                    default => 'sanitize_text_field',
                },
            ]);

            $manager->add_control($key, [
                'label' => $label,
                'section' => self::SECTION,
                'type' => $type,
            ]);
        }
    }
}
