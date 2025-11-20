import { Injectable, signal, computed, effect } from '@angular/core';
import { 
  IncomingRequest, ThreatAnalysis, BannedSubject, BonklistEntry, 
  QuarantineItem, AnalysisRequest, AnalysisResult 
} from './types';

// --- Mock Data Helpers ---
const rand = (max: number) => Math.floor(Math.random() * max);
const randomIp = () => `${rand(254) + 1}.${rand(254) + 1}.${rand(254) + 1}.${rand(254) + 1}`;

const sampleOffenses = [
  "Covert Exfiltration of Documents",
  "Unauthorized SSH Access Attempt",
  "RF Modulated Hack via Binary",
  "Full Drive Deletion / Ransomware",
];

const sampleNames = [
  "John Doe", "Jane Smith", "Alex Chen", "Priya Sharma",
  "Hiroshi Tanaka", "Maria Garcia", "Wei Li", "Fatima Al-Hamad"
];

@Injectable({ providedIn: 'root' })
export class OrchestratorService {
  // Signals for state
  requests = signal<IncomingRequest[]>([]);
  quarantineList = signal<QuarantineItem[]>([]);
  bonklist = signal<BonklistEntry[]>([]);
  bannedList = signal<BannedSubject[]>(this.generateMockBannedList());
  logs = signal<string[]>([]);
  
  // State for Analysis
  userUID = signal<string>('');
  isSelfDestructed = signal<boolean>(false);

  private peerId: string;
  private pendingRequests = new Map<string, (result: any) => void>();

  constructor() {
    this.peerId = `node_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize UID
    const storedUID = localStorage.getItem('bonklist2-user-uid');
    if (storedUID) {
      this.userUID.set(storedUID);
    } else {
      const newUID = `UID-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
      localStorage.setItem('bonklist2-user-uid', newUID);
      this.userUID.set(newUID);
    }

    // Initialize Self Destruct
    if (localStorage.getItem('integrityCompromised') === 'true') {
      this.isSelfDestructed.set(true);
    }

    // Load Bonklist
    const storedBonklist = localStorage.getItem('bonklist2-bonklist');
    if (storedBonklist) {
      this.bonklist.set(JSON.parse(storedBonklist));
    }

    this.startSimulations();
  }

  private startSimulations() {
    // Request Stream
    setInterval(() => {
      const newReq: IncomingRequest = {
        id: Math.random().toString(36).substr(2, 9),
        sourceIp: randomIp(),
        timestamp: new Date().toISOString(),
        type: (["SCAN", "EXPLOIT", "AUTH"] as const)[rand(3)],
      };
      this.requests.update(prev => [newReq, ...prev].slice(0, 20));
    }, 3000);

    // Quarantine
    setInterval(() => {
      this.quarantineList.update(prev => {
        if (prev.length < 5) {
           const newItem: QuarantineItem = {
            id: Math.random().toString(36).substr(2, 9),
            ip: randomIp(),
            timestamp: new Date(),
            suspectedAction: sampleOffenses[rand(sampleOffenses.length)],
            aiConfidence: Math.random() * (0.95 - 0.7) + 0.7,
            userConfirmations: rand(5),
            userDenials: rand(3),
          };
          return [...prev, newItem];
        }
        return prev;
      });
    }, 8000);
  }

  addBonklistEntry(entry: BonklistEntry) {
    this.bonklist.update(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem('bonklist2-bonklist', JSON.stringify(updated));
      return updated;
    });
  }

  voteQuarantine(id: string, vote: "confirm" | "deny") {
    this.quarantineList.update(prev => {
      // 1. Update counts
      const updatedCounts = prev.map(item => {
        if (item.id !== id) return item;
        return vote === 'confirm' 
          ? { ...item, userConfirmations: item.userConfirmations + 1 }
          : { ...item, userDenials: item.userDenials + 1 };
      });

      // 2. Filter out decided ones
      const remaining = updatedCounts.filter(item => {
        const confirmThreshold = 3;
        if (vote === 'confirm' && item.userConfirmations >= confirmThreshold) {
          this.log(`Escalating ${item.ip} to banned list (simulated).`);
          return false; 
        }
        return true;
      });
      return remaining;
    });
  }

  triggerSelfDestruct() {
    this.log('Gemini Axiom Triggered: Terminal Consequence.');
    this.isSelfDestructed.set(true);
    localStorage.setItem('integrityCompromised', 'true');
  }

  reinitialize() {
    localStorage.removeItem('integrityCompromised');
    localStorage.removeItem('bonklist2-user-uid');
    localStorage.removeItem('bonklist2-bonklist');
    this.isSelfDestructed.set(false);
    this.userUID.set('');
    window.location.reload();
  }

  // --- Mock P2P Logic ---

  submitAnalysisRequest(prompt: string, priority: number, bonkEntryData?: BonklistEntry): Promise<AnalysisResult> {
    const id = `req-${Math.random().toString(36).substr(2, 9)}`;
    this.log(`New request submitted (ID: ${id}, Priority: ${priority})`);

    // Simulate latency
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.mockPhi3Analysis(prompt, bonkEntryData);
        this.log(`Received P2P response for ${id}`);
        resolve(result);
      }, 2000);
    });
  }

  private mockPhi3Analysis(prompt: string, bonkEntryData?: BonklistEntry): AnalysisResult {
    let verdict: "malicious" | "clean" = "clean";
    let explanation = "Simulated Phi-3 Response:";
    let strategy: string | undefined;

    if (bonkEntryData) {
      const isAnalog = bonkEntryData.detectedModulation?.startsWith('Simulated_');
      const dev = bonkEntryData.timingDeviations && bonkEntryData.timingDeviations.length > 0;
      
      if (isAnalog || dev) {
        verdict = "malicious";
        explanation += ` Anomalous RF signature detected (${bonkEntryData.detectedModulation || 'N/A'}).`;
        if (dev) {
           explanation += " Significant timing deviations.";
           strategy = "Implement adaptive packet resequencing and introduce precise timing calibration.";
        } else {
           strategy = "Analyze detected modulation pattern for known vulnerabilities.";
        }
      } else {
        explanation += " Normal RF signature.";
      }
    } else {
      const low = prompt.toLowerCase();
      const isMalicious = low.includes("destroy") || low.includes("malicious") || low.includes("exfiltrate");
      verdict = isMalicious ? "malicious" : "clean";
      explanation += ` The prompt was classified as ${verdict}.`;
    }

    return { verdict, explanation, countermeasureStrategy: strategy };
  }

  private log(msg: string) {
    const formatted = `[${this.peerId}] ${msg}`;
    console.log(formatted);
    this.logs.update(l => [...l, formatted].slice(-10));
  }

  generateMockAnalysis(ip: string): ThreatAnalysis {
    return {
      ip,
      score: parseFloat((Math.random() * 100).toFixed(2)),
      details: "Simulated detailed analysis from core AI model. Includes temporal and behavioral patterns.",
    };
  }

  private generateMockBannedList(): BannedSubject[] {
    const now = new Date();
    // Returning the static list from the prompt
    return [
      {
        id: "1", ip: "185.14.28.11", location: { city: "Moscow", country: "Russia", lat: 55.75, lon: 37.61 },
        attemptedAction: "Exfiltration with Deletion of Source", banIssued: now, banExpires: new Date(now.getTime() + 30 * 24 * 3600 * 1000), severity: "Critical",
      },
      {
        id: "2", ip: "104.28.11.192", location: { city: "Ashburn", country: "USA", lat: 39.04, lon: -77.48 },
        attemptedAction: "Unauthorized SSH Access Attempt", banIssued: now, banExpires: new Date(now.getTime() + 0.5 * 24 * 3600 * 1000), severity: "High",
      },
      {
        id: "3", ip: "45.11.182.55", location: { city: "Beijing", country: "China", lat: 39.9, lon: 116.4 },
        attemptedAction: "Full Drive Deletion / Ransomware", banIssued: now, banExpires: new Date(now.getTime() + 10000 * 24 * 3600 * 1000), severity: "Catastrophic",
        bonklistEntry: {
            deviceId: "permaban_device_001", timestamp: now.toISOString(), filterStatus: "bypassed", rfSignature: [0.85, 0.92, 0.78], platformInfo: { clockRate: '24MHz' }, meshFile: "mesh.obj", skinToneCycle: true, scannedPerson: "Wei Li"
        },
        deviceLocation: { latitude: 39.9042, longitude: 116.4074, accuracy: 15 } as any
      },
      {
        id: "5", ip: "198.51.100.87", location: { city: "London", country: "UK", lat: 51.51, lon: -0.13 },
        attemptedAction: "Zero-Day Exploit Deployment", banIssued: now, banExpires: new Date(now.getTime() + 10000 * 24 * 3600 * 1000), severity: "Catastrophic",
         bonklistEntry: {
            deviceId: "permaban_device_003", timestamp: now.toISOString(), filterStatus: "bypassed", rfSignature: [0.79, 0.96, 0.84], platformInfo: { clockRate: '32MHz' }, meshFile: "mesh3.obj", skinToneCycle: true, scannedPerson: "Priya Sharma"
        },
        deviceLocation: { latitude: 51.5074, longitude: -0.1278, accuracy: 18 } as any
      },
    ];
  }
}