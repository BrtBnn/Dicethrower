# Dicethrower

Een schermvullende dobbelsteen-app in React en TypeScript, opgemaakt met Bootstrap. Gooi met 1 tot 6 dobbelstenen, bekijk je laatste worpen en zie hoe vaak elke kant is gevallen. De app werkt in 11 talen en volgt automatisch het lichte of donkere thema van je apparaat.

## Functies

- **1 tot 6 dobbelstenen** tegelijk, met een rolanimatie en het totaal van de worp
- **Schermvullend:** de dobbelstenen schalen mee met het scherm, op een telefoon en op een groot scherm
- **Geschiedenis en telling:** de laatste 12 worpen en een staafdiagram met het aantal keer per kant
- **11 talen,** inclusief Arabisch en Urdu van rechts naar links
- **Licht en donker** volgens de systeeminstelling, ook als die wisselt terwijl de app open staat
- Respecteert de instelling voor minder beweging (geen rolanimatie)
- Volledig scherm met één knop, waar de browser dat toestaat

## Techniek

| Onderdeel | Keuze |
| --- | --- |
| Framework | React 18 |
| Taal | TypeScript, `strict` |
| Bouwen | Vite 5 |
| Opmaak | Bootstrap 5.3, alleen de CSS |
| Vertalingen | eigen lichte laag, zonder extra bibliotheek |

## Aan de slag

Je hebt Node.js 18 of nieuwer nodig.

```bash
git clone https://github.com/BrtBnn/Dicethrower.git
cd Dicethrower
npm install
npm run dev
```

Open daarna het adres dat Vite toont, meestal `http://localhost:5173`.

### Scripts

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | ontwikkelserver met direct verversen |
| `npm run typecheck` | alleen de typen controleren |
| `npm run build` | typecheck en productiebuild in `dist/` |
| `npm run preview` | de productiebuild lokaal bekijken |

## Publiceren

`npm run build` maakt een map `dist/` met gewone bestanden. Die kun je op elke statische host zetten, bijvoorbeeld GitHub Pages. De build gebruikt relatieve paden, dus hij werkt ook in een submap.

### Productie op een VPS met Docker

De productie draait op **https://dicethrower.brtbnn.nl**. De Docker-opzet bouwt de app en serveert hem met [Caddy](https://caddyserver.com), dat het HTTPS-certificaat zelf aanvraagt en vernieuwt. Het is één container, zonder aparte webserver of certbot.

Eenmalig:

1. Laat een **A-record** (en eventueel AAAA) van `dicethrower.brtbnn.nl` naar het IP-adres van de VPS wijzen.
2. Zorg dat poort **80 en 443** (TCP, en 443 UDP voor HTTP/3) open staan in de firewall van de VPS.
3. Installeer Docker met de Compose-plug-in op de VPS.

Starten of bijwerken:

```bash
git clone https://github.com/BrtBnn/Dicethrower.git
cd Dicethrower
docker compose up -d --build
```

Een nieuwe versie uitrollen:

```bash
git pull
docker compose up -d --build
```

Nuttig:

```bash
docker compose ps          # status, inclusief healthcheck
docker compose logs -f     # logs volgen
docker compose down        # stoppen (certificaten blijven bewaard in een volume)
```

Het certificaat wordt opgeslagen in het Docker-volume `caddy_data`, dus het blijft bestaan na een herstart of nieuwe build. Gebruik `docker compose down -v` alleen als je het ook wilt verwijderen. Let op dat Let's Encrypt limieten heeft op het aantal nieuwe certificaten.

Lokaal proberen kan met een ander domein:

```bash
DOMAIN=localhost docker compose up --build
```

Open dan `https://localhost`. Caddy maakt daarvoor een eigen certificaat, dus je browser vraagt eenmalig om bevestiging.

## Thema

Licht of donker volgt automatisch de systeeminstelling. Dat gaat via het `data-bs-theme`-attribuut van Bootstrap: een klein script in `index.html` zet het thema voordat de pagina getekend wordt, zodat er niets flitst, en `src/hooks/useSystemTheme.ts` houdt het daarna bij. Eigen stijlen gebruiken alleen Bootstrap-variabelen (`--bs-*`), dus beide thema's kloppen vanzelf.

## Talen

Nederlands, English, 中文, हिन्दी, Español, العربية, Français, বাংলা, Português, Русский en اردو.

De taal volgt de browser en onthoudt je keuze in `localStorage`. Is die niet beschikbaar, dan geldt de keuze alleen voor dat bezoek.

### Een taal toevoegen

Alles staat in `src/i18n/locales.ts`:

1. Voeg een regel toe aan `languages`: code, naam in de eigen taal en schrijfrichting (`ltr` of `rtl`).
2. Voeg een object toe aan `locales` met alle teksten. TypeScript geeft een fout zolang er een taal of een tekst ontbreekt, en `t()` accepteert alleen bestaande sleutels.

Plaatshouders zoals `{n}` blijven in elke taal staan, zoals ze zijn.

## Projectstructuur

```
index.html                   startpagina, zet het thema voor het eerste tekenen
vite.config.ts               Vite-configuratie
tsconfig.json                TypeScript-instellingen (strict)
src/
  main.tsx                   startpunt
  App.tsx                    de app: worp, geschiedenis, bediening
  types.ts                   Face en Roll
  components/                Die, Tally, LanguageSelect, Icons
  hooks/useStageLayout.ts    past de grootte van de dobbelstenen aan het scherm aan
  hooks/useSystemTheme.ts    licht/donker volgens de systeeminstelling
  i18n/locales.ts            talen en vertalingen
  i18n/I18nProvider.tsx      taalkeuze en de functie t()
  styles.css                 indeling en de dobbelsteen zelf, bovenop Bootstrap
Dockerfile                   bouwt de app en zet hem in een Caddy-image
Caddyfile                    HTTPS, compressie, caching en beveiligingskoppen
docker-compose.yml           de service voor productie, met volumes voor certificaten
dobbelsteen.html             de oorspronkelijke versie in één bestand, zonder build
```

## Licentie

[MIT](LICENSE)
