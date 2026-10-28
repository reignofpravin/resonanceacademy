import recessOrder from 'stylelint-config-recess-order'
import standard from 'stylelint-config-standard'

// Resonance Academy — SCSS rules for resources/scss.
export default {
  extends: [
    standard,
    recessOrder,
  ],
  plugins: ['stylelint-scss'],
  rules: {
    'scss/comment-no-loud': null,
    'custom-property-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    'alpha-value-notation': 'percentage',
    'color-function-notation': 'modern',
    'import-notation': null,
    'selector-class-pattern': '^(c|js|u|is|m)-[a-z][a-z0-9-]*(__[a-z0-9-]+)?(--[a-z0-9-]+)?( [^\\s:]+)?$|^[a-z][a-z0-9-]*$|^&|^[w][a-z-]+-|^[a-z][a-z0-9]+(-[a-z0-9]+)*$',
    'scss/comment-no-empty': null,
    'at-rule-empty-line-before': null,
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
  },
}
