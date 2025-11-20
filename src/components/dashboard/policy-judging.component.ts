import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../icon.component';
import { QuarantineItem } from '../../services/types';

@Component({
  selector: 'app-policy-judging',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col shadow-md flex-grow">
      <!-- Tabs -->
      <div class="flex border-b border-[#30363d] mb-4">
        <button 
          class="px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2"
          [class.border-[#00e0b3]]="activeTab() === 'judging'"
          [class.text-[#00e0b3]]="activeTab() === 'judging'"
          [class.border-transparent]="activeTab() !== 'judging'"
          [class.text-gray-400]="activeTab() !== 'judging'"
          (click)="activeTab.set('judging')"
        >
          <app-icon name="Users" [size]="16" /> Judging Quarantine ({{ items().length }})
        </button>
        <button 
          class="px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2"
          [class.border-[#00e0b3]]="activeTab() === 'ai'"
          [class.text-[#00e0b3]]="activeTab() === 'ai'"
          [class.border-transparent]="activeTab() !== 'ai'"
          [class.text-gray-400]="activeTab() !== 'ai'"
          (click)="activeTab.set('ai')"
        >
          <app-icon name="Brain" [size]="16" /> AI Ban Policy Engine
        </button>
      </div>

      <!-- Content -->
      <div class="flex-grow overflow-y-auto pr-1 max-h-[400px]">
        @if (activeTab() === 'ai') {
          <div class="flex flex-col gap-3">
            <h3 class="text-lg font-bold text-[#e6edf3]">Generative AI Punishment Scale</h3>
            <p class="text-sm text-[#8a98b0]">AI analyzes attack vectors against established precedents.</p>
            <div class="flex flex-col gap-2 mt-2">
              <div class="bg-[#0d1117] p-3 border-l-4 border-[#30363d] rounded-r text-sm">
                <strong class="text-[#ffa657]">RF Modulated Hack:</strong> 30 Day Ban (Critical)
              </div>
              <div class="bg-[#0d1117] p-3 border-l-4 border-[#30363d] rounded-r text-sm">
                <strong class="text-[#ff6b6b]">Full Drive Deletion:</strong> Permanent Ban (Catastrophic)
              </div>
              <div class="bg-[#0d1117] p-3 border-l-4 border-[#30363d] rounded-r text-sm">
                 <strong>Unauthorized SSH:</strong> 12 Hour Ban (Medium)
              </div>
            </div>
          </div>
        } @else {
          @if (items().length === 0) {
             <p class="text-center text-gray-500 mt-8">Quarantine queue is empty.</p>
          }
          @for (item of items(); track item.id) {
            <div class="bg-[#1a2436] p-4 rounded-lg border border-[#2d3b50] mb-3">
              <div class="flex flex-col gap-1 mb-3">
                <strong class="text-[#80c8ff] font-mono">{{ item.ip }}</strong>
                <span class="text-sm text-gray-300">Action: <strong>{{ item.suspectedAction }}</strong></span>
                <span class="text-xs text-gray-400">AI Confidence: {{ (item.aiConfidence * 100).toFixed(0) }}%</span>
                <span class="text-xs text-gray-400">
                  Verdict: <span class="text-[#34e89e]">{{ item.userConfirmations }} Confirm</span> / <span class="text-[#ff6b6b]">{{ item.userDenials }} Deny</span>
                </span>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 bg-[#522525] text-[#ff6b6b] py-2 rounded flex items-center justify-center gap-2 hover:bg-opacity-80 transition text-sm font-bold" (click)="deny.emit(item.id)">
                  <app-icon name="XCircle" [size]="16" /> Deny
                </button>
                <button class="flex-1 bg-[#1e4d3f] text-[#34e89e] py-2 rounded flex items-center justify-center gap-2 hover:bg-opacity-80 transition text-sm font-bold" (click)="confirm.emit(item.id)">
                  <app-icon name="CheckCircle" [size]="16" /> Confirm
                </button>
              </div>
            </div>
          }
        }
      </div>

      <!-- Integrity Check -->
      <div class="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mt-4 text-center">
        <p class="text-xs text-gray-500 uppercase tracking-widest mb-1">Distributed P2P Integrity Check</p>
        <p class="text-xs text-gray-400 font-mono break-all mb-3">UID: <span class="text-[#00e0b3]">{{ userUID() }}</span></p>
        <button 
          (click)="runIntegrityCheck.emit()"
          class="bg-teal-900/50 hover:bg-teal-800 text-[#00ffdd] border border-teal-700 px-4 py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2 w-full"
        >
           <app-icon name="RefreshCcw" [size]="14" /> Run Integrity Analysis (Phi-3)
        </button>
      </div>
    </div>
  `
})
export class PolicyJudgingComponent {
  items = input.required<QuarantineItem[]>();
  userUID = input.required<string>();
  confirm = output<string>();
  deny = output<string>();
  runIntegrityCheck = output<void>();

  activeTab = signal<'judging' | 'ai'>('judging');
}