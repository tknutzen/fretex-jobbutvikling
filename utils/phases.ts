export interface PillarDefinition {
  id: string;
  label: string;
  description: string;
}

export interface PhaseDefinition {
  id: string;
  label: string;
  pillars: PillarDefinition[];
}

export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    id: "phase-1",
    label: "Trinn 1: Første kontakt",
    pillars: [
      {
        id: "intro_name",
        label: "Navn",
        description: "Presenterte du deg med fullt navn?",
      },
      {
        id: "intro_role",
        label: "Rolle",
        description: "Forklarte du tydelig hvilken rolle du har som jobbkonsulent?",
      },
      {
        id: "intro_company",
        label: "Virksomhet",
        description: "Sa du hvilken virksomhet du kommer fra på en måte som skaper trygghet?",
      },
      {
        id: "intro_purpose",
        label: "Formål",
        description: "Forklarte du kort og forståelig hvorfor du tar kontakt?",
      },
      {
        id: "followup_meeting",
        label: "Oppfølgingsmøte",
        description: "Ble det avtalt et konkret oppfølgingsmøte med dato og klokkeslett?",
      },
    ],
  },
  {
    id: "phase-2",
    label: "Trinn 2: Lære om arbeidsgiver",
    pillars: [
      {
        id: "relationship",
        label: "Relasjonsbygging",
        description: "Viste du genuin interesse for bedriften og folkene?",
      },
      {
        id: "work_tasks",
        label: "Arbeidsoppgaver",
        description: "Kartla du hvilke konkrete arbeidsoppgaver som finnes?",
      },
      {
        id: "physical_env",
        label: "Fysisk arbeidsmiljø",
        description: "Kartla du fysisk arbeidsmiljø (tempo, støy, løft, skift)?",
      },
      {
        id: "psychosocial_env",
        label: "Psykososialt arbeidsmiljø",
        description: "Kartla du psykososialt miljø (kultur, støtte, stressnivå)?",
      },
    ],
  },
  {
    id: "phase-3a",
    label: "Trinn 3a: Jobbmatch",
    pillars: [
      {
        id: "education",
        label: "Utdanning",
        description: "Samsvar mellom jobbsøkers utdanning og jobbens krav.",
      },
      {
        id: "experience",
        label: "Erfaring",
        description: "Samsvar mellom tidligere erfaring og arbeidsoppgaver.",
      },
      {
        id: "preferences",
        label: "Preferanser vs behov",
        description: "Samsvar mellom jobbsøkers ønsker og arbeidsgivers behov.",
      },
      {
        id: "psych_health",
        label: "Psykisk helse og miljø",
        description: "Samsvar mellom jobbsøkers psykiske helse og arbeidsmiljø.",
      },
      {
        id: "physical_health",
        label: "Fysisk helse og miljø",
        description: "Samsvar mellom jobbsøkers fysiske helse og arbeidsmiljø.",
      },
      {
        id: "cognitive",
        label: "Kognitiv funksjon",
        description: "Samsvar mellom jobbsøkers kognitive fungering og jobbens krav.",
      },
    ],
  },
  {
    id: "phase-3b",
    label: "Trinn 3b: Videre relasjon",
    pillars: [
      {
        id: "trust",
        label: "Relasjon og tillit",
        description: "Hvor godt bygget og forsterket du en trygg relasjon?",
      },
      {
        id: "future_needs",
        label: "Fremtidige behov",
        description: "Utforsket du mulige jobbåpninger og behov fremover?",
      },
      {
        id: "followup_freq",
        label: "Oppfølgingsfrekvens",
        description: "Avtale om rytme for oppfølging som passer arbeidsgiver.",
      },
      {
        id: "visibility",
        label: "Synlighet",
        description: "Er det lett for arbeidsgiver å forstå hvordan du kan kontaktes?",
      },
      {
        id: "value",
        label: "Opplevd verdi",
        description: "Får arbeidsgiver reell verdi ut av kontakten?",
      },
    ],
  },
];

export function getPhaseDefinition(phaseId: string): PhaseDefinition | undefined {
  return PHASE_DEFINITIONS.find((p) => p.id === phaseId);
}
