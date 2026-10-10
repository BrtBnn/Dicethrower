# Dicethrower

Een schermvullende dobbelsteen-app in React (Vite), opgemaakt met Bootstrap 5.3. Gooi met 1 tot 6 dobbelstenen, bekijk je laatste worpen en de telling per aantal ogen. De app is beschikbaar in 11 talen.

## Starten

```bash
npm install
npm run dev       # ontwikkelserver
npm run build     # productiebuild in dist/
npm run preview   # de build lokaal bekijken
```

## Thema

Licht of donker volgt automatisch de systeeminstelling en wisselt mee als die verandert. Dat gaat via het `data-bs-theme`-attribuut van Bootstrap: een klein script in `index.html` zet het thema voordat de pagina getekend wordt, en `src/hooks/useSystemTheme.js` houdt het daarna bij. Eigen stijlen gebruiken alleen Bootstrap-variabelen (`--bs-*`), zodat beide thema's vanzelf kloppen.

## Talen

Nederlands, English, 中文, हिन्दी, Español, العربية, Français, বাংলা, Português, Русский en اردو.

De taal volgt de browser en onthoudt je keuze. Arabisch en Urdu worden van rechts naar links getoond.

Een taal toevoegen:

1. Voeg een regel toe aan `languages` in `src/i18n/locales.js` (code, naam in de eigen taal, schrijfrichting).
2. Voeg een object toe aan `locales` in hetzelfde bestand, met dezelfde sleutels als `en`.

## Structuur

```
src/
  App.jsx                    de app zelf: worp, geschiedenis, bediening
  components/                Die, Tally, LanguageSelect, Icons
  hooks/useStageLayout.js    past de grootte van de dobbelstenen aan het scherm aan
  hooks/useSystemTheme.js    licht/donker volgens de systeeminstelling
  i18n/                      vertalingen en de taalkeuze
  styles.css                 indeling en de dobbelsteen zelf, bovenop Bootstrap
```

`dobbelsteen.html` is de oorspronkelijke versie in één bestand, zonder build.
