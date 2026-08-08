import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/** Easing signature situs ini: cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE = 'signature';

CustomEase.create(EASE, 'M0,0 C0.16,1 0.3,1 1,1');

gsap.defaults({ ease: EASE, duration: 1 });

export { gsap, ScrollTrigger };
