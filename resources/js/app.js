/**
 * Resonance Academy front-end bootstrap.
 * Each behavior exports init(); reduced-motion behavior lives inside them.
 */
import { domReady } from './behaviors/dom-ready'

import * as anchors from './behaviors/anchors'
import * as catalog from './behaviors/catalog'
import * as count from './behaviors/count'
import * as drawpath from './behaviors/drawpath'
import * as header from './behaviors/header'
import * as heroWave from './behaviors/hero-wave'
import * as marquee from './behaviors/marquee'
import * as programs from './behaviors/programs'
import * as reveal from './behaviors/reveal'
import * as scroller from './behaviors/scroller'
import * as slider from './behaviors/slider'

domReady(() => {
  anchors.init()
  reveal.init()
  header.init()
  heroWave.init()
  count.init()
  marquee.init()
  programs.init()
  scroller.init()
  slider.init()
  drawpath.init()
  catalog.init()
})
