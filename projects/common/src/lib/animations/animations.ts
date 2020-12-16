import {
    trigger,
    state,
    style,
    transition,
    animate
   } from '@angular/animations';

  export const onSideNavOpenClose = trigger('onSideNavOpenClose', [
    state('close',
      style({
        'max-width': '35px'
      })
    ),
    state('open',
      style({
        'max-width': '400px'
      })
    ),
    transition('close => open', animate('250ms ease-in')),
    transition('open => close', animate('250ms ease-in')),
  ]);

  export const onMainContentChange = trigger('onMainContentChange', [
    state('close',
      style({
        'margin-left': '62px'
      })
    ),
    state('open',
      style({
        'margin-left': '200px'
      })
    ),
    transition('close => open', animate('250ms ease-in')),
    transition('open => close', animate('250ms ease-in')),
  ]);

  export const animateText = trigger('animateText', [
    state('hide',
      style({
        display: 'none',
        opacity: 0,
      })
    ),
    state('show',
      style({
        display: 'block',
        opacity: 1,
      })
    ),
    transition('close => open', animate('350ms ease-in')),
    transition('open => close', animate('200ms ease-out')),
  ]);