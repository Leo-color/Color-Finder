# GUIDA 4 — Pubblicare su Google Play Store
## Passo per Passo (click dopo click)

> **Prerequisito:** Guida 3 completata, file AAB pronto
> **Costo:** Account sviluppatore Google Play = $25 una tantum
> **Tempo stimato:** 1–2 ore (+ 1–3 giorni di review da Google)

---

## STEP 1 — Crea Account Sviluppatore Google Play

1. Vai su **https://play.google.com/console**
2. Clicca **"Get started"**
3. Accedi con il tuo account Google (o creane uno)
4. Compila il modulo:
   - **Account type:** Individual (se pubblica da solo) o Organization
   - **Developer name:** Il nome che vedrà gli utenti (es. "Solfix Math Labs")
   - **Email address:** La tua email
   - **Phone number:** Il tuo numero di telefono
5. Clicca **"Continue to payment"**
6. Paga **$25** con carta di credito (una tantum, per sempre)
7. Compila i dati di pagamento e conferma

> ⚠️ L'attivazione può richiedere **24–48 ore**. Riceverai una email di conferma.

---

## STEP 2 — Crea una Nuova App

1. Accedi a **https://play.google.com/console**
2. Clicca **"Create app"** (pulsante blu in alto a destra)
3. Compila:
   - **App name:** `Solfix Math - Instant Math Solver`
   - **Default language:** Italian (se il pubblico è italiano) o English
   - **App or game:** `App`
   - **Free or paid:** `Free`
   - Spunta entrambe le dichiarazioni legali
4. Clicca **"Create app"**

---

## STEP 3 — Configura il Profilo dell'App

Nella barra laterale sinistra, completa tutte le sezioni con il pallino arancione:

### 3a — App access
- Clicca **"App access"** → **"All functionality is available without special access"**
- Clicca **"Save"**

### 3b — Ads
- **"Does your app contain ads?"** → **No**
- Clicca **"Save"**

### 3c — Content rating
- Clicca **"Start questionnaire"**
- **Category:** Education
- Rispondi **No** a tutte le domande sulle violenze/contenuti inappropriati
- Clicca **"Save questionnaire"** → **"Calculate rating"**
- Vedrai il rating: **Everyone** (adatto a tutti)
- Clicca **"Apply rating"**

### 3d — Target audience
- **Age groups:** Seleziona **13 and up** (o anche tutti per uso scolastico)
- **Does your app appeal primarily to children under 13?** → **No**
- Clicca **"Next"** → **"Save"**

### 3e — News apps
- **"Is this a news app?"** → **No**
- Clicca **"Save"**

### 3f — COVID-19 contact tracing
- **"Is this a COVID-19 contact tracing..."** → **No**
- Clicca **"Save"**

### 3g — Data safety
Clicca **"Data safety"** nella barra laterale:
1. **"Does your app collect or share any of the required user data types?"** → **No**

   *(Solfix Math non raccoglie dati personali — tutto è locale sul device)*

2. **"Is all of the user data collected by your app encrypted in transit?"** → **Yes**
3. **"Do you provide a way for users to request that their data is deleted?"** → **No**
4. Clicca **"Save"**

---

## STEP 4 — Scheda Store (descrizione, screenshot, icona)

Clicca **"Main store listing"** nella barra laterale:

### App name
```
Solfix Math - Instant Math Solver
```

### Short description (max 80 caratteri)
```
Scan any math expression with your camera and get the answer instantly!
```

### Full description (max 4000 caratteri)
Copia e incolla questo:
```
📸 POINT, SNAP, SOLVE — It's that simple!

Solfix Math uses your camera to instantly read and solve any math expression. No internet required. No subscription. 100% FREE forever.

✨ HOW IT WORKS:
1. Point your camera at a math problem
2. Tap the button
3. See the answer with step-by-step explanation

🧮 WHAT SOLFIX MATH CAN SOLVE:
• Basic arithmetic: 2 + 3 × 4, (15 + 5) / 4
• Equations: x + 7 = 12 → x = 5
• Powers and roots: 2^8 = 256, √144 = 12
• Trigonometry: sin(30°), cos(45°)
• Fractions and percentages: 20% of 150 = 30
• Complex expressions: ((3+5)×2)^2 - 10

📚 STEP-BY-STEP SOLUTIONS:
Don't just get the answer — understand HOW to get there. Solfix Math shows every step of the calculation so you learn while you solve.

🔒 COMPLETELY PRIVATE:
• All processing happens ON YOUR DEVICE
• No photos are uploaded to any server
• No account required
• No internet connection needed (after install)

📱 PERFECT FOR:
• Students (from middle school to university)
• Parents helping with homework
• Teachers checking calculations
• Anyone who works with numbers

📖 HISTORY:
Every solved problem is saved locally so you can review your work anytime.

🚀 FREE FOREVER:
No premium tier. No paywalls. No ads. Just math.

Solfix Math is powered by Google ML Kit for on-device text recognition and mathjs for calculation — both 100% free open-source technologies.
```

### 4a — Graphic assets (immagini richieste)

Devi caricare:

**App Icon (512×512 PNG):**
- Usa il file `assets/icon.png` (già generato)
- Oppure crea una versione 512×512 del tuo logo

**Feature Graphic (1024×500 PNG):**
Crea un'immagine con:
- Sfondo scuro (#0A0A1A)
- Logo Solfix Math a sinistra
- Screenshot dell'app a destra
- Testo "Scan. Solve. Learn." in grande

Strumenti gratuiti per crearla:
- **Canva.com** → cerca template "Google Play Feature Graphic"
- **GIMP** (gratuito)

**Screenshots (minimo 2, risoluzione minima 320px, max 3840px):**
Cattura screenshot dal tuo telefono Android con l'app installata:
1. Schermata fotocamera con il frame di scansione
2. Schermata risultato con un'espressione risolta e i passi

Per catturare screenshot: tieni premuto il tasto `Power + Volume Basso`

---

## STEP 5 — Carica l'AAB (il file dell'app)

1. Nella barra laterale, clicca **"Production"** sotto "Testing"
   *(o clicca "Internal testing" per test iniziale — consigliato)*
2. Clicca **"Create new release"**
3. Clicca **"Upload"** e seleziona il file `.aab` scaricato dalla Guida 3

   > Il file si trova in:
   > - Sul sito expo.dev → Builds → il tuo build → Download
   > - Oppure nella cartella del progetto dopo `eas build`

4. Attendi il caricamento (1–5 minuti)
5. Nel campo **"Release notes"**:
```
Initial release of Solfix Math.

• Instant math expression scanning via camera
• On-device OCR — no internet needed
• Step-by-step solutions
• Equation solver
• History of solved problems
```
6. Clicca **"Save"**
7. Clicca **"Review release"** → verifica che non ci siano errori
8. Clicca **"Start rollout to production"** (o Internal Testing prima)
9. Clicca **"Rollout"** per confermare

---

## STEP 6 — Attendi la Review di Google

- **Internal testing:** Disponibile immediatamente (solo per tester autorizzati)
- **Closed testing:** 1–3 ore
- **Open testing / Production:** **1–3 giorni lavorativi**

Riceverai una email quando l'app è approvata.

---

## STEP 7 — Verifica la Pubblicazione

1. Cerca **"Solfix Math"** sul Google Play Store dal tuo telefono
2. Clicca **"Install"**
3. Testa tutte le funzionalità

---

## Consigli per Aumentare i Download (1M+)

### ASO (App Store Optimization):
- **Keywords** nel titolo: "math solver", "calculator", "homework helper"
- **Screenshots** attraenti con risultati wow
- **Icona** colorata e riconoscibile
- **Risposte alle recensioni** tempestive

### Marketing gratuito:
1. **TikTok/Instagram Reels:** Registra un video dove scatti una foto ad un problema di matematica difficile e l'app lo risolve in 2 secondi → effetto "WOW" virale
2. **Reddit:** Post su r/students, r/maths, r/androidapps
3. **YouTube Shorts:** Tutorial da 60 secondi
4. **Forum scolastici:** Studigram, gruppi Facebook di studenti
5. **ProductHunt:** Lancia l'app su producthunt.com

### Crescita organica:
- L'app è **gratuita al 100%** → zero friction per scaricarla
- **No login** → nessuna barriera
- **Funziona offline** → si usa ovunque, anche senza WiFi

---

## ✅ Checklist Finale Step 4

- [ ] Account sviluppatore Google Play attivo ($25 pagati)
- [ ] App creata sulla console
- [ ] Tutte le sezioni del profilo completate
- [ ] Icona 512×512 caricata
- [ ] Feature graphic 1024×500 caricata
- [ ] Almeno 2 screenshot caricati
- [ ] File AAB caricato
- [ ] Release inviata in review
- [ ] Email di conferma ricevuta

---

**🎉 Congratulazioni! Solfix Math è su Google Play!**

**➡ Prossima guida: GUIDA-05-Aggiornamenti-Virali.md**
