# GUIDA 1 — Installazione Ambiente di Sviluppo
## MathSnap · Passo per Passo

> **Tempo stimato:** 30–45 minuti
> **Sistema operativo:** Windows 10/11, macOS, o Ubuntu/Debian

---

## STEP 1 — Installa Node.js

1. Apri il browser e vai su **https://nodejs.org**
2. Clicca sul pulsante **"LTS"** (la versione stabile, es. 20.x)
3. Scarica il file `.msi` (Windows) o `.pkg` (macOS)
4. Esegui il file scaricato e segui il wizard:
   - ✅ "Add to PATH" deve essere spuntato
   - Clicca **Next** → **Next** → **Install**
5. Riavvia il computer dopo l'installazione

**Verifica:**
Apri il Terminale (o CMD su Windows) e digita:
```
node --version
```
Deve rispondere: `v20.x.x` (o simile)

---

## STEP 2 — Installa Git

1. Vai su **https://git-scm.com/downloads**
2. Scarica la versione per il tuo sistema operativo
3. Installa con le opzioni di default (clicca "Next" ovunque)
4. Al termine, apri Terminale e digita:
```
git --version
```
Deve rispondere: `git version 2.x.x`

---

## STEP 3 — Installa Expo CLI + EAS CLI

Nel terminale, esegui questi comandi **uno alla volta**:

```bash
npm install -g expo-cli
npm install -g eas-cli
```

Attendi il completamento (1–3 minuti ciascuno).

**Verifica:**
```bash
expo --version
eas --version
```

---

## STEP 4 — Crea un Account Expo (gratuito)

1. Vai su **https://expo.dev**
2. Clicca **"Sign Up"** in alto a destra
3. Compila: nome, email, password
4. Conferma l'email (controlla la casella di posta)
5. Torna al terminale e fai il login:
```bash
eas login
```
Inserisci email e password quando richiesto.

---

## STEP 5 — Installa Android Studio (per testare su emulatore)

> *Puoi saltare questo step se hai un telefono Android fisico.*

1. Vai su **https://developer.android.com/studio**
2. Clicca **"Download Android Studio"**
3. Installa il software (dimensione ~1 GB)
4. Al primo avvio, esegui il Setup Wizard:
   - Scegli **"Standard"** installation
   - Accetta tutte le licenze
5. Crea un dispositivo virtuale (AVD):
   - Apri Android Studio → **More Actions** → **Virtual Device Manager**
   - Clicca **"+"** → seleziona **Pixel 8** → **Next**
   - Scegli API Level **34** → **Next** → **Finish**

---

## STEP 6 — Installa un Editor di Codice

1. Vai su **https://code.visualstudio.com**
2. Scarica e installa **Visual Studio Code**
3. Apri VS Code
4. Premi `Ctrl+Shift+X` (o `Cmd+Shift+X` su Mac)
5. Cerca e installa le estensioni:
   - **React Native Tools**
   - **TypeScript and JavaScript**
   - **Prettier - Code formatter**

---

## ✅ Checklist Finale Step 1

Prima di procedere alla Guida 2, verifica che tutto funzioni:

- [ ] `node --version` → risponde con v18 o superiore
- [ ] `git --version` → risponde correttamente
- [ ] `expo --version` → risponde correttamente
- [ ] `eas --version` → risponde correttamente
- [ ] Account Expo creato e `eas login` completato
- [ ] VS Code installato

---

**➡ Prossima guida: GUIDA-02-Installazione-App.md**
