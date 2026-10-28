/**
 * Resonance Academy front-end bootstrap.
 * Each behavior exports init(); reduced-motion behavior lives inside them.
 */
import { domReady } from './behaviors/dom-ready'

import * as count from './behaviors/count'
import * as drawpath from './behaviors/drawpath'
import * as heroWave from './behaviors/hero-wave'
import * as marquee from './behaviors/marquee'
import * as reveal from './behaviors/reveal'
import * as scroll from './behaviors/scroll'
import * as vinyl from './behaviors/vinyl'

domReady(() => {
  scroll.init()
  reveal.init()
  heroWave.init()
  count.init()
  marquee.init()
  vinyl.init()
  drawpath.init()
})
