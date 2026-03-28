# GUIDA 3 — Compilare l'APK / AAB per Android
## Passo per Passo

> **Prerequisito:** Guide 1 e 2 completate, account Expo attivo
> **Tempo stimato:** 15–20 minuti (+ 10–20 min di build cloud)

---

## Cos'è EAS Build?

EAS (Expo Application Services) compila l'app **nel cloud gratuitamente**.
Non serve installare nulla di aggiuntivo.

- **APK** = file installabile direttamente su telefoni Android (per test)
- **AAB** = Android App Bundle (richiesto da Google Play)

---

## STEP 1 — Configura EAS nel Progetto

Dalla cartella del progetto, esegui:

```bash
eas build:configure
```

Quando richiesto:
- **"Which platforms would you like to configure?"** → seleziona `Android`
- Premi Invio

Questo aggiorna il file `eas.json` automaticamente.

---

## STEP 2 — Crea il Keystore (firma dell'app)

Il keystore è il "certificato digitale" della tua app. È FONDAMENTALE conservarlo per gli aggiornamenti futuri.

```bash
eas credentials
```

Seleziona:
1. `Android`
2. `Keystore: Upload a new Keystore` oppure `Generate new keystore`
3. Scegli **"Generate new keystore"** → EAS lo crea automaticamente nel cloud

> 💡 **IMPORTANTE:** EAS conserva il keystore per te nel cloud. Se preferisci averlo localmente, scaricalo con `eas credentials` dopo la build.

---

## STEP 3 — Build APK (per test sul telefono)

```bash
eas build -p android --profile preview
```

Il terminale mostrerà:
```
✔ Loaded "eas.json"
✔ Using remote Android credentials
Build in progress...

Build URL: https://expo.dev/builds/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Apri il link nel browser** per monitorare lo stato in tempo reale.

La build richiede **10–20 minuti** (è in coda nel cloud di Expo).

---

## STEP 4 — Scarica e Installa l'APK

Quando la build è completata:
1. Sul sito expo.dev clicca **"Download"** sull'APK
2. Trasferisci il file `.apk` sul telefono Android (via USB o WhatsApp a te stesso)
3. Sul telefono:
   - Vai in **Impostazioni → Sicurezza → Sorgenti sconosciute** → Abilita
   - Apri il file APK → **Installa**
4. Avvia **Solfix Math** dal menu app

---

## STEP 5 — Build AAB (per Google Play)

Quando sei pronto per pubblicare su Google Play:

```bash
eas build -p android --profile production
```

Questo crea un file `.aab` che caricherai su Google Play Console.

---

## STEP 6 — Testare l'OCR sul Dispositivo Reale

Con l'APK installato sul telefono:
1. Apri Solfix Math
2. Consenti accesso alla fotocamera
3. Punta la fotocamera su un'espressione matematica scritta o stampata
4. Premi il pulsante di scatto

### Esempi da testare:
| Espressione | Risultato atteso |
|-------------|------------------|
| `2 + 3 * 4` | `14` |
| `(15 + 5) / 4` | `5` |
| `x + 7 = 12` | `x = 5` |
| `√144` | `12` |
| `2^8` | `256` |
| `20% of 150` | `30` |

---

## Risoluzione Problemi Comuni

### ❌ "Build failed: No credentials found"
```bash
eas credentials -p android
```
Genera un nuovo keystore.

### ❌ "npm install failed"
Prova con:
```bash
npm install --legacy-peer-deps
```

### ❌ L'OCR non rileva il testo
- Assicurati di avere buona illuminazione
- L'espressione deve essere ben leggibile
- Tieni il telefono fermo e a ~20–30 cm di distanza
- Prova a usare "Gallery" con una foto dal PC stampata

---

## ✅ Checklist Finale Step 3

- [ ] `eas build:configure` eseguito
- [ ] Keystore generato e conservato
- [ ] APK di preview scaricato e installato
- [ ] OCR testato con almeno 3 espressioni diverse
- [ ] Tutto funziona correttamente

---

**➡ Prossima guida: GUIDA-04-Google-Play.md**
