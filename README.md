# Dicethrower

Een schermvullende dobbelsteen-app in React en TypeScript (Vite), opgemaakt met Bootstrap 5.3. Gooi met 1 tot 6 dobbelstenen, bekijk je laatste worpen en de telling per aantal ogen. De app is beschikbaar in 11 talen.

## Starten

```bash
npm install
npm run dev         # ontwikkelserver
npm run typecheck   # alleen de typen controleren
npm run build       # typecheck + productiebuild in dist/
npm run preview     # de build lokaal bekijken
```

## Thema

Licht of donker volgt automatisch de systeeminstelling en wisselt mee als die verandert. Dat gaat via het `data-bs-theme`-attribuut van Bootstrap: een klein script in `index.html` zet het thema voordat de pagina getekend wordt, en `src/hooks/useSystemTheme.ts` houdt het daarna bij. Eigen stijlen gebruiken alleen Bootstrap-variabelen (`--bs-*`), zodat beide thema's vanzelf kloppen.

## Talen

Nederlands, English, 中文, हिन्दी, Español, العربية, Français, বাংলা, Português, Русский en اردو.

De taal volgt de browser en onthoudt je keuze. Arabisch en Urdu worden van rechts naar links getoond.

Een taal toevoegen in `src/i18n/locales.ts`:

1. Voeg een regel toe aan `languages` (code, naam in de eigen taal, schrijfrichting).
2. Voeg een object toe aan `locales`. TypeScript geeft een fout zolang er een taal of een tekst ontbreekt, en `t()` accepteert alleen bestaande sleutels.

## Structuur

```
src/
  App.tsx                    de app zelf: worp, geschiedenis, bediening
  types.ts                   Face en Roll
  components/                Die, Tally, LanguageSelect, Icons
  hooks/useStageLayout.ts    past de grootte van de dobbelstenen aan het scherm aan
  hooks/useSystemTheme.ts    licht/donker volgens de systeeminstelling
  i18n/                      vertalingen (typed) en de taalkeuze
  styles.css                 indeling en de dobbelsteen zelf, bovenop Bootstrap
```

`dobbelsteen.html` is de oorspronkelijke versie in één bestand, zonder build.
