import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { OrchestratorService } from './services/orchestrator.service';
import { IconComponent } from './components/icon.component';
import { IncomingStreamComponent } from './components/dashboard/incoming-stream.component';
import { ThreatAnalysisComponent } from './components/dashboard/threat-analysis.component';
import { PolicyJudgingComponent } from './components/dashboard/policy-judging.component';
import { SignalProbeComponent } from './components/forensics/signal-probe.component';
import { Viewer3dComponent } from './components/forensics/viewer-3d.component';
import { IncomingRequest, ThreatAnalysis, BonklistEntry, BannedSubject } from './services/types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IconComponent, 
    IncomingStreamComponent, 
    ThreatAnalysisComponent, 
    PolicyJudgingComponent,
    SignalProbeComponent,
    Viewer3dComponent,
    DatePipe, UpperCasePipe
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  orchestrator = inject(OrchestratorService);

  // View State
  view = signal<'dashboard' | 'eepsite'>('dashboard');
  
  // Local Dashboard State
  selectedThreat = signal<ThreatAnalysis | null>(null);
  selectedBonklistEntry = signal<BonklistEntry | null>(null);
  
  // Eepsite State
  selectedBan = signal<BannedSubject | null>(null);

  constructor() {}

  // --- Dashboard Actions ---

  handleRequestSelect(req: IncomingRequest) {
    this.selectedThreat.set(this.orchestrator.generateMockAnalysis(req.sourceIp));
  }

  handleQuarantineConfirm(id: string) {
    this.orchestrator.voteQuarantine(id, 'confirm');
  }

  handleQuarantineDeny(id: string) {
    this.orchestrator.voteQuarantine(id, 'deny');
  }

  async handleIntegrityCheck() {
    const prompt = `High-priority request from user ${this.orchestrator.userUID()}: Analyze core script for malicious self-destruct hooks.`;
    
    // Simple browser alert simulation via console/overlay
    const result = await this.orchestrator.submitAnalysisRequest(prompt, 10);
    
    alert(`Distributed analysis complete.\nVerdict: ${result.verdict}\nExplanation: ${result.explanation}`);
    
    if (result.verdict === 'malicious') {
       this.orchestrator.triggerSelfDestruct();
    }
  }

  handleNewBonkEntry(entry: BonklistEntry) {
    this.orchestrator.addBonklistEntry(entry);
  }

  // --- Eepsite Helpers ---
  
  getMapPosition(lat: number, lon: number) {
    // Simple Mercator-ish projection for CSS %
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { top: `${y}%`, left: `${x}%` };
  }

  formatTimeLeft(end: Date | string) {
      const endDate = typeof end === "string" ? new Date(end) : end;
      const totalSeconds = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
      if (totalSeconds <= 0) return "Expired";
      if (totalSeconds > 9999 * 24 * 3600) return "Permanent";
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      return `${days}d ${hours}h`;
  }
}