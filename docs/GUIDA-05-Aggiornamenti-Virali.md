# GUIDA 5 — Aggiornamenti, Crescita e Strategia Virale
## Come arrivare a 1 Milione di Download

> **Prerequisito:** App pubblicata su Google Play (Guida 4)

---

## Come Pubblicare un Aggiornamento

Quando modifichi il codice e vuoi aggiornare l'app su Play Store:

### STEP 1 — Aumenta il version code
Apri `app.json` e modifica:
```json
"version": "1.1.0",        ← Versione visibile agli utenti
"versionCode": 2,           ← Deve aumentare di 1 ogni release
```

### STEP 2 — Fai la build
```bash
eas build -p android --profile production
```

### STEP 3 — Carica su Play Console
1. Vai su play.google.com/console
2. Seleziona Solvix → **Production** → **Create new release**
3. Carica il nuovo AAB
4. Scrivi le note di aggiornamento
5. Pubblica

---

## Roadmap Funzionalità (per crescere)

### Versione 1.1 — Più Matematica
- [ ] Frazioni grafiche (es. `1/2 + 1/3`)
- [ ] Grafici di funzioni (y = mx + b)
- [ ] Conversioni unità di misura
- [ ] Percentuali e proporzioni

### Versione 1.2 — Social
- [ ] Condivisione con immagine stilizzata (risultato + passaggi su card)
- [ ] Widget per home screen Android
- [ ] Dark/Light mode toggle

### Versione 1.3 — Educazione
- [ ] Spiegazione testuale di ogni passaggio
- [ ] "Quiz mode" — l'app ti chiede il risultato prima di mostrarlo
- [ ] Argomenti per materia (geometria, algebra, statistica)

### Versione 2.0 — AI Features (ancora gratuito)
- [ ] Riconoscimento geometria (angoli, triangoli)
- [ ] Risoluzione di sistemi di equazioni
- [ ] Problemi di testo ("Maria ha 5 mele...")
- [ ] LaTeX support

---

## Strategia Virale: Il Piano in 30 Giorni

### Settimana 1 — Lancio Silenzioso
**Obiettivo:** 100 download, raccogliere feedback

Azioni:
1. **WhatsApp/Telegram:** Invia il link ai tuoi contatti
   > *"Ho creato un'app che risolve la matematica con la fotocamera, completamente gratis. Provate e ditemi cosa ne pensate!"*
2. **Instagram Stories:** Screenshot del risultato su un compito vero
3. **Facebook Groups:** Cerca gruppi di studenti italiani e condividi

### Settimana 2 — Contenuto TikTok
**Obiettivo:** 500 download

**Video idea #1 (mega virale):**
```
[Inquadratura del foglio con il problema di matematica]
"Questo problema mi ha fatto impazzire..."
[Apri Solvix]
[Scatta foto]
[Zoom sul risultato: RISPOSTA ESATTA + PASSAGGI]
"RAGA QUESTA APP È ILLEGALE 💀"
#matematica #studenti #hack #school #fyp
```

**Video idea #2:**
```
Mostra un foglio con 10 problemi di matematica
"Risolvo 10 problemi di matematica in 60 secondi"
[Time-lapse: scatti foto uno dopo l'altro]
"Tutti corretti 🎯"
```

**Video idea #3:**
```
"POV: hai la verifica domani"
[Stai per studiare ma usi Solvix per fare i compiti velocemente]
[Risultati istantanei]
"Grazie Solvix 🙏"
```

### Settimana 3 — Reddit e Forum
**Obiettivo:** 2.000 download

Posta su:
- **r/italy** — "Ho fatto un'app che risolve la matematica con la fotocamera, gratis"
- **r/androidapps** — "I made a free math solver app using Google ML Kit (no API, no account)"
- **r/students** — "Free math photo solver app I made for students"
- **r/learnmath** — Post educativo sull'uso dell'app
- Forum.it, Hwupgrade.it, Skuola.net

### Settimana 4 — Press & Partnership
**Obiettivo:** 10.000 download

1. **Email a blogger tech italiani:**
   > Soggetto: "Ho creato un'app completamente gratuita che risolve la matematica con la fotocamera"
   > Siti: iPhoneItalia, Androidiani, GizChina Italia, Tom's Hardware Italia

2. **ProductHunt launch:**
   - Crea account su producthunt.com
   - Pianifica il lancio per un martedì/mercoledì (più traffico)
   - Prepara: tagline, screenshot, GIF demo

3. **YouTube:**
   - Crea un video tutorial da 3 minuti
   - Titolo: "App GRATIS che risolve qualsiasi problema matematico con la fotocamera"

---

## Metriche da Monitorare

Nella Google Play Console, tieni d'occhio:

| Metrica | Target Mese 1 | Target Mese 3 | Target Mese 6 |
|---------|---------------|----------------|----------------|
| Downloads | 1.000 | 10.000 | 100.000 |
| Rating | 4.0+ | 4.2+ | 4.4+ |
| Retention Day 1 | 40% | 45% | 50% |
| Retention Day 7 | 15% | 20% | 25% |

### Come migliorare il Rating:
1. Rispondi a TUTTE le recensioni negative entro 24 ore
2. Aggiungi le funzionalità richieste dagli utenti
3. Chiedi agli utenti soddisfatti di lasciare una recensione:
   - Dopo una soluzione riuscita, mostra un popup gentile:
   *"Ti piace Solvix? ⭐ Lascia una recensione!"*

---

## Monetizzazione (opzionale — per dopo i 100K downloads)

Mantenendo l'app gratuita ma aggiungendo ricavi:

### Opzione A — Banner Ads (AdMob)
- Installa `react-native-google-mobile-ads`
- Mostra banner discreto nella HistoryScreen
- Stima: $0.50–$2 per 1000 utenti/giorno

### Opzione B — "Solvix Pro" (in-app purchase)
Funzionalità premium a $0.99/mese:
- Risoluzione sistemi di equazioni
- Grafici di funzioni
- Export PDF dei passaggi
- Nessuna pubblicità

### Opzione C — Donazioni
- Aggiungi bottone "Support the developer" (Ko-fi, PayPal)
- Molti utenti felici donano volentieri

---

## Checklist Crescita

- [ ] 10 persone del tuo giro hanno scaricato e testato l'app
- [ ] Almeno 1 video TikTok pubblicato
- [ ] Post su Reddit r/androidapps
- [ ] Risposta a tutte le prime recensioni
- [ ] Primo aggiornamento con bugfix rilasciato
- [ ] Metriche Play Console monitorate settimanalmente

---

## In Bocca al Lupo! 🚀

Ricorda: le app virali hanno successo perché:
1. **Risolvono un problema reale** ✅ (la matematica è difficile per tutti)
2. **Sono gratis** ✅ (zero barriera d'ingresso)
3. **Funzionano offline** ✅ (usabile ovunque)
4. **Hanno un effetto "WOW"** ✅ (scatto foto → risposta magica)
5. **Sono facili da condividere** ✅ (tasto share in app)

Solvix ha tutti questi ingredienti. Ora tocca a te!
