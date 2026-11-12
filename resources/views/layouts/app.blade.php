<!doctype html>
<html @php(language_attributes())>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
      (function () {
        // Set before the first paint so entry reveals never flash visible-then-hidden.
        // Dropped again if the bundle never boots, so content can't stay stuck hidden.
        var root = document.documentElement
        root.classList.add('has-js')
        window.setTimeout(function () {
          if (!root.dataset.raRevealReady) root.classList.remove('has-js')
        }, 2500)

        // Hold on to a deep-link fragment and strip it before the browser can
        // run its own fragment scroll. That scroll measures the sticky header
        // at its tall height, so it stops ~52px under the collapsed header;
        // anchors.ts replays the jump once layout has settled.
        if (window.location.hash) {
          window.__raInitialHash = window.location.hash
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      })()
    </script>
    @php(do_action('get_header'))
    @php(wp_head())

    @vite(['resources/scss/main.scss', 'resources/js/app.js'])
  </head>

  <body @php(body_class())>
    @php(wp_body_open())

    <a class="c-skip-link" href="#main-content">
      {{ __('Skip to content', 'ra-theme') }}
    </a>

    @include('sections.header')

    <main id="main-content" class="m-site-main" tabindex="-1">
      @yield('content')
    </main>

    @include('sections.footer')

    @php(do_action('get_footer'))
    @php(wp_footer())
  </body>
</html>
