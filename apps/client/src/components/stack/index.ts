/**
 * Stack Components Library
 * 
 * Reusable layout components with clear naming convention:
 * - StackRowComponent/StackColComponent: Base direction
 * - Align[Start|CenterComponent|End]: alignItems property
 * - Jus[CenterComponent|End|Between]: justifyContent property
 * 
 * Examples:
 * - StackRowComponent: Basic horizontal stack (align center)
 * - StackRowJusBetweenComponent: Horizontal with space-between
 * - StackRowAlignStartJusCenterComponent: Horizontal, align start, justify center
 * - StackColAlignCenterJusCenterComponent: Vertical, fully centered
 */

// Row variants
export {
    StackRowComponent,
    StackRowAlignStartComponent,
    StackRowAlignEndComponent,
    StackRowJusCenterComponent,
    StackRowJusEndComponent,
    StackRowJusBetweenComponent,
    StackRowAlignStartJusCenterComponent,
    StackRowAlignStartJusEndComponent,
    StackRowAlignStartJusBetweenComponent,
    StackRowAlignEndJusCenterComponent,
    StackRowAlignEndJusEndComponent,
    StackRowAlignEndJusBetweenComponent,
} from './stack-row.component';

// Column variants
export {
    StackColComponent,
    StackColAlignStartComponent,
    StackColAlignCenterComponent,
    StackColAlignEndComponent,
    StackColJusCenterComponent,
    StackColJusEndComponent,
    StackColJusBetweenComponent,
    StackColAlignCenterJusCenterComponent,
    StackColAlignCenterJusEndComponent,
    StackColAlignCenterJusBetweenComponent,
    StackColAlignStartJusCenterComponent,
    StackColAlignStartJusEndComponent,
    StackColAlignStartJusBetweenComponent,
    StackColAlignEndJusCenterComponent,
    StackColAlignEndJusEndComponent,
    StackColAlignEndJusBetweenComponent,
} from './stack-col.component';

export { CenterComponent } from './center.component';
export { HStackComponent } from './h-stack.component';
export { VStackComponent } from './v-stack.component';
export { SpaceBetweenComponent } from './space-between.component';
