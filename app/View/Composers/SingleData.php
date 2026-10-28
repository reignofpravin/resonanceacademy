<?php

declare(strict_types=1);

namespace App\View\Composers;

use App\PostTypes\Meta;

/**
 * Aggregates current-post context for the single-* templates in one call so
 * the templates stay single-directive Blade (inline @php expressions only;
 * nested @php blocks break Acorn's compiler pass).
 */
final class SingleData
{
    /**
     * Post-type-specific context for the given post.
     *
     * @return array<string, mixed>
     */
    public static function collect(int $postId): array
    {
        $data = [
            'id' => $postId,
            'content' => apply_filters('the_content', get_the_content(null, false, $postId)),
        ];

        switch (get_post_type($postId)) {
            case 'course':
                $data['level'] = Meta::get('ra_course_level', $postId);
                $data['duration'] = Meta::get('ra_course_duration', $postId);
                $data['format'] = Meta::get('ra_course_format', $postId);
                $data['instruments'] = self::termNames($postId, 'instrument');
                $data['related'] = self::sharesInstrument($postId, $data['instruments'], 'instructor');
                $data['relatedLabel'] = __('Faculty on this course', 'ra-theme');
                $data['relatedArchive'] = get_post_type_archive_link('course');
                $data['archiveLabel'] = __('Programs', 'ra-theme');
                break;

            case 'instructor':
                $data['role'] = Meta::get('ra_instructor_role', $postId);
                $data['instruments'] = self::termNames($postId, 'instrument');
                $data['related'] = self::sharesInstrument($postId, $data['instruments'], 'course');
                $data['relatedLabel'] = __('Courses', 'ra-theme');
                $data['relatedArchive'] = get_post_type_archive_link('instructor');
                $data['archiveLabel'] = __('Faculty', 'ra-theme');
                break;

            case 'event':
                $data['types'] = self::termNames($postId, 'event_type');
                $data['venue'] = Meta::get('ra_event_venue', $postId);
                $data['ticketUrl'] = Meta::get('ra_event_ticket_url', $postId);

                $raw = Meta::get('ra_event_datetime', $postId);
                $when = $raw !== '' ? \DateTime::createFromFormat('Y-m-d H:i', $raw, wp_timezone()) : false;
                $data['when'] = $when instanceof \DateTime ? $when : null;
                $data['whenFormatted'] = $when instanceof \DateTime
                    ? wp_date(get_option('date_format') . ' · g:i a', $when->format('U'))
                    : '';
                $data['relatedArchive'] = get_post_type_archive_link('event');
                $data['archiveLabel'] = __('Calendar', 'ra-theme');
                break;
        }

        return $data;
    }

    /**
     * Term names attached to a post (empty list when none).
     *
     * @return list<string>
     */
    private static function termNames(int $postId, string $taxonomy): array
    {
        $terms = get_the_terms($postId, $taxonomy);

        if ($terms === false || is_wp_error($terms)) {
            return [];
        }

        return array_map(static fn ($term): string => $term->name, $terms);
    }

    /**
     * Recent post IDs of a type that share one of the current post's
     * instrument terms (course ↔ instructor cross-links).
     *
     * @param  list<string>  $instruments
     * @return list<int>
     */
    private static function sharesInstrument(int $postId, array $instruments, string $postType): array
    {
        if ($instruments === []) {
            return [];
        }

        $posts = get_posts([
            'post_type' => $postType,
            'posts_per_page' => 3,
            'post__not_in' => [$postId],
            'fields' => 'ids',
            'tax_query' => [[
                'taxonomy' => 'instrument',
                'field' => 'name',
                'terms' => $instruments,
                'operator' => 'IN',
            ]],
        ]);

        return array_map('intval', $posts);
    }
}
