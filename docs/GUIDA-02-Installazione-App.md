# GUIDA 2 — Scarica e Installa il Progetto Solvix Math
## Passo per Passo

> **Prerequisito:** Guida 1 completata
> **Tempo stimato:** 10–15 minuti

---

## STEP 1 — Scarica il Codice Sorgente

Apri il Terminale e scegli UNA delle due opzioni:

### Opzione A — Da GitHub (se il progetto è su GitHub)
```bash
git clone https://github.com/leo-color/color-finder.git Solvix Math
cd Solvix Math
git checkout claude/math-expression-solver-app-LNvBr
```

### Opzione B — Copia manuale
Se hai ricevuto il file ZIP:
1. Estrai lo ZIP in una cartella es. `C:\Progetti\Solvix Math` (Windows) o `~/Progetti/Solvix Math` (Mac/Linux)
2. Nel terminale:
```bash
cd ~/Progetti/Solvix Math
```
*(sostituisci con il percorso corretto)*

---

## STEP 2 — Installa le Dipendenze

Dalla cartella del progetto (deve contenere `package.json`), esegui:

```bash
npm install
```

> ⚠️ Questo scarica ~300 MB di librerie. Può richiedere 3–8 minuti.

Alla fine, vedrai qualcosa come:
```
added 1234 packages in 45s
```

---

## STEP 3 — Genera le Immagini dell'App (icona, splash screen)

```bash
npm run generate-assets
```

Vedrà:
```
🎨 Generating assets...
  ✅ icon.png
  ✅ adaptive-icon.png
  ✅ splash.png

✨ All assets generated in /assets/
```

---

## STEP 4 — Configura il Progetto Expo

```bash
eas init --id=<il-tuo-id>
```

> Se non hai mai usato EAS, esegui semplicemente:
```bash
npx expo install
```

Poi controlla che `app.json` abbia il tuo account:
```bash
cat app.json
```
Assicurati che `"slug": "solvixmath"` corrisponda al nome scelto su expo.dev.

---

## STEP 5 — Test in Sviluppo (opzionale ma consigliato)

### Con telefono Android fisico:
1. Installa **Expo Go** dal Google Play Store sul tuo telefono
2. Nel terminale:
```bash
npx expo start
```
3. Scansiona il QR code che appare con Expo Go

> ⚠️ Nota: `react-native-mlkit-ocr` richiede un **development build** per funzionare completamente. In Expo Go l'OCR non funzionerà, ma il resto dell'interfaccia sì.

### Con emulatore Android:
1. Apri Android Studio → AVD Manager → ▶ sul dispositivo virtuale
2. Nel terminale:
```bash
npx expo start --android
```

---

## STEP 6 — Verifica Struttura Cartelle

Apri VS Code nella cartella del progetto:
```bash
code .
```

Dovresti vedere questa struttura:
```
Solvix Math/
├── App.tsx                    ← Entry point
├── app.json                   ← Config Expo
├── package.json               ← Dipendenze
├── babel.config.js
├── metro.config.js
├── eas.json                   ← Config Build
├── assets/
│   ├── icon.png               ← Icona app
│   ├── splash.png             ← Splash screen
│   └── adaptive-icon.png
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx   ← Navigazione
│   ├── screens/
│   │   ├── ScanScreen.tsx     ← Schermata camera
│   │   ├── ResultScreen.tsx   ← Risultato con animazioni
│   │   └── HistoryScreen.tsx  ← Cronologia
│   ├── utils/
│   │   ├── mathSolver.ts      ← Motore matematico
│   │   └── textCleaner.ts     ← Pulizia OCR
│   ├── hooks/
│   │   └── useHistory.ts      ← Gestione cronologia
│   └── theme/
│       └── index.ts           ← Colori e stili
├── scripts/
│   └── generate-assets.js     ← Generatore icone
└── docs/                      ← Queste guide!
```

---

## ✅ Checklist Finale Step 2

- [ ] Codice scaricato/estratto correttamente
- [ ] `npm install` completato senza errori critici
- [ ] Assets generati (icon.png, splash.png, adaptive-icon.png)
- [ ] VS Code aperto con la struttura del progetto visibile

---

**➡ Prossima guida: GUIDA-03-Build-APK.md**
