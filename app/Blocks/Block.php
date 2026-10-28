<?php

declare(strict_types=1);

namespace App\Blocks;

/**
 * Abstract base for the academy's native Gutenberg blocks.
 *
 * Every block is metadata-driven (block.json shipped with the editor
 * bundle), saves no markup, and renders server-side through a Blade view
 * so front-end markup stays templated and composer-dependent.
 */
abstract class Block
{
    /**
     * Register the block type from its block.json metadata.
     */
    public function register(): void
    {
        register_block_type_from_metadata(
            Block::blockJsonPath($this->kebab()),
            [
                'render_callback' => [$this, 'render'],
            ],
        );
    }

    /**
     * Server-side render: pass block data into the Blade view.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function render(array $attributes, string $content = ''): string
    {
        return view($this->view(), $this->data($attributes, $content))->render();
    }

    /**
     * View the block renders (Blade relative name).
     */
    abstract protected function view(): string;

    /**
     * Data handed to the Blade view.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    abstract protected function data(array $attributes, string $content): array;

    /**
     * Kebab-case block name for the child class (Hero → hero).
     */
    protected function kebab(): string
    {
        $class = substr(static::class, (int) strrpos(static::class, '\\') + 1);

        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $class) ?? $class);
    }

    /**
     * Absolute path of a block's block.json from the editor bundle.
     */
    private static function blockJsonPath(string $kebab): string
    {
        return \dirname(__DIR__, 2) . "/resources/js/blocks/{$kebab}/block.json";
    }
}
