/**
 * Resonance Academy front-end bootstrap.
 * Each behavior exports init(); reduced-motion behavior lives inside them.
 */
import { domReady } from './behaviors/dom-ready'

import * as count from './behaviors/count'
import * as drawpath from './behaviors/drawpath'
import * as birds from './behaviors/birds'
import * as header from './behaviors/header'
import * as heroWave from './behaviors/hero-wave'
import * as marquee from './behaviors/marquee'
import * as reveal from './behaviors/reveal'
import * as scroll from './behaviors/scroll'
import * as scroller from './behaviors/scroller'
import * as slider from './behaviors/slider'
import * as vinyl from './behaviors/vinyl'

domReady(() => {
  scroll.init()
  reveal.init()
  birds.init()
  header.init()
  heroWave.init()
  count.init()
  marquee.init()
  vinyl.init()
  scroller.init()
  slider.init()
  drawpath.init()
})
