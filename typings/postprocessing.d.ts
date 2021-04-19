declare module "postprocessing" {
  /**
   * A blend function enumeration.
   * @property SKIP - No blending. The effect will not be included in the final shader.
   * @property ADD - Additive blending. Fast, but may produce washed out results.
   * @property ALPHA - Alpha blending. Blends based on the alpha value of the new color.
   * @property AVERAGE - Average blending.
   * @property COLOR_BURN - Color burn.
   * @property COLOR_DODGE - Color dodge.
   * @property DARKEN - Prioritize darker colors.
   * @property DIFFERENCE - Color difference.
   * @property EXCLUSION - Color exclusion.
   * @property LIGHTEN - Prioritize lighter colors.
   * @property MULTIPLY - Color multiplication.
   * @property DIVIDE - Color division.
   * @property NEGATION - Color negation.
   * @property NORMAL - Normal blending. The new color overwrites the old one.
   * @property OVERLAY - Color overlay.
   * @property REFLECT - Color reflection.
   * @property SCREEN - Screen blending. The two colors are effectively projected on a white screen simultaneously.
   * @property SOFT_LIGHT - Soft light blending.
   * @property SUBTRACT - Color subtraction.
   */
  export enum BlendFunction {
    "SKIP",
    "ADD",
    "ALPHA",
    "AVERAGE",
    "COLOR_BURN",
    "COLOR_DODGE",
    "DARKEN",
    "DIFFERENCE",
    "EXCLUSION",
    "LIGHTEN",
    "MULTIPLY",
    "DIVIDE",
    "NEGATION",
    "NORMAL",
    "OVERLAY",
    "REFLECT",
    "SCREEN",
    "SOFT_LIGHT",
    "SUBTRACT",
  }
}
