import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconComponent } from '../icon.component';
import { IncomingRequest } from '../../services/types';

@Component({
  selector: 'app-incoming-stream',
  standalone: true,
  imports: [IconComponent, DatePipe],
  template: `
    <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col shadow-md h-full overflow-hidden">
      <h3 class="text-xl font-semibold mb-4 text-[#00e0b3]">Incoming P2P Traffic</h3>
      <div class="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        @for (req of requests(); track req.id) {
          <div
            class="bg-[#1a2436] p-3 rounded-lg border border-[#2d3b50] cursor-pointer flex items-center gap-2 font-mono transition-colors hover:bg-[#2a3b57] hover:border-[#00e0b3] text-sm"
            (click)="select.emit(req)"
          >
            <app-icon name="Zap" [size]="16" />
            <span class="ml-2">
              {{ req.timestamp | date:'mediumTime' }} - {{ req.sourceIp }} 
              <span [class]="getTypeColor(req.type)">({{ req.type }})</span>
            </span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
  `]
})
export class IncomingStreamComponent {
  requests = input.required<IncomingRequest[]>();
  select = output<IncomingRequest>();

  getTypeColor(type: string): string {
    switch(type) {
      case 'SCAN': return 'text-yellow-400';
      case 'EXPLOIT': return 'text-red-500';
      case 'AUTH': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }
}