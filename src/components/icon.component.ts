import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="strokeColor()"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="className()"
    >
      @switch (name()) {
        @case ('Shield') { <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> }
        @case ('Eye') {
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('Brain') {
           <path d="M15.5 17a5 5 0 0 0 .5-2.25c0-1.5-.42-2.9-1.33-4a.5.5 0 0 1 .42-.75c1-.08 1.94.7 2.45 2.14a5 5 0 0 0-.5 2.25c0 1.5.42 2.9 1.33 4a.5.5 0 0 1-.42.75c-1 .08-1.94-.7-2.45-2.14" />
           <path d="M16 16.5c-1.5-1-2.43-2.73-2.5-4.5a.5.5 0 0 1 .5-1.5c1.4.2 2.8-.83 3.4-2.26a5 5 0 0 0-3.32-2.7C13.2 5.3 12.8 4 12 4s-1.2.66-1.58 1.94a5 5 0 0 0-3.32 2.7C6.23 9.77 7.2 11.8 7.5 13.5a.5.5 0 0 1-.5 1.5c-1.5 1-2.43 2.73-2.5 4.5a.5.5 0 0 1 .5 1.5c1.4-.2 2.8.83 3.4 2.26a5 5 0 0 0 3.32-2.7c.38-1.28.8-2.67 1.58-1.94" />
           <path d="M12 16.5c-1.5-1-2.43-2.73-2.5-4.5a.5.5 0 0 1 .5-1.5c1.4.2 2.8-.83 3.4-2.26" />
        }
        @case ('Users') {
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        }
        @case ('CheckCircle') {
          <path d="M22 11.08V12a10 10 0 1 1-5.93-8.63" />
          <polyline points="22 4 12 14.01 9 11.01" />
        }
        @case ('XCircle') {
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        }
        @case ('Globe') {
           <circle cx="12" cy="12" r="10" />
           <line x1="2" y1="12" x2="22" y2="12" />
           <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        }
        @case ('Clock') {
           <circle cx="12" cy="12" r="10" />
           <polyline points="12 6 12 12 16 14" />
        }
        @case ('AlertOctagon') {
           <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
           <line x1="12" y1="8" x2="12" y2="12" />
           <line x1="12" y1="16" x2="12" y2="16" />
        }
        @case ('Zap') {
           <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        }
        @case ('Download') {
           <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
           <polyline points="7 10 12 15 17 10" />
           <line x1="12" y1="15" x2="12" y2="3" />
        }
        @case ('Layers') {
           <polygon points="12 2 2 7 12 12 22 7 12 2" />
           <polyline points="2 17 12 22 22 17" />
           <polyline points="2 12 12 17 22 12" />
        }
        @case ('Grid') {
           <rect x="3" y="3" width="7" height="7" />
           <rect x="14" y="3" width="7" height="7" />
           <rect x="14" y="14" width="7" height="7" />
           <rect x="3" y="14" width="7" height="7" />
        }
        @case ('Plus') {
           <line x1="12" y1="5" x2="12" y2="19" />
           <line x1="5" y1="12" x2="19" y2="12" />
        }
        @case ('RefreshCcw') {
           <polyline points="1 4 1 10 7 10" />
           <polyline points="23 20 23 14 17 14" />
           <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        }
      }
    </svg>
  `,
  changeDetection: 1
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('currentColor');
  className = input<string>('');
  
  strokeColor = computed(() => this.color());
}