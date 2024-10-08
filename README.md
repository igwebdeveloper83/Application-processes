# Bewerbungsprozesse-Management-System

Dieses Projekt ist eine Webanwendung zur Verwaltung und Nachverfolgung von Bewerbungsprozessen. Es ermöglicht Benutzern, Interviews zu organisieren, Bewerbungsstatus zu verfolgen und statistische Auswertungen zu erstellen. Die Anwendung ist mit modernsten Technologien wie Vue.js, TypeScript, Pinia und Firebase entwickelt, um eine reaktive und benutzerfreundliche Erfahrung zu bieten.

## Features

- **Benutzerverwaltung**: Authentifizierung über Firebase, um sicherzustellen, dass nur autorisierte Benutzer auf ihre persönlichen Interviewdaten zugreifen können.
- **Interviewliste**: Übersicht über alle erstellten Interviews mit Filtermöglichkeiten basierend auf dem Status (z.B. "Offer", "Refusal").
- **Interviewdetails**: Bearbeiten und Löschen einzelner Interviews, inklusive Kontaktdetails und Interviewstufen.
- **Statistiken**: Visualisierung der Ergebnisse durch ein übersichtliches Diagramm (z.B. Anteile von "Offer", "Refusal", "In progress").
- **Firebase Integration**: Verwendung der Firestore-Datenbank für Echtzeit-Datenverarbeitung und -speicherung.

## Technologien

- **Vue 3**: Progressives Frontend-Framework für eine flexible und leistungsstarke UI-Entwicklung.
- **TypeScript**: Statisch typisierte Sprache für fehlerfreies und skalierbares JavaScript.
- **Pinia**: State-Management-Bibliothek für zentrale Verwaltung der Zustände innerhalb der Anwendung.
- **Firebase Firestore**: Cloud-basierte NoSQL-Datenbank für die Verwaltung und Speicherung der Interviewdaten.
- **PrimeVue**: UI-Komponenten-Bibliothek für eine ansprechende und funktionale Benutzeroberfläche.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
