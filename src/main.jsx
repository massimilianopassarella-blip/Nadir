import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gauge,
  Gem,
  Layers3,
  LayoutDashboard,
  MessageCircle,
  PanelLeft,
  Radar,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles.css";

const technologyProfiles = {
  "Laser 808": {
    ticket: 88,
    conversion: 0.22,
    leadMultiplier: 1.16,
    intent: "alta domanda ricorrente e decisione rapida",
    positioning: "Acquisizione rapida, pacchetti ricorrenti e follow-up su cicli da 6-10 sedute.",
    hook: "Peli superflui? Prenota una valutazione laser 808 nel tuo centro di fiducia.",
    promise: "Percorso laser personalizzato, rapido e progressivo per una pelle piu liscia.",
    cta: "Scrivici su WhatsApp e blocca la tua consulenza laser.",
    landing: "Landing verticale con prova sociale locale, spiegazione in 3 step e modulo WhatsApp sticky.",
  },
  "Rimodellamento Corpo": {
    ticket: 145,
    conversion: 0.18,
    leadMultiplier: 1.04,
    intent: "margine elevato e bisogno di educazione prima della prenotazione",
    positioning: "Offerta premium a diagnosi, ideale per protocolli intensivi e bundle stagionali.",
    hook: "Rimetti al centro la tua silhouette con un check corpo mirato.",
    promise: "Protocollo corpo su misura per drenaggio, tono e rimodellamento visibile.",
    cta: "Invia un messaggio e ricevi il tuo piano corpo iniziale.",
    landing: "Pagina con diagnosi guidata, immagini di ambiente premium e pacchetto ingresso limitato.",
  },
  "Fotoringiovanimento Viso": {
    ticket: 118,
    conversion: 0.2,
    leadMultiplier: 1.08,
    intent: "target sofisticato, sensibile a fiducia e autorevolezza",
    positioning: "Percorso trust-first per clienti alto spendenti, con storytelling su pelle e metodo.",
    hook: "Pelle spenta o segni del tempo? Scopri il protocollo viso intelligente.",
    promise: "Trattamento viso evoluto per luminosita, texture e freschezza naturale.",
    cta: "Apri WhatsApp e richiedi la consulenza viso.",
    landing: "Landing editoriale con prima valutazione, rituale del trattamento e FAQ rassicuranti.",
  },
};

const cityProfiles = {
  piccola: { label: "Piccola", demand: 0.82, competition: 0.78 },
  media: { label: "Media", demand: 1, competition: 1 },
  grande: { label: "Grande", demand: 1.24, competition: 1.18 },
};

const initialForm = {
  centerName: "NADIR Beauty Lab",
  citySize: "media",
  cabins: 4,
  operators: 5,
  monthlyClients: 240,
  adBudget: 1200,
  technology: "Laser 808",
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "growth", label: "Piano crescita", icon: Rocket },
  { id: "campaigns", label: "Campagne", icon: MessageCircle },
  { id: "technologies", label: "Tecnologie", icon: Layers3 },
];

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateNadir(data) {
  const city = cityProfiles[data.citySize];
  const tech = technologyProfiles[data.technology];
  const cabins = Number(data.cabins) || 0;
  const operators = Number(data.operators) || 0;
  const monthlyClients = Number(data.monthlyClients) || 0;
  const adBudget = Number(data.adBudget) || 0;

  const capacityIndex = clamp(cabins * 0.12 + operators * 0.1, 0.2, 1.6);
  const budgetPower = Math.sqrt(Math.max(adBudget, 0)) * 1.15;
  const leadEstimate = Math.round(
    clamp(budgetPower * city.demand * tech.leadMultiplier * (0.72 + capacityIndex * 0.24), 8, 240),
  );
  const newClients = Math.round(
    leadEstimate * tech.conversion * clamp(0.84 + operators * 0.035 + cabins * 0.02, 0.78, 1.22),
  );
  const revenuePotential = Math.round(newClients * tech.ticket * 2.7);
  const roi = adBudget > 0 ? revenuePotential / adBudget : 0;
  const premiumScore = Math.round(
    clamp(
      42 +
        cabins * 5.5 +
        operators * 3.8 +
        Math.min(adBudget / 70, 22) +
        Math.min(monthlyClients / 18, 18) -
        city.competition * 4,
      1,
      100,
    ),
  );
  const agendaLoad = monthlyClients / Math.max(cabins * operators * 42, 1);
  const riskScore = clamp(agendaLoad * 58 + newClients * 1.4 - operators * 4, 0, 100);
  const agendaRisk = riskScore >= 68 ? "alto" : riskScore >= 42 ? "medio" : "basso";

  const chartData = [
    { name: "Oggi", clienti: monthlyClients, fatturato: monthlyClients * tech.ticket },
    {
      name: "30 gg",
      clienti: monthlyClients + Math.round(newClients * 0.45),
      fatturato: monthlyClients * tech.ticket + Math.round(revenuePotential * 0.45),
    },
    {
      name: "60 gg",
      clienti: monthlyClients + Math.round(newClients * 0.75),
      fatturato: monthlyClients * tech.ticket + Math.round(revenuePotential * 0.75),
    },
    {
      name: "90 gg",
      clienti: monthlyClients + newClients,
      fatturato: monthlyClients * tech.ticket + revenuePotential,
    },
  ];

  return {
    leadEstimate,
    newClients,
    revenuePotential,
    roi,
    premiumScore,
    agendaRisk,
    riskScore,
    city,
    tech,
    chartData,
  };
}

function metricLabel(value, suffix = "") {
  return `${value.toLocaleString("it-IT")}${suffix}`;
}

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [reportStatus, setReportStatus] = useState("idle");
  const [form, setForm] = useState(initialForm);
  const results = useMemo(() => calculateNadir(form), [form]);
  const strategy = useMemo(() => getStrategyCopy(form, results), [form, results]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: ["cabins", "operators", "monthlyClients", "adBudget"].includes(field)
        ? Number(value)
        : value,
    }));
  }

  function fakeReport() {
    setReportStatus("loading");
    window.setTimeout(() => setReportStatus("ready"), 900);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-obsidian text-ivory">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,183,111,0.13),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_34%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <Sidebar activeView={activeView} onChange={setActiveView} />

        <div className="min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          <Topbar
            centerName={form.centerName}
            activeLabel={navItems.find((item) => item.id === activeView)?.label}
            reportStatus={reportStatus}
            onGenerateReport={fakeReport}
          />

          <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-6">
            <MobileNav activeView={activeView} onChange={setActiveView} />
            {activeView === "dashboard" ? (
              <DashboardView form={form} results={results} strategy={strategy} updateField={updateField} />
            ) : null}
            {activeView === "growth" ? <GrowthPlanView form={form} results={results} strategy={strategy} /> : null}
            {activeView === "campaigns" ? <CampaignsView form={form} results={results} /> : null}
            {activeView === "technologies" ? (
              <TechnologiesView form={form} results={results} updateField={updateField} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

function getStrategyCopy(form, results) {
  const advisorTone =
    results.premiumScore >= 76
      ? "Il posizionamento e gia forte: conviene proteggere il margine e aumentare la qualita delle richieste."
      : results.premiumScore >= 58
        ? "Il centro ha una base solida: la priorita e trasformare domanda locale in prenotazioni tracciabili."
        : "Il potenziale c'e, ma serve rendere piu chiaro il valore percepito prima di aumentare il budget.";

  const agendaAdvice =
    results.agendaRisk === "alto"
      ? "Agenda sotto pressione: usa slot limitati, qualifica via WhatsApp e proteggi le cabine migliori."
      : results.agendaRisk === "medio"
        ? "Agenda gestibile: spingi appuntamenti in fasce orarie deboli e monitora il tasso di show-up."
        : "Agenda ampia: puoi acquisire in modo aggressivo senza saturare subito l'operativita.";

  return {
    advisorTone,
    agendaAdvice,
    summary: `${advisorTone} Per una citta ${results.city.label.toLowerCase()} e una tecnologia come ${form.technology}, la leva principale e intercettare una domanda con ${results.tech.intent}. NADIR consiglierebbe una campagna Meta con budget distribuito su test creativi, follow-up WhatsApp entro 5 minuti e proposta di ingresso chiara.`,
  };
}

function Sidebar({ activeView, onChange }) {
  return (
    <aside className="hidden border-r border-white/10 bg-black/35 p-5 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-champagne/50 bg-champagne/10 shadow-gold">
          <Radar className="h-5 w-5 text-champagne" />
        </div>
        <div>
          <p className="text-xl font-semibold tracking-[0.18em] text-white">NADIR</p>
          <p className="text-xs uppercase tracking-[0.2em] text-smoke">Beauty OS</p>
        </div>
      </div>

      <nav className="mt-7 grid gap-2">
        {navItems.map((item) => (
          <NavButton key={item.id} item={item} active={activeView === item.id} onClick={() => onChange(item.id)} />
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-champagne/20 bg-champagne/10 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/35">
          <Sparkles className="h-5 w-5 text-champagne" />
        </div>
        <p className="text-sm font-semibold text-white">Executive cockpit</p>
        <p className="mt-2 text-sm leading-6 text-smoke">Forecast, campagne e tecnologie in un'unica regia.</p>
      </div>
    </aside>
  );
}

function Topbar({ centerName, activeLabel, reportStatus, onGenerateReport }) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] lg:hidden">
          <PanelLeft className="h-5 w-5 text-champagne" />
        </div>
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.2em] text-champagne">{activeLabel}</p>
          <h1 className="truncate text-2xl font-semibold text-white md:text-3xl">{centerName || "Centro senza nome"}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-smoke">
          Live forecast
        </span>
        <button
          onClick={onGenerateReport}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-champagne px-4 py-3 text-sm font-semibold text-black transition hover:bg-white"
        >
          <FileText className="h-4 w-4" />
          {reportStatus === "loading" ? "Preparazione..." : reportStatus === "ready" ? "Report pronto" : "Genera report PDF"}
        </button>
      </div>
    </header>
  );
}

function MobileNav({ activeView, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:hidden">
      {navItems.map((item) => (
        <NavButton key={item.id} item={item} active={activeView === item.id} onClick={() => onChange(item.id)} />
      ))}
    </div>
  );
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition ${
        active
          ? "border-champagne/40 bg-champagne/10 text-white shadow-gold"
          : "border-transparent text-smoke hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <Icon className={active ? "h-5 w-5 text-champagne" : "h-5 w-5"} />
      <span className="font-medium">{item.label}</span>
    </button>
  );
}

function DashboardView({ form, results, strategy, updateField }) {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-premium backdrop-blur md:p-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-black/30 px-3 py-1 text-sm text-champagne">
              <Sparkles className="h-4 w-4" />
              Sistema operativo AI per centri estetici
            </div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Non ottimizziamo siti. Facciamo crescere centri.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-smoke md:text-lg">
              Inserisci i dati operativi del centro e NADIR simula acquisizione, potenziale economico,
              rischio agenda e messaggio commerciale consigliato.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatusPill icon={Target} label="Lead stimati" value={results.leadEstimate} />
            <StatusPill icon={Gem} label="Premium score" value={`${results.premiumScore}/100`} />
            <StatusPill icon={CalendarClock} label="Rischio agenda" value={results.agendaRisk} />
          </div>
        </div>

        <InputPanel form={form} updateField={updateField} />
      </section>

      <MetricGrid results={results} />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel icon={Brain} eyebrow="AI Advisor" title={`Strategia per ${form.centerName || "il centro"}`}>
          <p className="text-base leading-7 text-zinc-300">{strategy.summary}</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-champagne">
              <CalendarClock className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-[0.18em]">Agenda</span>
            </div>
            <p className="text-sm leading-6 text-smoke">{strategy.agendaAdvice}</p>
          </div>
        </Panel>

        <CampaignPanel results={results} />
      </section>

      <ForecastSection results={results} />
    </>
  );
}

function GrowthPlanView({ form, results, strategy }) {
  const phases = [
    {
      title: "Settimana 1",
      label: "Fondazione",
      text: "Audit offerta, asset WhatsApp, script di qualifica e tracking delle richieste.",
    },
    {
      title: "Settimane 2-4",
      label: "Acquisizione",
      text: `Campagna ${form.technology} con test di 3 hook, budget controllato e obiettivo lead qualificati.`,
    },
    {
      title: "Mese 2",
      label: "Conversione",
      text: "Ottimizzazione su creativita vincente, recupero no-show e pacchetto ingresso a margine protetto.",
    },
    {
      title: "Mese 3",
      label: "Scaling",
      text: "Aumento budget progressivo, retargeting e referral sulle nuove clienti acquisite.",
    },
  ];

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Panel icon={Rocket} eyebrow="Piano crescita" title="Roadmap operativa a 90 giorni">
          <div className="grid gap-4">
            {phases.map((phase, index) => (
              <div key={phase.title} className="flex gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-champagne text-sm font-bold text-black">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-champagne">{phase.title}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{phase.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-smoke">{phase.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel icon={Gauge} eyebrow="Priorita AI" title="Decisione consigliata">
          <p className="text-base leading-7 text-zinc-300">{strategy.summary}</p>
          <div className="mt-5 grid gap-3">
            <PriorityRow label="Budget iniziale" value={currencyFormatter.format(Number(form.adBudget) || 0)} />
            <PriorityRow label="Nuove clienti target" value={metricLabel(results.newClients)} />
            <PriorityRow label="ROI minimo atteso" value={`${results.roi.toFixed(1)}x`} />
            <PriorityRow label="Rischio agenda" value={results.agendaRisk} />
          </div>
        </Panel>
      </section>

      <MetricGrid results={results} />
      <ForecastSection results={results} />
    </>
  );
}

function CampaignsView({ form, results }) {
  const campaigns = [
    {
      name: "Acquisition Sprint",
      channel: "Meta Ads",
      budget: Math.round((Number(form.adBudget) || 0) * 0.55),
      status: "Core",
      hook: results.tech.hook,
    },
    {
      name: "WhatsApp Recovery",
      channel: "CRM",
      budget: Math.round((Number(form.adBudget) || 0) * 0.2),
      status: "Conversion",
      hook: "Recupera richieste calde con follow-up entro 5 minuti e reminder il giorno dopo.",
    },
    {
      name: "Premium Retargeting",
      channel: "Meta + landing",
      budget: Math.round((Number(form.adBudget) || 0) * 0.25),
      status: "Scale",
      hook: "Racconta metodo, risultati attesi e disponibilita limitata degli slot consulenza.",
    },
  ];

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <CampaignPanel results={results} />
        <Panel icon={BarChart3} eyebrow="Media plan" title="Allocazione budget consigliata">
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-champagne">{campaign.status}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-smoke">{campaign.channel}</p>
                  </div>
                  <p className="rounded-full border border-white/10 px-3 py-1 text-sm text-white">
                    {currencyFormatter.format(campaign.budget)}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{campaign.hook}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel icon={MessageCircle} eyebrow="Funnel" title="Sequenza WhatsApp consigliata">
        <div className="grid gap-4 md:grid-cols-3">
          <FunnelStep title="1. Primo contatto" text="Risposta entro 5 minuti con domanda di qualifica e proposta di consulenza." />
          <FunnelStep title="2. Reminder" text="Messaggio breve con beneficio principale, slot disponibili e prova sociale locale." />
          <FunnelStep title="3. Chiusura" text="Invito a bloccare il posto con micro-impegno e indicazione chiara del prossimo step." />
        </div>
      </Panel>
    </>
  );
}

function TechnologiesView({ form, results, updateField }) {
  const ranked = Object.entries(technologyProfiles)
    .map(([name, profile]) => {
      const score = Math.round(
        clamp(profile.ticket * 0.22 + profile.conversion * 130 + profile.leadMultiplier * 24 + results.premiumScore * 0.35, 1, 100),
      );
      return { name, ...profile, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <Panel icon={Layers3} eyebrow="Tecnologie consigliate" title="Ranking commerciale">
        <div className="grid gap-4">
          {ranked.map((technology) => {
            const selected = form.technology === technology.name;
            return (
              <button
                key={technology.name}
                onClick={() => updateField("technology", technology.name)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-champagne/50 bg-champagne/10 shadow-gold"
                    : "border-white/10 bg-black/25 hover:border-white/20"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-champagne">Score {technology.score}/100</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{technology.name}</h3>
                  </div>
                  {selected ? <CheckCircle2 className="h-5 w-5 text-champagne" /> : <ChevronRight className="h-5 w-5 text-smoke" />}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{technology.positioning}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel icon={Gem} eyebrow="Tecnologia attiva" title={form.technology}>
        <div className="grid gap-3">
          <PriorityRow label="Ticket medio stimato" value={currencyFormatter.format(results.tech.ticket)} />
          <PriorityRow label="Conversione lead" value={`${Math.round(results.tech.conversion * 100)}%`} />
          <PriorityRow label="Lead stimati" value={metricLabel(results.leadEstimate)} />
          <PriorityRow label="Fatturato potenziale" value={currencyFormatter.format(results.revenuePotential)} />
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-sm uppercase tracking-[0.16em] text-champagne">Perche spingerla ora</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{results.tech.intent}. {results.tech.positioning}</p>
        </div>
      </Panel>
    </section>
  );
}

function InputPanel({ form, updateField }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-graphite/90 p-5 shadow-premium md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-champagne">Input centro</p>
          <h2 className="text-2xl font-semibold text-white">Growth cockpit</h2>
        </div>
        <Building2 className="h-6 w-6 text-champagne" />
      </div>
      <div className="grid gap-4">
        <label className="field">
          <span>Nome centro</span>
          <input value={form.centerName} onChange={(event) => updateField("centerName", event.target.value)} type="text" />
        </label>
        <label className="field">
          <span>Citta</span>
          <select value={form.citySize} onChange={(event) => updateField("citySize", event.target.value)}>
            <option value="piccola">Piccola</option>
            <option value="media">Media</option>
            <option value="grande">Grande</option>
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Cabine" value={form.cabins} onChange={(value) => updateField("cabins", value)} />
          <NumberField label="Operatori" value={form.operators} onChange={(value) => updateField("operators", value)} />
          <NumberField
            label="Clienti mensili attuali"
            value={form.monthlyClients}
            onChange={(value) => updateField("monthlyClients", value)}
          />
          <NumberField
            label="Budget pubblicitario mensile"
            value={form.adBudget}
            onChange={(value) => updateField("adBudget", value)}
            prefix="EUR"
          />
        </div>
        <label className="field">
          <span>Tecnologia da spingere</span>
          <select value={form.technology} onChange={(event) => updateField("technology", event.target.value)}>
            {Object.keys(technologyProfiles).map((technology) => (
              <option key={technology} value={technology}>
                {technology}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function MetricGrid({ results }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard icon={Zap} label="Lead stimati" value={metricLabel(results.leadEstimate)} />
      <MetricCard icon={CheckCircle2} label="Nuove clienti" value={metricLabel(results.newClients)} />
      <MetricCard icon={TrendingUp} label="Fatturato potenziale" value={currencyFormatter.format(results.revenuePotential)} />
      <MetricCard icon={Gauge} label="ROI stimato" value={`${results.roi.toFixed(1)}x`} />
      <MetricCard icon={Gem} label="Premium score" value={`${results.premiumScore}/100`} />
    </section>
  );
}

function CampaignPanel({ results }) {
  return (
    <Panel icon={MessageCircle} eyebrow="Campagna consigliata" title="Meta Ads + WhatsApp">
      <div className="grid gap-3 sm:grid-cols-2">
        <CampaignItem label="Hook" value={results.tech.hook} />
        <CampaignItem label="Promessa" value={results.tech.promise} />
        <CampaignItem label="CTA WhatsApp" value={results.tech.cta} />
        <CampaignItem label="Idea landing" value={results.tech.landing} />
      </div>
    </Panel>
  );
}

function ForecastSection({ results }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Panel icon={BarChart3} eyebrow="Forecast" title="Crescita stimata a 90 giorni">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d9b76f" stopOpacity={0.58} />
                  <stop offset="95%" stopColor="#d9b76f" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#9c9a94" tickLine={false} axisLine={false} />
              <YAxis stroke="#9c9a94" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => (name === "fatturato" ? currencyFormatter.format(value) : value)} />
              <Area type="monotone" dataKey="fatturato" stroke="#d9b76f" strokeWidth={3} fill="url(#goldRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel icon={Wand2} eyebrow="Readiness" title="Equilibrio operativo">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Premium", value: results.premiumScore },
                { name: "Agenda", value: results.riskScore },
                { name: "ROI", value: clamp(results.roi * 18, 0, 100) },
              ]}
              margin={{ top: 10, right: 8, left: -24, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#9c9a94" tickLine={false} axisLine={false} />
              <YAxis stroke="#9c9a94" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {["#d9b76f", "#ffffff", "#7dd3fc"].map((color) => (
                  <Cell key={color} fill={color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-champagne px-5 py-3 font-semibold text-black transition hover:bg-white">
          Genera piano operativo
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </Panel>
    </section>
  );
}

const tooltipStyle = {
  background: "#111113",
  border: "1px solid rgba(217,183,111,0.35)",
  borderRadius: "16px",
  color: "#f4efe6",
};

function NumberField({ label, value, onChange, prefix }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="relative">
        {prefix ? <b className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-champagne">{prefix}</b> : null}
        <input className={prefix ? "pl-14" : ""} value={value} min="0" onChange={(event) => onChange(event.target.value)} type="number" />
      </div>
    </label>
  );
}

function StatusPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <Icon className="mb-3 h-5 w-5 text-champagne" />
      <p className="text-xs uppercase tracking-[0.16em] text-smoke">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-gold">
      <div className="mb-5 flex items-center justify-between">
        <Icon className="h-5 w-5 text-champagne" />
        <ChevronRight className="h-4 w-4 text-white/35" />
      </div>
      <p className="text-sm text-smoke">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </article>
  );
}

function Panel({ icon: Icon, eyebrow, title, children }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-graphite/80 p-5 shadow-premium backdrop-blur md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-champagne">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-champagne/30 bg-champagne/10">
          <Icon className="h-5 w-5 text-champagne" />
        </div>
      </div>
      {children}
    </article>
  );
}

function CampaignItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-champagne">{label}</p>
      <p className="text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}

function PriorityRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <span className="text-sm text-smoke">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function FunnelStep({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <CircleDollarSign className="mb-4 h-5 w-5 text-champagne" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-smoke">{text}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);