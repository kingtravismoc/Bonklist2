
import { Component, output, signal } from '@angular/core';
import { IconComponent } from '../icon.component';
import { BonklistEntry } from '../../services/types';

// Helpers
const rand = (max: number) => Math.floor(Math.random() * max);
const sampleNames = ["John Doe", "Jane Smith", "Alex Chen", "Priya Sharma", "Wei Li", "Fatima Al-Hamad"];

@Component({
  selector: 'app-signal-probe',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col shadow-md">
      <h3 class="text-xl font-semibold mb-2 text-[#80c8ff] flex items-center gap-2">
        <app-icon name="Zap" [size]="20" /> Signal Probing
      </h3>
      <p class="text-xs text-[#8a98b0] mb-4">Run simulated RF probe to detect vulnerabilities and generate forensic record.</p>
      
      <div class="flex justify-center my-2">
        <button 
          (click)="startProbe()"
          [disabled]="isProbing()"
          class="relative bg-[#80c8ff] text-[#0d1117] font-bold py-3 px-8 rounded-lg transition-all hover:bg-[#66b3e0] disabled:bg-[#3f556d] disabled:cursor-not-allowed overflow-hidden"
        >
          @if (isProbing()) {
            <span class="relative z-10">Probing...</span>
            <div class="absolute top-0 left-0 h-full bg-white/20 animate-[spin_2s_linear_infinite] w-full origin-bottom-left"></div>
          } @else {
             Run Probe
          }
        </button>
      </div>
    </div>
  `
})
export class SignalProbeComponent {
  entryGenerated = output<BonklistEntry>();
  isProbing = signal(false);

  startProbe() {
    this.isProbing.set(true);
    setTimeout(() => {
      const rfSignature = Array.from({ length: 10 }, () => parseFloat((Math.random() * 0.9).toFixed(2)));
      let filterStatus: "bypassed" | "intact" = Math.random() > 0.5 ? 'bypassed' : 'intact';
      let detectedModulation: string | undefined = undefined;
      let timingDeviations: number[] = [];
      const personName = sampleNames[rand(sampleNames.length)];
      const visionImplantDetected = Math.random() < 0.2; // 20% chance of implant

      if (Math.random() < 0.3) {
        filterStatus = 'bypassed';
        detectedModulation = 'Simulated_QAM_Phase_Shift';
        timingDeviations = [-0.05, 0.02, -0.07];
      } else {
         detectedModulation = 'Simulated_FSK';
      }

      const newEntry: BonklistEntry = {
        deviceId: `scan_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        filterStatus,
        rfSignature,
        detectedModulation,
        timingDeviations,
        platformInfo: { clockRate: '24MHz', groundResonance: '60Hz hum' },
        meshFile: `mesh_${rand(100)}.obj`,
        skinToneCycle: true,
        scannedPerson: personName,
        visionImplantDetected
      };
      
      this.entryGenerated.emit(newEntry);
      this.isProbing.set(false);
    }, 1500);
  }
}
