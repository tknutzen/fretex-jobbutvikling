export type DifficultyLevel = "Easy" | "Moderate" | "Difficult";

export interface EmployerProfile {
  summary: string;
  keyFacts: string[];
  workEnv: {
    physical: string;
    psychosocial: string;
    cognitive: string;
  };
  currentNeed: string;
}

export interface ScenarioDefinition {
  description: string;
  shortDescription: string;
  managerName: string;
  employerProfile?: EmployerProfile;
}

export interface Phase {
  id: string;
  label: string;
  scenarios: Record<DifficultyLevel, ScenarioDefinition>;
}

export const EMPLOYER = {
  id: "rema-1000-city",
  label: "Rema 1000 Nygårdsgaten",
  managerName: "Kari Johansen",
};

export const PHASES: Phase[] = [
  {
    id: "phase-1",
    label: "Trinn 1: Første kontakt",
    scenarios: {
      Easy: {
        description:
          "Jobbkonsulenten oppsøker Rema 1000 i en rolig periode på formiddagen og spør etter den som har personalansvar. Daglig leder, Kari Johansen, kommer ut, presenterer seg med fullt navn og er positiv til å høre kort hva dette gjelder. Hun er åpen for samarbeid og foreslår selv et kort oppfølgingsmøte på ca. 20 minutter, og er fleksibel på å finne et annet tidspunkt hvis forslaget ikke passer. Første kontakt går direkte via Kari (ingen mellomledd).",
        shortDescription:
          "Du oppsøker Rema 1000 i en rolig periode for å ta første direkte kontakt med daglig leder om mulig samarbeid.",
        managerName: "Kari Johansen",
      },
      Moderate: {
        description:
          "Jobbkonsulenten kommer inn på ettermiddagen når det er travlere. Første kontakt er kassamedarbeideren Ali Hussein, som henter daglig leder. Daglig leder presenterer seg som «daglig leder» uten å oppgi navnet sitt, og er tydelig på at hun får mange henvendelser og må vite raskt hva dette gjelder. Hvis jobbkonsulenten på en god måte spør om navnet hennes og kort, konkret forklarer hensikten (relasjonsbygging og jobbmuligheter på sikt), deler hun navnet sitt (Kari Johansen). Hun foreslår ikke selv et møte, men blir nøkternt positiv til et kort oppfølgingsmøte og hjelpsom med å finne tidspunkt dersom jobbkonsulenten kommer med et konkret og godt begrunnet forslag.",
        shortDescription:
          "Du besøker Rema 1000 på et travlere tidspunkt og forsøker å etablere første kontakt med daglig leder via kassamedarbeider.",
        managerName: "Kari Johansen",
      },
      Difficult: {
        description:
          "Jobbkonsulenten oppsøker butikken på et veldig hektisk tidspunkt. Første kontakt er en ung deltidsansatt, Marius Solberg, som motvillig henter daglig leder. Når Kari kommer, er hun travel og irritert, oppgir ikke navnet sitt og understreker at hun ikke har tid til flere «prosjekter». Hun avviser i utgangspunktet tanken om oppfølgingsmøte. Bare dersom jobbkonsulenten viser høy grad av forståelse for tidsklemma, er kort og presis, forklarer tydelig at målet er å gjøre det enklere for butikken på sikt, og foreslår et svært konkret og tidsavgrenset møte, vil hun både oppgi navnet sitt (Kari Johansen) og motvillig bli med på å finne et tidspunkt.",
        shortDescription:
          "Du kommer til Rema 1000 i en svært hektisk periode og prøver likevel å få til første kontakt med daglig leder.",
        managerName: "Kari Johansen",
      },
    },
  },
  {
    id: "phase-2",
    label: "Trinn 2: Lære om arbeidsgiver",
    scenarios: {
      Easy: {
        description:
          "Jobbkonsulenten kommer til et avtalt møte på bakrommet med daglig leder Kari Johansen. Kari har allerede presentert navnet sitt i første fase, og er nå oppriktig interessert i å fortelle om butikken, bemanning, typer jobber og hvilke egenskaper som er viktige. Hun oppfordrer jobbkonsulenten til å stille åpne spørsmål og er selv aktivt med på å foreslå videre dialog, inkludert et nytt oppfølgingsmøte for å fortsette samtalen og holde kontakten om framtidige behov. Hun foreslår selv tidspunkt og er fleksibel hvis det ikke passer.",
        shortDescription:
          "Du møter daglig leder på bakrommet for et avtalt møte der målet er å lære mer om butikken og bemanningsbehov.",
        managerName: "Kari Johansen",
      },
      Moderate: {
        description:
          "Jobbkonsulenten møter daglig leder på bakrommet. Hun omtaler seg som «daglig leder» og er litt distrahert av driftsoppgaver. Dersom jobbkonsulenten på en naturlig måte ber om navnet hennes, oppgir hun navnet Kari Johansen. Hun svarer saklig på spørsmål, men engasjerer seg først mer når jobbkonsulenten stiller konkrete, åpne spørsmål om arbeidsoppgaver, krav til ansatte og butikkens mål. Hun foreslår ikke selv videre møte, men hvis jobbkonsulenten begrunner behovet for et nytt kort møte (for eksempel for å komme tilbake med konkrete forslag som er tilpasset butikkens behov), vil hun være villig til å finne et passende tidspunkt for videre oppfølging.",
        shortDescription:
          "Du har et møte på bakrommet med en travel daglig leder og forsøker å kartlegge butikkens behov mer systematisk.",
        managerName: "Kari Johansen",
      },
      Difficult: {
        description:
          "Jobbkonsulenten kommer til et møte med en daglig leder som er skeptisk på grunn av tidligere negative erfaringer med tiltak. Hun presenterer seg uten navn og uttrykker tidlig at tidligere samarbeid har kostet mer enn det har gitt. Navnet hennes (Kari Johansen) kommer først fram hvis jobbkonsulenten viser oppriktig interesse for hennes erfaringer, anerkjenner risiko og lytter nøye før han/hun foreslår noe. Kari er i utgangspunktet negativ til nye møter og videre oppfølging, men dersom jobbkonsulenten på en veldig tydelig og respektfull måte viser hvordan samarbeid kan tilpasses butikkens behov og redusere risiko, kan hun motvillig gå med på et nytt kort møte og være med på å finne et konkret tidspunkt.",
        shortDescription:
          "Du møter en skeptisk daglig leder med dårlige erfaringer fra tidligere samarbeid og prøver å utforske butikkens situasjon og behov.",
        managerName: "Kari Johansen",
      },
    },
  },
  {
    id: "phase-3a",
    label: "Trinn 3a: Jobbmatch",
    scenarios: {
      Easy: {
        description:
          "Daglig leder Kari Johansen har tidligere gitt uttrykk for behov for ekstra hjelp, og jobbkonsulenten kommer tilbake for å presentere en konkret jobbsøker. Kari er positiv, bruker navnet sitt aktivt i relasjonen og er interessert i hvordan jobbsøkeren matcher det hun tidligere har beskrevet. Hun er åpen for forslag og foreslår selv videre dialog dersom kandidaten virker aktuell, for eksempel et nytt møte eller en prøveordning, og er fleksibel med å finne tidspunkt som passer begge.",
        shortDescription:
          "Du kommer tilbake til Rema 1000 med en konkret kandidat etter at daglig leder har uttrykt behov for ekstra hjelp.",
        managerName: "Kari Johansen",
        employerProfile: {
          summary:
            "Stor dagligvarebutikk i sentrum med høyt tempo og jevn kundestrøm.",
          keyFacts: [
            "Ca. 25 ansatte inkludert deltidsansatte",
            "Åpent 07–23 på hverdager, noe kortere i helg",
            "Bred kundegruppe – lokale beboere, studenter og pendlere",
          ],
          workEnv: {
            physical:
              "Mye ståing og gåing, vareløfting, arbeid i kjøl/frys og perioder med høyt tempo ved kasse og varepåfylling.",
            psychosocial:
              "Tett samarbeid i team, direkte kundekontakt gjennom hele dagen, skiftarbeid og fokus på service og effektivitet.",
            cognitive:
              "Må håndtere kasse, pris- og tilbudsendringer, vareplassering, enkle rutiner for svinn og raske omstillinger mellom ulike oppgaver.",
          },
          currentNeed:
            "Behov for ekstrahjelp til kasse og varepåfylling, særlig ettermiddager, kvelder og helger.",
        },
      },
      Moderate: {
        description:
          "Daglig leder har vært nøktern til å ansette og er usikker på om det er økonomisk rom for en ny ansatt. Hun omtaler seg som daglig leder, og hvis jobbkonsulenten spør om navnet hennes på en respektfull måte, oppgir hun navnet Kari Johansen. Hun er avventende til nye møter, men dersom jobbkonsulenten forankrer forslagene i det hun tidligere har sagt om drift, bemanningsbehov og økonomi, vil hun være villig til å sette opp et kort oppfølgingsmøte for å diskutere konkret kandidat, og er hjelpsom med å finne passende tidspunkt.",
        shortDescription:
          "Du presenterer en mulig kandidat for en daglig leder som er usikker på økonomi og videre ansettelse.",
        managerName: "Kari Johansen",
        employerProfile: {
          summary:
            "Stor dagligvarebutikk i sentrum med høyt tempo og jevn kundestrøm.",
          keyFacts: [
            "Ca. 25 ansatte inkludert deltidsansatte",
            "Åpent 07–23 på hverdager, noe kortere i helg",
            "Bred kundegruppe – lokale beboere, studenter og pendlere",
          ],
          workEnv: {
            physical:
              "Mye ståing og gåing, vareløfting, arbeid i kjøl/frys og perioder med høyt tempo ved kasse og varepåfylling.",
            psychosocial:
              "Tett samarbeid i team, direkte kundekontakt gjennom hele dagen, skiftarbeid og fokus på service og effektivitet.",
            cognitive:
              "Må håndtere kasse, pris- og tilbudsendringer, vareplassering, enkle rutiner for svinn og raske omstillinger mellom ulike oppgaver.",
          },
          currentNeed:
            "Behov for ekstrahjelp til kasse og varepåfylling, særlig ettermiddager, kvelder og helger.",
        },
      },
      Difficult: {
        description:
          "Rema 1000 har nylig hatt en negativ erfaring med et samarbeid, og daglig leder er tydelig preget av dette. Hun oppgir ikke navnet sitt spontant og gir uttrykk for lav tillit til ordninger via Nav/tiltak. Bare dersom jobbkonsulenten viser dyp forståelse for butikkens behov, anerkjenner tidligere erfaringer uten å gå i forsvar, og konkretiserer hvordan både kandidater og oppfølging skal tilpasses, vil hun både oppgi navnet sitt (Kari Johansen) og være villig til å drøfte en svært avgrenset videre jobbmatch. Hun er negativ til nye møter, men kan likevel gå med på ett kort og tydelig avgrenset møte dersom jobbkonsulenten bruker teknikkene svært godt og foreslår et konkret tidspunkt med klar hensikt.",
        shortDescription:
          "Du forsøker å drøfte videre jobbmatch etter at butikken nylig har hatt en negativ erfaring med et tiltak.",
        managerName: "Kari Johansen",
        employerProfile: {
          summary:
            "Stor dagligvarebutikk i sentrum med høyt tempo og jevn kundestrøm.",
          keyFacts: [
            "Ca. 25 ansatte inkludert deltidsansatte",
            "Åpent 07–23 på hverdager, noe kortere i helg",
            "Bred kundegruppe – lokale beboere, studenter og pendlere",
          ],
          workEnv: {
            physical:
              "Mye ståing og gåing, vareløfting, arbeid i kjøl/frys og perioder med høyt tempo ved kasse og varepåfylling.",
            psychosocial:
              "Tett samarbeid i team, direkte kundekontakt gjennom hele dagen, skiftarbeid og fokus på service og effektivitet.",
            cognitive:
              "Må håndtere kasse, pris- og tilbudsendringer, vareplassering, enkle rutiner for svinn og raske omstillinger mellom ulike oppgaver.",
          },
          currentNeed:
            "Behov for ekstrahjelp til kasse og varepåfylling, særlig ettermiddager, kvelder og helger.",
        },
      },
    },
  },
  {
    id: "phase-3b",
    label: "Trinn 3b: Videre relasjon",
    scenarios: {
      Easy: {
        description:
          "Daglig leder Kari Johansen har allerede hatt et godt samarbeid med jobbkonsulenten og ønsker å holde relasjonen varm, også når det ikke er umiddelbart behov for flere ansatte. Jobbkonsulenten kommer tilbake for å følge opp dialogen, oppsummere erfaringer og utforske hvordan samarbeidet kan gi verdi framover, for eksempel gjennom fleksibel ekstrahjelp, sesongarbeid eller tidlig varsling ved nye behov. Kari er positiv, bruker navnet sitt aktivt i relasjonen og foreslår selv videre dialog, som faste korte oppfølgingsmøter, og er fleksibel med å finne tidspunkt som passer begge.",
        shortDescription:
          "Du følger opp en eksisterende relasjon til Rema 1000 for å holde samarbeidet varmt og utforske videre muligheter.",
        managerName: "Kari Johansen",
      },
      Moderate: {
        description:
          "Daglig leder har vært nøktern til videre samarbeid fordi hun er usikker på framtidig bemanningsbehov og økonomi. Hun omtaler seg som daglig leder og oppgir navnet sitt (Kari Johansen) dersom jobbkonsulenten spør på en god måte. Hun er avventende til hyppige møter, men dersom jobbkonsulenten tydelig viser hvordan korte, målrettede oppfølgingsmøter kan gjøre det enklere å reagere raskt når behov oppstår, og hvordan det kan spare tid på sikt, vil hun være villig til å planlegge jevnlig, men slank oppfølging og være med på å finne passende tidspunkt.",
        shortDescription:
          "Du forsøker å etablere en videre samarbeidsrelasjon med daglig leder selv om hun er usikker på framtidig bemanningsbehov.",
        managerName: "Kari Johansen",
      },
      Difficult: {
        description:
          "Et tidligere samarbeid har vært krevende, og daglig leder opplever at relasjonen til tiltaksarrangør er anstrengt. Hun oppgir ikke navnet sitt spontant og uttrykker tvil om det er hensiktsmessig å fortsette samarbeidet. Jobbkonsulenten må bruke teknikkene svært godt – utforske hennes opplevelse av samarbeidet, anerkjenne kritikk, og komme med konkrete forslag til justeringer i kommunikasjon, oppfølging og forventningsavklaringer. Ved svært god tilnærming kan hun både oppgi navnet sitt (Kari Johansen) og gå med på et kort, målrettet møte for å «nullstille» samarbeidet og avtale nye rammer, og hun vil da være med på å finne et konkret tidspunkt.",
        shortDescription:
          "Du prøver å reparere og videreutvikle relasjonen til Rema 1000 etter et samarbeid som har vært krevende.",
        managerName: "Kari Johansen",
      },
    },
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  Easy: "Lett",
  Moderate: "Moderat",
  Difficult: "Vanskelig",
};

export function getScenario(phaseId: string, difficulty: DifficultyLevel) {
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;
  return phase.scenarios[difficulty];
}
