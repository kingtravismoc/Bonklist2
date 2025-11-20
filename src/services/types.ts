
export type Severity = "High" | "Critical" | "Catastrophic";

export interface BannedSubject {
  id: string;
  ip: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  attemptedAction: string;
  banIssued: Date;
  banExpires: Date;
  severity: Severity;
  bonklistEntry?: BonklistEntry;
  deviceLocation?: GeolocationCoordinates;
}

export interface QuarantineItem {
  id: string;
  ip: string;
  timestamp: Date;
  suspectedAction: string;
  aiConfidence: number;
  userConfirmations: number;
  userDenials: number;
}

export interface IncomingRequest {
  id: string;
  sourceIp: string;
  timestamp: string;
  type: "SCAN" | "EXPLOIT" | "AUTH";
}

export interface ThreatAnalysis {
  ip: string;
  score: number;
  details: string;
}

export interface BonklistEntry {
  deviceId: string;
  timestamp: string;
  filterStatus: "bypassed" | "intact";
  rfSignature: number[];
  detectedModulation?: string;
  timingDeviations?: number[];
  platformInfo: Record<string, string | number>;
  meshFile: string;
  skinToneCycle: boolean;
  scannedPerson: string;
  visionImplantDetected?: boolean;
}

export interface AnalysisRequest {
  id: string;
  prompt: string;
  priority: number;
  timestamp: number;
  bonkEntryData?: BonklistEntry;
}

export interface AnalysisResult {
    verdict: "malicious" | "clean";
    explanation: string;
    countermeasureStrategy?: string;
}
