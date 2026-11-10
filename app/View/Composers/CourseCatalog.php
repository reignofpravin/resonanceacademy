<?php

declare(strict_types=1);

namespace App\View\Composers;

/**
 * Aggregate data for the course catalog archive (archive-course.blade.php):
 * every published course as a filterable row plus the facet counts for the
 * filter bar (track / level / pathway), and the query-string state.
 */
final class CourseCatalog
{
    /**
     * Catalog state keys, each either 'all' or a sanitized term slug.
     *
     * @return array{track: string, level: string, path: string, q: string}
     */
    public static function state(): array
    {
        return [
            'track' => CourseCatalog::slug('track'),
            'level' => CourseCatalog::slug('level'),
            'path' => CourseCatalog::slug('path'),
            'q' => trim(wp_strip_all_tags((string) ($_GET['q'] ?? ''))),
        ];
    }

    /**
     * Sanitized slug from the query string ('' when absent or invalid).
     */
    private static function slug(string $key): string
    {
        $raw = (string) ($_GET[$key] ?? '');

        if ($raw === '' || $raw === 'all') {
            return '';
        }

        return sanitize_title($raw);
    }

    /**
     * Everything the catalog view needs.
     *
     * @return array{state: array<string, string>, total: int, groups: list<array<string, mixed>>, rows: list<array<string, mixed>>}
     */
    public static function collect(): array
    {
        $query = new \WP_Query([
            'post_type' => 'course',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => ['menu_order' => 'ASC', 'date' => 'ASC'],
            'no_found_rows' => true,
        ]);

        $rows = [];
        $counts = ['track' => [], 'level' => [], 'path' => []];
        $labels = ['track' => [], 'level' => [], 'path' => []];

        foreach ($query->posts as $course) {
            $id = (int) $course->ID;

            $facets = [
                'track' => CourseCatalog::facet($id, 'instrument'),
                'level' => CourseCatalog::facet($id, 'course_level'),
                'path' => CourseCatalog::facet($id, 'course_category'),
            ];

            foreach ($facets as $key => $terms) {
                foreach ($terms as $term) {
                    $labels[$key][$term['slug']] = $term['name'];
                    $counts[$key][$term['slug']] = ($counts[$key][$term['slug']] ?? 0) + 1;
                }
            }

            $excerpt = wp_strip_all_tags(get_the_excerpt($course));
            $title = wp_specialchars_decode(get_the_title($course), ENT_QUOTES);
            $trackNames = implode(', ', array_column($facets['track'], 'name'));
            $format = \App\PostTypes\Meta::get('ra_course_format', $id);

            $rows[] = [
                'id' => $id,
                'title' => $title,
                'url' => get_permalink($course),
                'format' => $format,
                'duration' => \App\PostTypes\Meta::get('ra_course_duration', $id),
                'levelName' => CourseCatalog::firstLevel($facets['level']),
                'excerpt' => $excerpt,
                'trackNames' => $trackNames,
                'search' => mb_strtolower($title . ' ' . $trackNames . ' ' . $excerpt, 'UTF-8'),
                // Facet slugs, used by the JS behavior for instant filtering.
                'track' => implode(' ', array_column($facets['track'], 'slug')),
                'level' => implode(' ', array_column($facets['level'], 'slug')),
                'path' => implode(' ', array_column($facets['path'], 'slug')),
            ];
        }

        $groups = [];
        $groups[] = CourseCatalog::group('track', __('Track', 'ra-theme'), $labels, $counts);
        $groups[] = CourseCatalog::group('level', __('Level', 'ra-theme'), $labels, $counts);
        $groups[] = CourseCatalog::group('path', __('Pathway', 'ra-theme'), $labels, $counts);

        return [
            'state' => CourseCatalog::state(),
            'total' => count($rows),
            'groups' => $groups,
            'rows' => $rows,
        ];
    }

    /**
     * One chip option per existing term slug in a facet, ordered by name.
     *
     * @param  array<string, array<string, string>>  $labels
     * @param  array<string, array<string, int>>  $counts
     * @return array{key: string, label: string, options: list<array{value: string, label: string, count: int}>}
     */
    private static function group(string $key, string $label, array $labels, array $counts): array
    {
        $slugs = array_keys($labels[$key] ?? []);
        sort($slugs, SORT_STRING | SORT_FLAG_CASE);

        $options = [];
        foreach ($slugs as $slug) {
            $options[] = [
                'value' => $slug,
                'label' => $labels[$key][$slug],
                'count' => $counts[$key][$slug] ?? 0,
            ];
        }

        return ['key' => $key, 'label' => $label, 'options' => $options];
    }

    /**
     * [{slug, name}] terms of one taxonomy attached to a post.
     *
     * @return list<array{slug: string, name: string}>
     */
    private static function facet(int $postId, string $taxonomy): array
    {
        $terms = get_the_terms($postId, $taxonomy);

        if ($terms === false || \is_wp_error($terms)) {
            return [];
        }

        $out = [];
        $seen = [];
        foreach ($terms as $term) {
            if (isset($seen[$term->slug])) {
                continue;
            }
            $seen[$term->slug] = true;
            $out[] = ['slug' => $term->slug, 'name' => $term->name];
        }

        usort($out, static fn (array $a, array $b): int => strcasecmp($a['name'], $b['name']));

        return $out;
    }

    /**
     * Natural level name for a course (first attached level term).
     *
     * @param  list<array{slug: string, name: string}>  $levels
     */
    private static function firstLevel(array $levels): string
    {
        return $levels[0]['name'] ?? '';
    }
}
