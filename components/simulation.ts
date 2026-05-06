// ─── ARZIQA SIMULATION ENGINE ───
// Pure TypeScript module — no React imports
// Seeded randomness ensures same month always produces same state

// ─── TYPES ───

export interface SimulationState {
  month: number;
  date: string;
  phase: 1 | 2 | 3;
  hubs: HubState[];
  trucks: TruckState[];
  ports: PortState[];
  commodityStock: Record<string, number>;
  financials: {
    revenue: { storage: number; ca: number; processing: number; export: number; wr: number; logistics: number; facilitation: number; insurance: number; preCooling: number; cma: number; total: number; };
    opex: number;
    ebitda: number;
    roe: number;
    cumulativeFcf: number;
    capexDeployed: number;
    cashPosition: number;
    wrDeployed: number;
    exportWcDeployed: number;
  };
  receipts: { issued: number; active: number; financed: number; cancelled: number; };
  exports: ExportDeal[];
  alerts: Alert[];
  market: { commodity: string; price: number; change: number; }[];
  headcount: { hired: number; planned: number; };
  throughput: { monthly: number; annual: number; };
}

export interface HubState {
  id: string; name: string; zone: string; lat: number; lng: number;
  capacity: number; phase: number; onlineMonth: number;
  status: "offline" | "construction" | "operational";
  constructionPct: number;
  utilization: number;
  stored: number;
  bays: BayState[];
  processing: { status: "idle" | "running" | "maintenance"; throughputToday: number; queueMT: number; };
  lab: { testsToday: number; rejectionRate: number; aflatoxinPositive: number; };
  power: { solarKw: number; batteryPct: number; gridUp: boolean; genFuel: number; };
  water: { tankPct: number; boreholeUp: boolean; };
  farmersToday: number;
  commodities: string[];
}

export interface BayState {
  id: number; warehouse: number;
  commodity: string | null; grade: string | null;
  tonnage: number; maxTonnage: number;
  depositor: string | null; dateReceived: string | null;
  moisture: number; daysStored: number;
  lastFumigation: string | null;
}

export interface TruckState {
  id: number; type: "dry" | "refrigerated";
  status: "en_route" | "loading" | "unloading" | "idle" | "maintenance" | "faulty";
  driver: string;
  cargo: { commodity: string; mt: number; } | null;
  origin: string; destination: string;
  progress: number;
  fuelPct: number;
  speed: number;
  lat: number; lng: number;
  fault: string | null;
  repairEta: string | null;
}

export interface PortState {
  id: string; name: string; lat: number; lng: number;
  containersWaiting: number; containersCleared: number;
  nextVessel: string; nextDeparture: string;
}

export interface ExportDeal {
  id: string;
  buyer: string; country: string;
  commodity: string; tonnage: number; value: number;
  stage: "negotiation" | "confirmed" | "processing" | "containerised" | "shipped" | "paid";
  vessel: string | null;
  eta: string | null;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  hub: string | null;
  timestamp: string;
}

// ─── CONSTANTS ───

const HUBS_DATA = [
  { id: "kano", name: "Kano", zone: "NW", lat: 12.0, lng: 8.52, capacity: 15000, onlineMonth: 12, phase: 1, commodities: ["Sesame", "Rice", "Sorghum"] },
  { id: "makurdi", name: "Makurdi", zone: "NC", lat: 7.73, lng: 8.53, capacity: 12000, onlineMonth: 12, phase: 1, commodities: ["Soybeans", "Rice", "Sesame"] },
  { id: "ibadan", name: "Ibadan", zone: "SW", lat: 7.38, lng: 3.93, capacity: 12000, onlineMonth: 20, phase: 2, commodities: ["Cocoa", "Cassava", "Maize"] },
  { id: "gombe", name: "Gombe", zone: "NE", lat: 10.29, lng: 11.17, capacity: 8000, onlineMonth: 20, phase: 2, commodities: ["Sesame", "Sorghum", "Groundnuts"] },
  { id: "abakaliki", name: "Abakaliki", zone: "SE", lat: 6.32, lng: 8.11, capacity: 8000, onlineMonth: 30, phase: 3, commodities: ["Rice", "Cassava", "Palm Oil"] },
  { id: "calabar", name: "Calabar", zone: "SS", lat: 4.95, lng: 8.32, capacity: 10000, onlineMonth: 30, phase: 3, commodities: ["Palm Oil", "Cocoa", "Cashew"] },
];

const PORTS_DATA = [
  { id: "apapa", name: "Apapa Port (Lagos)", lat: 6.43, lng: 3.38 },
  { id: "calabar_port", name: "Calabar Port", lat: 4.97, lng: 8.33 },
];

const ROUTES = [
  { from: "kano", to: "apapa", fromLat: 12.0, fromLng: 8.52, toLat: 6.43, toLng: 3.38 },
  { from: "makurdi", to: "apapa", fromLat: 7.73, fromLng: 8.53, toLat: 6.43, toLng: 3.38 },
  { from: "ibadan", to: "apapa", fromLat: 7.38, fromLng: 3.93, toLat: 6.43, toLng: 3.38 },
  { from: "gombe", to: "calabar_port", fromLat: 10.29, fromLng: 11.17, toLat: 4.97, toLng: 8.33 },
  { from: "abakaliki", to: "calabar_port", fromLat: 6.32, fromLng: 8.11, toLat: 4.97, toLng: 8.33 },
  { from: "calabar", to: "calabar_port", fromLat: 4.95, fromLng: 8.32, toLat: 4.97, toLng: 8.33 },
  { from: "kano", to: "makurdi", fromLat: 12.0, fromLng: 8.52, toLat: 7.73, toLng: 8.53 },
  { from: "makurdi", to: "ibadan", fromLat: 7.73, fromLng: 8.53, toLat: 7.38, toLng: 3.93 },
];

const NIGERIAN_NAMES = [
  "Halima Iorshe", "Musa Abdullahi", "Chioma Okafor", "Ibrahim Sule", "Adaeze Nwosu",
  "Yakubu Garba", "Funke Adeyemi", "Emeka Okonkwo", "Fatima Bello", "Olumide Akinwale",
  "Hauwa Danjuma", "Chukwudi Eze", "Amina Mohammed", "Tunde Bakare", "Ngozi Okeke",
  "Abubakar Tanko", "Blessing Iroha", "Sadiq Yusuf", "Ifeoma Chukwu", "Dauda Lawal",
  "Patience Udo", "Haruna Idris", "Chinwe Aneke", "Muhammed Aliyu", "Bukola Ogunlade",
  "Isa Bala", "Nkechi Obinna", "Abdulrahman Sani", "Yetunde Olajide", "Suleiman Waziri",
];

const DRIVER_NAMES = [
  "Audu Musa", "Chinedu Okoro", "Bala Garba", "Sunday Eze", "Idris Yusuf",
  "Muyiwa Adeleke", "Peter Obi", "Sani Abubakar", "Okechukwu Ndu", "Tayo Ogunleye",
  "Danladi Hassan", "Victor Nnamdi", "Kabiru Suleiman", "Ifeanyi Agbo", "Rilwan Adamu",
  "Joseph Agada",
];

const BUYERS = [
  { name: "Mitsubishi Shoji", country: "Japan" },
  { name: "Olam International", country: "Singapore" },
  { name: "Barry Callebaut", country: "Switzerland" },
  { name: "Cargill", country: "USA" },
  { name: "Louis Dreyfus", country: "Netherlands" },
  { name: "COFCO International", country: "China" },
  { name: "ETG (Export Trading Group)", country: "Kenya" },
  { name: "Wilmar International", country: "Singapore" },
];

const VESSELS = [
  "MV Osaka Maru", "MV Atlantic Star", "MV Lagos Express", "MV Pacific Venture",
  "MV Orient Pearl", "MV Sahel Pioneer", "MV Gulf Trader", "MV Meridian Fortune",
];

const COMMODITIES = [
  "Sesame", "Soybeans", "Rice", "Sorghum", "Cocoa",
  "Cashew", "Maize", "Groundnuts", "Cassava", "Palm Oil", "Ginger",
];

const COMMODITY_BASE_PRICES: Record<string, number> = {
  "Sesame": 1800, "Soybeans": 520, "Rice": 450, "Sorghum": 320, "Cocoa": 3200,
  "Cashew": 2100, "Maize": 280, "Groundnuts": 900, "Cassava": 180, "Palm Oil": 850, "Ginger": 3500,
};

const GRADES = ["Grade A", "Grade B", "Grade C"];

const FAULTS = [
  "Engine overheating — radiator failure",
  "Broken axle on rough terrain",
  "Electrical system malfunction",
  "Brake failure — emergency stop",
  "Flat tyre (dual rear)",
  "Gearbox seized",
  "Fuel pump failure",
  "Suspension damage — pothole impact",
];

// ─── SEEDED RANDOM ───

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

class SeededRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed++;
    return seededRandom(this.seed);
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// ─── HELPERS ───

function monthToDate(month: number): string {
  const baseYear = 2026;
  const baseMonth = 10; // November 2026 = month 0
  const totalMonths = baseMonth + month;
  const year = baseYear + Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[m]} ${year}`;
}

function getCalendarMonth(month: number): number {
  return (10 + month) % 12; // 0=Jan ... 11=Dec; start is November
}

function getPhase(month: number): 1 | 2 | 3 {
  if (month < 24) return 1;
  if (month < 48) return 2;
  return 3;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── MAIN SIMULATE FUNCTION ───

export function simulate(month: number): SimulationState {
  const rng = new SeededRNG(month * 1000);
  const calMonth = getCalendarMonth(month);
  const phase = getPhase(month);
  const date = monthToDate(month);
  const alerts: Alert[] = [];
  let alertIdx = 0;

  const makeAlertId = () => `alert-${month}-${alertIdx++}`;

  // ─── HUBS ───
  const hubs: HubState[] = HUBS_DATA.map((h) => {
    const constructionStart = h.onlineMonth - 12;
    let status: "offline" | "construction" | "operational" = "offline";
    let constructionPct = 0;

    if (month >= h.onlineMonth) {
      status = "operational";
      constructionPct = 100;
    } else if (month >= constructionStart) {
      status = "construction";
      constructionPct = Math.min(100, Math.round(((month - constructionStart) / 12) * 100));
    }

    // Utilization ramp
    let utilization = 0;
    let stored = 0;
    if (status === "operational") {
      const monthsOp = month - h.onlineMonth;
      const baseUtil = Math.min(85, 30 + monthsOp * 2.5);
      // Seasonal adjustment: harvest months (Oct-Feb) higher utilization
      const seasonal = (calMonth >= 9 || calMonth <= 1) ? 10 : -5;
      utilization = Math.min(95, Math.max(10, baseUtil + seasonal + (rng.next() * 10 - 5)));
      stored = Math.round((utilization / 100) * h.capacity);
    }

    // Bays: 3 warehouses × 8 bays = 24 bays but spec says 8 bays per hub (simplified)
    const bays: BayState[] = [];
    const bayCount = 8;
    const maxTonnage = 625;
    for (let i = 0; i < bayCount; i++) {
      const warehouse = Math.floor(i / 3) + 1;
      let commodity: string | null = null;
      let grade: string | null = null;
      let tonnage = 0;
      let depositor: string | null = null;
      let dateReceived: string | null = null;
      let moisture = 0;
      let daysStored = 0;
      let lastFumigation: string | null = null;

      if (status === "operational" && rng.chance(utilization / 100)) {
        commodity = rng.pick(h.commodities);
        grade = rng.pick(GRADES);
        tonnage = Math.round(rng.next() * maxTonnage);
        depositor = rng.pick(NIGERIAN_NAMES);
        const recMonth = Math.max(0, month - rng.nextInt(0, 4));
        dateReceived = monthToDate(recMonth);
        moisture = 10 + rng.next() * 5;
        daysStored = rng.nextInt(5, 150);
        if (daysStored > 30) lastFumigation = monthToDate(Math.max(0, month - 1));
      }

      bays.push({ id: i + 1, warehouse, commodity, grade, tonnage, maxTonnage, depositor, dateReceived, moisture, daysStored, lastFumigation });
    }

    // Processing
    let processingStatus: "idle" | "running" | "maintenance" = "idle";
    let throughputToday = 0;
    let queueMT = 0;
    if (status === "operational") {
      if (rng.chance(0.08)) processingStatus = "maintenance";
      else if (utilization > 20) { processingStatus = "running"; throughputToday = rng.nextInt(20, 80); queueMT = rng.nextInt(0, 200); }
    }

    // Lab
    const testsToday = status === "operational" ? rng.nextInt(5, 40) : 0;
    const rejectionRate = status === "operational" ? rng.next() * 8 : 0;
    const aflatoxinPositive = status === "operational" ? (rng.chance(0.02) ? rng.nextInt(1, 3) : 0) : 0;

    if (aflatoxinPositive > 0) {
      alerts.push({ id: makeAlertId(), severity: "warning", message: `Aflatoxin detected in ${aflatoxinPositive} sample(s) at ${h.name}`, hub: h.id, timestamp: date });
    }

    // Power
    const solarKw = status === "operational" ? rng.nextInt(40, 120) : 0;
    const batteryPct = status === "operational" ? rng.nextInt(30, 100) : 0;
    const gridUp = status === "operational" ? rng.chance(0.7) : false;
    const genFuel = status === "operational" ? rng.nextInt(20, 100) : 0;

    // Water
    const tankPct = status === "operational" ? rng.nextInt(30, 95) : 0;
    const boreholeUp = status === "operational" ? rng.chance(0.9) : false;

    // Farmers
    const farmersToday = status === "operational" ? rng.nextInt(50, 200) : 0;

    // Makurdi flooding (Aug-Oct)
    if (h.id === "makurdi" && status === "operational" && calMonth >= 7 && calMonth <= 9 && rng.chance(0.3)) {
      alerts.push({ id: makeAlertId(), severity: "critical", message: `Flooding alert at Makurdi Hub — Benue River levels critical`, hub: "makurdi", timestamp: date });
    }

    // Security incident (1% per hub)
    if (status === "operational" && rng.chance(0.01)) {
      alerts.push({ id: makeAlertId(), severity: "critical", message: `Security breach reported at ${h.name} Hub — perimeter alarm triggered`, hub: h.id, timestamp: date });
    }

    // Equipment maintenance (every 3 months)
    if (status === "operational" && month % 3 === 0) {
      alerts.push({ id: makeAlertId(), severity: "warning", message: `Scheduled maintenance: processing line at ${h.name}`, hub: h.id, timestamp: date });
    }

    // Info: farmer registrations
    if (status === "operational" && rng.chance(0.5)) {
      const regCount = rng.nextInt(50, 200);
      alerts.push({ id: makeAlertId(), severity: "info", message: `${regCount} new farmer registrations at ${h.name} Hub`, hub: h.id, timestamp: date });
    }

    return {
      id: h.id, name: h.name, zone: h.zone, lat: h.lat, lng: h.lng,
      capacity: h.capacity, phase: h.phase, onlineMonth: h.onlineMonth,
      status, constructionPct, utilization, stored, bays,
      processing: { status: processingStatus, throughputToday, queueMT },
      lab: { testsToday, rejectionRate: Math.round(rejectionRate * 10) / 10, aflatoxinPositive },
      power: { solarKw, batteryPct, gridUp, genFuel },
      water: { tankPct, boreholeUp },
      farmersToday,
      commodities: h.commodities,
    };
  });

  // ─── TRUCKS ───
  const operationalHubs = hubs.filter(h => h.status === "operational");
  const trucks: TruckState[] = [];
  for (let i = 0; i < 16; i++) {
    const driver = DRIVER_NAMES[i];
    const type: "dry" | "refrigerated" = i < 12 ? "dry" : "refrigerated";

    let status: TruckState["status"] = "idle";
    let cargo: TruckState["cargo"] = null;
    let origin = "Depot";
    let destination = "Depot";
    let progress = 0;
    let fuelPct = rng.nextInt(20, 100);
    let speed = 0;
    let fault: string | null = null;
    let repairEta: string | null = null;

    if (operationalHubs.length > 0) {
      // 5% breakdown
      if (rng.chance(0.05)) {
        status = "faulty";
        fault = rng.pick(FAULTS);
        repairEta = monthToDate(Math.min(120, month + rng.nextInt(1, 2)));
        alerts.push({ id: makeAlertId(), severity: "critical", message: `Truck #${i + 1} (${driver}) — ${fault}`, hub: null, timestamp: date });
      } else if (rng.chance(0.6)) {
        status = "en_route";
        const route = rng.pick(ROUTES);
        origin = route.from;
        destination = route.to;
        progress = rng.next();
        speed = rng.nextInt(40, 90);
        const hub = operationalHubs.length > 0 ? rng.pick(operationalHubs) : null;
        const com = hub ? rng.pick(hub.commodities) : "Sesame";
        cargo = { commodity: com, mt: rng.nextInt(10, 30) };
      } else if (rng.chance(0.3)) {
        status = "loading";
        speed = 0;
        progress = 0;
        const hub = rng.pick(operationalHubs);
        origin = hub.id;
        destination = rng.pick(PORTS_DATA).id;
        cargo = { commodity: rng.pick(hub.commodities), mt: rng.nextInt(15, 30) };
      } else if (rng.chance(0.3)) {
        status = "unloading";
        speed = 0;
        progress = 1;
        origin = rng.pick(operationalHubs).id;
        destination = rng.pick(PORTS_DATA).id;
        cargo = { commodity: rng.pick(operationalHubs[0].commodities), mt: rng.nextInt(10, 25) };
      } else if (rng.chance(0.2)) {
        status = "maintenance";
      }
    }

    // Calculate lat/lng based on route progress
    let lat = 9.0 + rng.next() * 3;
    let lng = 5.0 + rng.next() * 6;
    if (status === "en_route") {
      const route = ROUTES.find(r => r.from === origin && r.to === destination) || ROUTES[0];
      lat = lerp(route.fromLat, route.toLat, progress);
      lng = lerp(route.fromLng, route.toLng, progress);
    } else if (status === "loading" || status === "unloading") {
      const hub = hubs.find(h => h.id === origin);
      if (hub) { lat = hub.lat + (rng.next() * 0.02 - 0.01); lng = hub.lng + (rng.next() * 0.02 - 0.01); }
    }

    trucks.push({ id: i + 1, type, status, driver, cargo, origin, destination, progress, fuelPct, speed, lat, lng, fault, repairEta });
  }

  // ─── PORTS ───
  const ports: PortState[] = PORTS_DATA.map(p => {
    const containersWaiting = operationalHubs.length > 0 ? rng.nextInt(5, 40) : 0;
    const containersCleared = operationalHubs.length > 0 ? rng.nextInt(2, 20) : 0;
    const nextVessel = rng.pick(VESSELS);
    const depMonth = Math.min(120, month + rng.nextInt(1, 3));
    return { id: p.id, name: p.name, lat: p.lat, lng: p.lng, containersWaiting, containersCleared, nextVessel, nextDeparture: monthToDate(depMonth) };
  });

  // ─── COMMODITY STOCK ───
  const commodityStock: Record<string, number> = {};
  for (const hub of hubs) {
    for (const bay of hub.bays) {
      if (bay.commodity) {
        commodityStock[bay.commodity] = (commodityStock[bay.commodity] || 0) + bay.tonnage;
      }
    }
  }

  // ─── FINANCIALS ───
  const totalStored = hubs.reduce((s, h) => s + h.stored, 0);
  const totalCapacity = hubs.filter(h => h.status === "operational").reduce((s, h) => s + h.capacity, 0);
  const monthFactor = Math.max(0, month - 11); // revenue starts when first hub online

  // Revenue streams (monthly, in USD)
  const storage = totalStored * 2.5; // $2.5/MT/month
  const ca = totalStored * 0.3 * 1.5; // 30% in CA at $1.5 premium
  const processing = totalStored * 0.15 * 8; // 15% processed at $8/MT
  const exportRev = monthFactor > 6 ? (rng.nextInt(100, 400) * 1000) * (operationalHubs.length / 2) : 0;
  const wr = totalStored * 0.2 * 3; // 20% financed, $3/MT spread
  const logistics = trucks.filter(t => t.status === "en_route").length * 2500;
  const facilitation = exportRev * 0.02;
  const insurance = totalStored * 0.5;
  const preCooling = totalStored * 0.05 * 4;
  const cma = totalStored * 0.1 * 2;
  const totalRevenue = storage + ca + processing + exportRev + wr + logistics + facilitation + insurance + preCooling + cma;

  // OpEx
  const baseOpex = 340000; // base monthly
  const hubOpex = operationalHubs.length * 85000;
  const truckOpex = trucks.filter(t => t.status !== "idle").length * 3500;
  const opex = baseOpex + hubOpex + truckOpex;

  const ebitda = totalRevenue - opex;
  const equity = 50_000_000;
  const roe = equity > 0 ? (ebitda * 12) / equity : 0;

  // Cumulative
  const capexDeployed = Math.min(173_400_000, month * (173_400_000 / 36));
  const cumulativeFcf = monthFactor > 0 ? ebitda * monthFactor * 0.6 - capexDeployed * 0.1 : -capexDeployed * (month / 36) * 0.1;
  const cashPosition = Math.max(0, 25_000_000 + cumulativeFcf);
  const wrDeployed = totalStored * 0.2 * 180; // avg commodity value $180/MT
  const exportWcDeployed = exportRev * 2.5;

  // ─── RECEIPTS ───
  const totalIssued = Math.round(totalStored * 0.4 + monthFactor * 50);
  const active = Math.round(totalIssued * 0.6);
  const financed = Math.round(active * 0.35);
  const cancelled = totalIssued - active;

  // ─── EXPORTS ───
  const exports: ExportDeal[] = [];
  const stages: ExportDeal["stage"][] = ["negotiation", "confirmed", "processing", "containerised", "shipped", "paid"];
  const numDeals = operationalHubs.length > 0 ? rng.nextInt(2, 6 + operationalHubs.length) : 0;
  for (let i = 0; i < numDeals; i++) {
    const buyer = rng.pick(BUYERS);
    const commodity = rng.pick(COMMODITIES.slice(0, 8));
    const tonnage = rng.nextInt(100, 2000);
    const value = tonnage * (COMMODITY_BASE_PRICES[commodity] || 500);
    const stage = stages[rng.nextInt(0, stages.length - 1)];
    const vessel = stage === "shipped" || stage === "containerised" ? rng.pick(VESSELS) : null;
    const eta = vessel ? monthToDate(Math.min(120, month + rng.nextInt(1, 3))) : null;
    exports.push({ id: `EXP-${month}-${i}`, buyer: `${buyer.name} (${buyer.country})`, country: buyer.country, commodity, tonnage, value, stage, vessel, eta });

    if (stage === "confirmed" && rng.chance(0.5)) {
      alerts.push({ id: makeAlertId(), severity: "info", message: `Export deal confirmed: ${tonnage}MT ${commodity} to ${buyer.name}`, hub: null, timestamp: date });
    }
  }

  // ─── MARKET ───
  const market = COMMODITIES.map((commodity, idx) => {
    const base = COMMODITY_BASE_PRICES[commodity];
    const seasonalMult = (calMonth >= 9 || calMonth <= 1) ? 0.9 : 1.1; // Lower at harvest, higher in lean
    const noise = seededRandom(month * 100 + idx) * 0.2 - 0.1;
    const price = Math.round(base * seasonalMult * (1 + noise));
    const prevNoise = seededRandom((month - 1) * 100 + idx) * 0.2 - 0.1;
    const prevPrice = Math.round(base * seasonalMult * (1 + prevNoise));
    const change = prevPrice > 0 ? Math.round(((price - prevPrice) / prevPrice) * 1000) / 10 : 0;
    return { commodity, price, change };
  });

  // ─── HEADCOUNT ───
  const planned = 45 + operationalHubs.length * 25 + (phase >= 2 ? 30 : 0) + (phase >= 3 ? 20 : 0);
  const hired = Math.min(planned, Math.round(planned * Math.min(1, 0.4 + monthFactor * 0.03)));

  // ─── THROUGHPUT ───
  const monthly = hubs.reduce((s, h) => s + h.processing.throughputToday * 25, 0); // 25 working days
  const annual = monthly * 12;

  return {
    month, date, phase,
    hubs, trucks, ports,
    commodityStock,
    financials: {
      revenue: { storage, ca, processing, export: exportRev, wr, logistics, facilitation, insurance, preCooling, cma, total: totalRevenue },
      opex, ebitda, roe: Math.round(roe * 1000) / 10,
      cumulativeFcf, capexDeployed, cashPosition,
      wrDeployed, exportWcDeployed,
    },
    receipts: { issued: totalIssued, active, financed, cancelled },
    exports, alerts, market, headcount: { hired, planned },
    throughput: { monthly, annual },
  };
}
