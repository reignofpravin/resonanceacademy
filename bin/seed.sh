#!/usr/bin/env bash
# Resonance Academy — idempotent demo seed.
# Safe to re-run: every step checks before it writes.
set -uo pipefail

SITE="${RA_SITE:-/Users/reign/Local Sites/resonance-academy}"
PHPCLI="${RA_PHPCLI:-$HOME/Library/Application Support/Local/lightning-services/php-8.5.12+0/bin/darwin-arm64/bin/php}"
DBSOCK="${RA_DBSOCK:-$HOME/Library/Application Support/Local/run/PVjOK9BhZ/mysql/mysqld.sock}"
URL="https://resonance-academy.local"

wp() {
  "$PHPCLI" \
    -d "mysqli.default_socket=$DBSOCK" \
    -d "pdo_mysql.default_socket=$DBSOCK" \
    "$SITE/tools/wp-cli.phar" --path="$SITE/app/public" --url="$URL" "$@" 2>/dev/null | grep -v '^Deprecated:'
}

post_id() { # (post_type, title) → id or empty
  wp post list --post_type="$1" --title="$2" --format=ids
}

ensure_post() { # (post_type, title, extra args…) → id
  local id type title
  type="$1"
  title="$2"
  shift 2
  id="$(post_id "$type" "$title")"
  if [ -z "$id" ]; then
    id="$(wp post create --post_type="$type" --post_title="$title" --post_status=publish "$@" --porcelain)"
    echo "created $type: $title (#$id)" >&2
  fi
  echo "$id"
}

set_meta() { # (id, key, value)
  wp post meta update "$1" "$2" "$3" >/dev/null
}

# ---------------------------------------------------------------- courses
course_rows=(
  "Piano Foundations|foundation|beginner|12 weeks|group|piano|10-week journey covering posture, chord voicings and your first arrangements."
  "Cello & Strings Ensemble|strings|intermediate|16 weeks|hybrid|cello,violin|Weekly ensemble work with seasonal performances; private coaching on the side."
  "Electronic Production Lab|production|beginner|10 weeks|group|production,keyboard|DAW fluency, synthesis fundamentals and a finished EP by the final session."
  "Voice & Breathing Method|voice|advanced|8 weeks|private|voice|Breath-first singing technique; one-on-one lessons recorded and reviewed."
  "Guitar Craft, Electric|guitar|intermediate|14 weeks|group|guitar|Rhythm feel, tone shaping and improvisation, culminating in a showcase band."
  "Theory Through Listening|theory|advanced|12 weeks|hybrid|piano,theory,production|Ear-led harmony and analysis instead of sight-reading drills."
)
for row in "${course_rows[@]}"; do
  IFS='|' read -r title cat level dur format instrs excerpt <<<"$row"
  id="$(ensure_post course "$title" --post_excerpt="$excerpt")"
  wp post term set "$id" course_category "$cat" >/dev/null
  set_meta "$id" ra_course_level "$level"
  set_meta "$id" ra_course_duration "$dur"
  set_meta "$id" ra_course_format "$format"
  for i in $(tr ',' '\n' <<<"$instrs"); do wp post term set "$id" instrument "$i" >/dev/null; done
done

# ------------------------------------------------------------- instructors
instructor_rows=(
  "Maya Cruz|Head of Piano|piano,keyboard|Concert pianist turned teacher; the academy's technique pillar."
  "Anton Petrov|Strings Chair|cello,violin|Principal cello of the city chamber orchestra."
  "Lena Okafor|Modern Composition|production,keyboard,theory|Producer and scoring artist for short film."
  "Rafael Duarte|Head of Guitar|guitar|Session guitarist with fifteen recorded album credits."
  "Hana Sato|Vocal Method Lead|voice|Breathing specialist and jazz vocalist."
  "Tomas Lindqvist|Theory Faculty|theory,piano|Ear-training evangelist; publishes the Resonance Listening Series."
  "Amara Diallo|Percussion & Rhythm|production,keyboard|Rhythm studies, Ableton performance and club improvisation."
  "Nina Ferreira|Creative Director|guitar,voice|Runs the recital programme and student recordings."
)
for row in "${instructor_rows[@]}"; do
  IFS='|' read -r title role instrs excerpt <<<"$row"
  id="$(ensure_post instructor "$title" --post_excerpt="$excerpt")"
  set_meta "$id" ra_instructor_role "$role"
  for i in $(tr ',' '\n' <<<"$instrs"); do wp post term set "$id" instrument "$i" >/dev/null; done
done

# ----------------------------------------------------------------- events
# (The past masterclass seeded during Task 11 verification is left in place.)
future_dates=(
  "$(date -v+20d +%Y-%m-%d) 19:30|Autumn Recital Season Opening|concert|Resonance Hall|https://resonance-academy.local/tickets/"
  "$(date -v+34d +%Y-%m-%d) 18:00|Cello & Strings Ensemble Night|concert|Resonance Hall|https://resonance-academy.local/tickets/"
  "$(date -v+48d +%Y-%m-%d) 14:00|Open Masterclass: Breath & Voice|masterclass|Studio B|"
  "$(date -v+62d +%Y-%m-%d) 17:30|Foundation Group Showcase|showcase|Resonance Hall|"
)
for row in "${future_dates[@]}"; do
  IFS='|' read -r when title vtype venue tickets <<<"$row"
  id="$(ensure_post event "$title")"
  set_meta "$id" ra_event_datetime "$when"
  set_meta "$id" ra_event_venue "$venue"
  if [ -n "$tickets" ]; then set_meta "$id" ra_event_ticket_url "$tickets"; fi
  wp post term set "$id" event_type "$vtype" >/dev/null
done

# -------------------------------------------------------------------- cf7
FORM_ID="$(wp post list --post_type=wpcf7_contact_form --format=ids | head -1)"
if [ -n "$FORM_ID" ]; then
  wp post update "$FORM_ID" --post_title="Resonance enquiry" >/dev/null
fi

# -------------------------------------------------------------- home page
HOME_ID="$(post_id page Home)"
if [ -z "$HOME_ID" ]; then
  HOME_ID="$(wp post create --post_type=page --post_title=Home --post_status=publish --porcelain)"
fi

WP_BLOCKS='<!-- wp:ra/hero /-->
<!-- wp:ra/stats /-->
<!-- wp:ra/programs /-->
<!-- wp:ra/method /-->
<!-- wp:ra/instructors /-->
<!-- wp:ra/marquee /-->
<!-- wp:ra/events /-->
<!-- wp:ra/testimonials /-->
<!-- wp:ra/faq /-->
<!-- wp:ra/contact /-->'

wp post update "$HOME_ID" --post_content="$WP_BLOCKS" >/dev/null
wp option update show_on_front page >/dev/null
wp option update page_on_front "$HOME_ID" >/dev/null

# ------------------------------------------------------------------ menus
PRIM_ID="$(wp menu list --format=csv | awk -F, '$2=="Primary"{print $1}')"
FOOT_ID="$(wp menu list --format=csv | awk -F, '$2=="Footer"{print $1}')"
wp menu location assign "$PRIM_ID" primary_navigation >/dev/null
wp menu location assign "$FOOT_ID" footer_navigation >/dev/null

echo "Seed complete."
