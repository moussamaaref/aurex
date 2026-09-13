# Cahier des Charges : Site Front Office EUREX

## 1. Aperçu du Projet

Ce document définit les spécifications complètes pour le site front office d'EUREX, une application React + Vite + Tailwind CSS permettant la modification de tous les détails du site. Le projet existe déjà avec une structure configurée et nécessite des spécifications détaillées pour l'administration complète des contenus.

## 2. Architecture Technologique

- **Framework** : React 19 + React DOM 19
- **Build** : Vite 8
- **Styling** : Tailwind CSS v4
- **Routing** : react-router-dom 7
- **ETats globaux** : i18next, CompareContext
- **Cartographie** : Leaflet
- **Formatage** : oxfmt

## 3. Structure des Pages (13 routes)

| Route | Page | Fichier |
|-------|------|---------|
| `/` | HomePage | `src/pages/HomePage.tsx` |
| `/produits` | ProductsPage | `src/pages/ProductsPage.tsx` |
| `/produits/:category` | ProductsPage (filtrée) | `src/pages/ProductsPage.tsx` |
| `/produits/:category/:id` | ProductDetailPage | `src/pages/ProductDetailPage.tsx` |
| `/comparateur` | ComparePage | `src/pages/ComparePage.tsx` |
| `/smart-home` | SmartHomePage | `src/pages/SmartHomePage.tsx` |
| `/technologies` | TechnologiesPage | `src/pages/TechnologiesPage.tsx` |
| `/support` | SupportPage | `src/pages/SupportPage.tsx` |
| `/a-propos` | AboutPage | `src/pages/AboutPage.tsx` |
| `/distributeurs` | DistributorsPage | `src/pages/DistributorsPage.tsx` |
| `/actualites` | NewsPage | `src/pages/NewsPage.tsx` |
| `*` | NotFound | `src/App.tsx` |

## 4. Composants Principaux

### 4.1 Header (`src/components/Header.tsx`)
- Logo et navigation principale
- Recherche produit
- Panier/compte utilisateur
- Basculement langue (i18n)
- Responsif (mobile/desktop)

### 4.2 Footer (`src/components/Footer.tsx`)
- Liens rapides
- Informations légales
- Réseaux sociaux
- Coordonnées

### 4.3 CompareContext & CompareButton/CompareToast
- Gestion de la comparaison de produits
-Toast de notification

## 5. Fonctionnalités d'Administration Complète

### 5.1 Gestion des Contenus Textuels

Chaque page doit être entièrement modifiable via une interface d'administration :

- **Titles et descriptions** (SEO : title, meta description, meta keywords)
- **Hero sections** (titres, sous-titres, CTA, images d'arrière-plan)
- **Blocs de contenu** (rich text avec i18next support)
- **Pieds de page** (tous les liens, textes légaux)

### 5.2 Gestion Produits (ProductsPage & ProductDetailPage)

- **Catalogue complet** : ajouter, éditer, supprimer des produits
- **Chaque produit** :
  - Nom, description, prix
  - Catégorie et sous-catégorie
  - Images multiples (gallery)
  - Stock disponible
  - Tags/mots-clés
  - Spécifications techniques
- **Filtrage par catégorie** dynamique
- **Tri** (prix, nom, popularité)

### 5.3 Gestion de la Page de Comparaison

- Sélection multiple de produits
- Tableau comparatif dynamique
- Export/print des comparaisons
- Notification toast confirmation

### 5.4 Gestion Cartographique (Leaflet)

- **Map markers** positionnables avec icônes personnalisées (`.aurex-map-marker`)
- **Fullscreen map** mode (`.aurex-map-fullscreen`)
- **Heatmaps** ou indicateurs de densité
- **Itinéraires** entre points
- Localisation utilisateur

### 5.5 Gestion des Animations et Design

Toutes les animations définies dans `src/index.css` doivent être configurables :

- **Ken Burns** (`animate-ken-burns`) : slideshow d'images avec zoom
- **Fades** (`animate-fade-in`, `animate-fade-in-down`)
- **Slides** (`animate-slide-up`)
- **Retenu réduite** (`prefers-reduced-motion`) : désactiver animations

### 5.6 Thème et Couleurs

Le thème actuel dans `src/index.css` définit :

```
--color-primary: #0A2463
--color-primary-dark: #061540
--color-primary-light: #1A3A7A
--color-accent: #1E5EF3
--color-accent-hover: #1a51d4
--color-navy: #0A2463
--color-surface: #F9FAFB
--color-surface-2: #EFF3FB
--color-ink: #0D1117
--color-ink-muted: #64748B
--color-border-light: #E2E8F0
```

**Tous ces valeurs doivent être modifiables via l'admin.**

### 5.7 Internationalisation (i18next)

- Toutes les chaînes de caractères doivent passer par `useTranslation`
- Languages supportés : au minimum français (`fr`) et arabe (`ar`)
- Support RTL pour arabe
- **Tous les texts d'erreur, succès, labels doivent être externes**

### 5.8 Composants Réutilisables Modifiables

| Composant | Points de personnalisation |
|-----------|---------------------------|
| `Header` | Logo, menus, couleurs, icônes |
| `Footer` | Liens, texte copyright, réseaux sociaux |
| `AboutPage` | Story, valeurs, équipe, images |
| `DistributorsPage` | Liste distributeurs, filtres, cartes |
| `NewsPage` | Articles, catégories, pagination |
| `SupportPage` | Formulaire contact, FAQ, tickets |

## 6. Exigences Techniques

### 6.1 Architecture

- **Composants fonctionnels** React avec hooks
- **TypeScript** pour la typage strict
- **Composition** plutôt que héritage
- **Séparation concerns** : UI, logique, données

### 6.2 Performance

- **Lazy loading** des pages et composants lourds
- **Code splitting** via dynamic imports (déjà dans `App.tsx` avec `import`)
- **Images optimisées** (next-gen formats, responsive)
- **CSS purge** via Tailwind v4
- **Score Lighthouse** > 90

### 6.3 Accessibilité

- Focus visible sur tous les interactifs
- Contraste minimal respecté (colors définies)
- Navigation clavier complète
- Labels de formulaires corrects
- `aria-label` sur composants critiques
- Support lecteur d'écran

### 6.4 Sécurité

- Validation côté client + serveur
- Protection XSS sur contenus utilisateur
- CSP headers configurables
- Authentification admin isolée

## 7. Interface d'Administration Requise

### 7.1 Pages à Administrer

Chaque page de l'application doit avoir une section d'édition dans l'admin :

1. **Accueil** - Hero, sections avantages, logos partenaires
2. **Produits** - Catalogue complet avec filtres
3. **Produit Detail** - Fiche produit complète
4. **Comparateur** - Interface de sélection
5. **Smart Home** - Features et icônes
6. **Technologies** - Badges et logos tech
7. **Support** - Formulaire, FAQ
8. **À propos** - Story, équipe, valeurs
9. **Distributeurs** - Liste et cartes
10. **Actualités** - Blog/actualités

### 7.2 Fonctions Admin

- [ ] Authentification sécurisée (SSO ou email/mot de passe)
- [ ] Éditeur WYSIWYG pour rich text
- [ ] Gestion d'images (upload, crop, gallery)
- [ ] Aperçu en temps réel du site
- [ ] Versionning des modifications
- [ ] Logs d'opérations
- [ ] Export/import de configuration
- [ ] Mode "coming soon" / maintenance

### 7.3 Intégration Existante

L'admin doit s'intégrer avec :
- `react-i18next` pour les textes
- `leaflet` pour les cartes
- `react-router-dom` pour la navigation
- `Tailwind CSS` pour le styling
- `.env.local` pour les variables d'environnement

## 8. Fichiers de Configuration Clés

### 8.1 `src/index.css` - Thème Global

Toutes les variables CSS ci-dessus plus :
- Fonts Google ou custom
- Keyframes animations
- Media queries breakpoints
- Print styles

### 8.2 `vite.config.ts` - Configuration Build

Plugins React, Tailwind v4, Figma Make plugins.

### 8.3 `package.json` - Dependencies

Scripts :
- `dev` : `vite --host 0.0.0.0`
- `build` : `vite build`
- `preview` : `vite preview`
- `format` : `oxfmt`

### 8.4 `.env.local` - Variables d'Environnement

Clés API, URLs d'admin, config features flags.

## 9. Roadmap de Développement

### Phase 1 : Foundation
- [x] Structure de base (déjà existante)
- [ ] Interface d'administration basique
- [ ] Configuration thème complet
- [ ] Support i18n complet

### Phase 2 : Content Management
- [ ] Éditeur de pages complètes
- [ ] Gestion produits (CRUD)
- [ ] Galerie images
- [ ] Filtrage et tri

### Phase 3 : Advanced Features
- [ ] Comparateur produit avancé
- [ ] Cartographie interactive
- [ ] Filtres avancés
- [ ] Recherche full-text

### Phase 4 : Polish & Scale
- [ ] Performance optimization
- [ ] Accessibilité WCAG
- [ ] Analytics integration
- [ ] PWA capabilities

## 10. Contraintes et Notes

1. **Projet Figma Make** : L'application tourne à l'intérieur de Figma Make - les déployments doivent considérer cet environnement
2. **Host 0.0.0.0** : Le dev server écoute sur toutes les interfaces (`vite --host 0.0.0.0`)
3. **Tailwind v4** : Pas besoin de fichier config Tailwind séparé - tout dans `src/index.css`
4. **TypeScript 5.7** : Typage strict requis
5. **React 19** : Dernières features et patterns
6. **Leaflet 1.9** : Cartographie existante avec styles `.aurex-*` personnalisés

## 11. Acceptation

Ce cahier des charges définit l'étendue complète pour un site front office EUREX entièrement modifiable. Toute fonctionnalité supplémentaire ou modification de portée doit faire l'objet d'un amendement à ce document.

---
*Document généré pour le projet Figma Make - Web App for EUREX*