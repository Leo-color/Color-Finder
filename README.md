# Solvix Math — Instant Math Solver

**Scatta una foto a qualsiasi espressione matematica e ottieni la risposta istantaneamente.**

- Zero API key richieste
- 100% gratuito, funziona offline
- OCR on-device con Google ML Kit
- Pronto per Google Play

---

## Guide Passo per Passo

| # | Guida | Contenuto |
|---|-------|-----------|
| 1 | [Setup Ambiente](docs/GUIDA-01-Setup-Ambiente.md) | Node.js, Git, Expo CLI, Android Studio |
| 2 | [Installazione App](docs/GUIDA-02-Installazione-App.md) | Scarica, installa dipendenze, struttura progetto |
| 3 | [Build APK](docs/GUIDA-03-Build-APK.md) | Compila l'APK con EAS Build (gratis) |
| 4 | [Google Play](docs/GUIDA-04-Google-Play.md) | Pubblica sul Play Store click dopo click |
| 5 | [Crescita Virale](docs/GUIDA-05-Aggiornamenti-Virali.md) | Strategia per 1M+ download |

## Quick Start

```bash
npm install
npm run generate-assets
npx expo start
```

## Build per Google Play

```bash
eas build -p android --profile production
```

## Stack Tecnologico

| Componente | Tecnologia | Costo |
|------------|-----------|-------|
| Framework | React Native + Expo | Gratuito |
| OCR | Google ML Kit (on-device) | Gratuito |
| Math Engine | mathjs | Gratuito |
| Build | EAS Build | Gratuito (30 build/mese) |
| Distribuzione | Google Play | $25 una tantum |
