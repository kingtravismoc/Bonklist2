
import { Component, input, signal, effect } from '@angular/core';
import { IconComponent } from '../icon.component';
import { BonklistEntry } from '../../services/types';

@Component({
  selector: 'app-viewer-3d',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col items-center shadow-md flex-grow min-h-[420px]">
      <h3 class="text-lg font-semibold mb-4 text-[#e6edf3] flex items-center gap-2 w-full">
        <app-icon name="Globe" [size]="18" /> Face Mesh Scanner
      </h3>

      @if (entry(); as e) {
        <div class="relative w-64 h-64 bg-[#0d1117] rounded-full border-2 border-[#30363d] flex items-center justify-center overflow-hidden mb-4 relative">
          <!-- Scan Grid Animation -->
          @if (scanPhase() === 1) {
            <div class="absolute inset-0 z-20 pointer-events-none mix-blend-overlay">
              @for (i of [1,2,3,4]; track i) {
                <div class="absolute w-full h-[1px] bg-[#00ffdd] top-[{{i*20}}%] animate-scan-grid shadow-[0_0_5px_#00ffdd]" [style.animation-delay]="i * 0.1 + 's'"></div>
                <div class="absolute h-full w-[1px] bg-[#00ffdd] left-[{{i*20}}%] animate-scan-grid shadow-[0_0_5px_#00ffdd]" [style.animation-delay]="(i * 0.1 + 0.5) + 's'"></div>
              }
            </div>
          }

          <!-- HUD Overlay -->
          <div class="absolute inset-0 z-10 pointer-events-none opacity-40">
             <svg viewBox="0 0 200 200" class="w-full h-full">
                <circle cx="100" cy="100" r="95" fill="none" stroke="#30363d" stroke-dasharray="5,5" />
                <line x1="100" y1="5" x2="100" y2="20" stroke="#00e0b3" stroke-width="2" />
                <line x1="100" y1="180" x2="100" y2="195" stroke="#00e0b3" stroke-width="2" />
                <line x1="5" y1="100" x2="20" y2="100" stroke="#00e0b3" stroke-width="2" />
                <line x1="180" y1="100" x2="195" y2="100" stroke="#00e0b3" stroke-width="2" />
             </svg>
          </div>

          <!-- The "Mesh" (SVG) -->
          <svg viewBox="0 0 200 200" class="w-48 h-48 transition-transform duration-1000" [class.animate-rotate-mesh]="scanPhase() === 1" [style.opacity]="scanPhase() === 1 ? 0.5 : 1">
             <defs>
                <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00e0b3" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#80c8ff" stopOpacity="0.1"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Wireframe Head -->
              <ellipse cx="100" cy="100" rx="60" ry="80" fill="url(#faceGradient)" stroke="#00e0b3" stroke-width="0.5" opacity="0.6" filter="url(#glow)"/>
              
              <!-- Grid Lines on Face -->
              @for (i of [0,1,2,3,4,5,6,7,8,9]; track i) {
                 <path [attr.d]="'M ' + (40 + i*2) + ' ' + (30 + i * 15) + ' Q 100 ' + (40 + i * 15) + ' ' + (160 - i*2) + ' ' + (30 + i * 15)" stroke="#00e0b3" stroke-width="0.2" fill="none" opacity="0.4" />
              }
              <line x1="100" y1="20" x2="100" y2="180" stroke="#00e0b3" stroke-width="0.5" opacity="0.5" />

              <!-- Eyes -->
              <g>
                <circle cx="80" cy="85" r="6" fill="#0d1117" stroke="#00e0b3" stroke-width="1" opacity="0.8"/>
                <circle cx="120" cy="85" r="6" fill="#0d1117" stroke="#00e0b3" stroke-width="1" opacity="0.8"/>
                
                <!-- Scanning Reticles -->
                @if (scanPhase() >= 2) {
                  <circle cx="80" cy="85" r="3" fill="#ff6b6b" class="animate-pulse">
                     <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="120" cy="85" r="3" fill="#ff6b6b" class="animate-pulse" style="animation-delay: 0.2s">
                     <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
                  </circle>
                }
              </g>

              <!-- Vision Implant Visuals -->
              @if (scanPhase() === 3 && e.visionImplantDetected) {
                <g class="animate-pulse-border">
                   <circle cx="120" cy="85" r="10" fill="none" stroke="#ff3b3b" stroke-width="2" stroke-dasharray="3,2" />
                   <line x1="128" y1="80" x2="160" y2="50" stroke="#ff3b3b" stroke-width="1" />
                   <rect x="160" y="40" width="35" height="12" fill="#300" stroke="#ff3b3b" stroke-width="1" />
                   <text x="162" y="49" fill="#ff3b3b" font-size="8" font-family="monospace">IMPLANT</text>
                </g>
              }
              
              <!-- Warning Overlay -->
              @if (e.filterStatus === 'bypassed') {
                 <rect x="10" y="10" width="180" height="180" fill="none" stroke="#ff3b3b" stroke-width="4" stroke-dasharray="20,10" class="animate-pulse-border opacity-50" />
              }
          </svg>
        </div>

        <div class="text-center w-full">
           <h4 class="text-lg font-bold text-white">
             @if (scanPhase() === 0) { TARGET ACQUIRED }
             @else if (scanPhase() === 1) { GENERATING MESH... }
             @else if (scanPhase() === 2) { ANALYZING BIOMETRICS... }
             @else { {{ e.scannedPerson | uppercase }} }
           </h4>
           <p class="text-xs font-mono text-gray-500 mb-4">{{ e.deviceId }}</p>

           @if (scanPhase() === 0) {
             <button 
               (click)="runScan()"
               class="px-6 py-2 rounded font-bold transition-colors text-sm bg-[#34e89e] text-black hover:bg-green-400"
             >
               Initiate Deep Scan
             </button>
           } @else if (scanPhase() === 3) {
              <div class="mt-2 w-full bg-[#0d1117] rounded border border-[#30363d] overflow-hidden">
                <div class="bg-[#1a2436] px-3 py-2 border-b border-[#30363d] flex justify-between items-center">
                   <span class="text-xs font-bold text-[#80c8ff]">IDENTITY TRACEBACK</span>
                   <app-icon name="CheckCircle" [size]="14" color="#00e0b3" />
                </div>
                <div class="p-3 text-left text-xs font-mono space-y-2">
                   <div class="flex justify-between border-b border-white/10 pb-1">
                      <span class="text-gray-400">Operator:</span>
                      <span class="text-white font-bold">{{ e.scannedPerson }}</span>
                   </div>
                   <div class="flex justify-between border-b border-white/10 pb-1">
                      <span class="text-gray-400">Proximity:</span>
                      <span class="text-[#34e89e]">0.4m (Immediate)</span>
                   </div>
                   <div class="flex justify-between border-b border-white/10 pb-1">
                      <span class="text-gray-400">Status:</span>
                      <span class="text-[#34e89e] animate-pulse">OPERATING DEVICE</span>
                   </div>
                   <div class="flex justify-between items-center pt-1">
                      <span class="text-gray-400">Vision Implant:</span>
                      @if (e.visionImplantDetected) {
                        <span class="text-[#ff3b3b] font-bold bg-red-900/30 px-1 rounded border border-red-900">DETECTED</span>
                      } @else {
                        <span class="text-gray-500">NONE</span>
                      }
                   </div>
                </div>
              </div>
           } @else {
             <div class="h-8 flex items-center justify-center gap-2">
                <div class="w-2 h-2 bg-[#00e0b3] rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-[#00e0b3] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-[#00e0b3] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
             </div>
           }
        </div>

      } @else {
        <div class="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
           <app-icon name="Layers" [size]="40" className="opacity-20" />
           <p class="text-sm">Select a log entry to load mesh.</p>
        </div>
      }
    </div>
  `
})
export class Viewer3dComponent {
  entry = input<BonklistEntry | null>(null);
  
  // 0: Idle, 1: Mesh Scan, 2: Biometric Analysis, 3: Complete
  scanPhase = signal<0 | 1 | 2 | 3>(0);

  constructor() {
    effect(() => {
      this.entry(); 
      this.scanPhase.set(0);
    });
  }

  runScan() {
    this.scanPhase.set(1); // Start Mesh Scan
    
    setTimeout(() => {
      this.scanPhase.set(2); // Analyze Biometrics
    }, 2000);

    setTimeout(() => {
      this.scanPhase.set(3); // Complete
    }, 4000);
  }
}
