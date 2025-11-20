import { Component, input } from '@angular/core';
import { ThreatAnalysis } from '../../services/types';

@Component({
  selector: 'app-threat-analysis',
  standalone: true,
  template: `
    <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col shadow-md h-full">
      <h3 class="text-xl font-semibold mb-4 text-[#00e0b3]">Threat Analysis</h3>
      
      @if (threat(); as t) {
        <div class="flex flex-col gap-3 animate-pulse-border">
          <p class="text-sm"><strong class="text-gray-300">Threat IP:</strong> <span class="font-mono text-[#80c8ff] ml-2">{{ t.ip }}</span></p>
          <p class="text-sm">
            <strong class="text-gray-300">Threat Score:</strong> 
            <span class="text-2xl font-bold text-[#ff6b6b] ml-2">{{ t.score }}</span>
            <span class="text-gray-500 text-xs">/100</span>
          </p>
          <div class="bg-[#0d1117] p-3 rounded border border-[#30363d]">
            <strong class="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Details</strong>
            <p class="text-sm leading-relaxed">{{ t.details }}</p>
          </div>
          <p class="text-xs text-[#8a98b0] mt-2 italic border-l-2 border-[#30363d] pl-2">
            NOTE: This score determines ban severity and duration via the AI Policy Engine.
          </p>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center h-full text-[#8a98b0] opacity-50">
          <p>Select a request to analyze</p>
        </div>
      }
    </div>
  `
})
export class ThreatAnalysisComponent {
  threat = input<ThreatAnalysis | null>(null);
}