# Design System — Ping Pang Paris

> Club de ping-pong premium parisien. Identité éditoriale, sportive et raffinée. Tension entre minimalisme épuré (fond blanc, typographie serif imposante) et profondeur sportive (vert sapin contrasté, photographies en noir et blanc).

---

## 1. Direction artistique

**Concept** : *FOR ATHLETES, by athletes* — un club premium qui revendique son sérieux sportif tout en cultivant une esthétique magazine/lifestyle.

**Tonalité** :
- **Éditoriale** : grandes typographies serif, hiérarchie forte, mise en page aérée façon magazine.
- **Sportive et brute** : photographies noir & blanc à fort contraste, énergie, mouvement.
- **Premium discret** : vert sapin profond utilisé avec parcimonie comme signature, blanc dominant, accents dorés réservés aux statuts (Gold Membership).
- **Bilingue / international** : sélecteur EN, copy mêlant français et anglais (« PLAY BETTER », « FOR ATHLETES by athletes »).

**Mots-clés esthétiques** : éditorial · sportif · monochrome · serif · contraste · bilingue · authentique.

---

## 2. Palette de couleurs

### Couleurs principales

| Token | Hex (estimé) | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Fond dominant (95% des écrans) |
| `--color-ink` | `#0E0E0E` | Texte principal, logo, titres |
| `--color-forest` | `#0E3D2E` | **Couleur signature** — footer, sections sombres, CTA primaire, prix, accent graphique (créneaux pleins) |
| `--color-forest-deep` | `#0A2D22` | Hover du vert, profondeur |
| `--color-cream` | `#FAFAF7` | Fond alternatif très subtil pour cartes |
| `--color-line` | `#E5E5E0` | Séparateurs, bordures fines des cartes tarifs |
| `--color-muted` | `#6B6B6B` | Texte secondaire, libellés (« À partir de ») |

### Couleurs accents (statut & ponctuation)

| Token | Hex (estimé) | Usage |
|---|---|---|
| `--color-gold` | `#C9A86A` | Badge « Le Club » Gold Membership |
| `--color-silver` | `#9A9A93` | Badge « Le Club » Platinium Membership |
| `--color-red` | `#D7222A` | Pastille raquette rouge (Play Half), cœur Carte Cadeau |
| `--color-paddle-wood` | `#D8B98A` | Manche des raquettes décoratives |

### Règles d'usage

- **Le blanc domine massivement** ; le vert sapin est utilisé comme signature ponctuelle, jamais comme fond plein de page entière sauf footer et bandeaux dédiés.
- Le vert apparaît dans : footer, CTA actif (`Deviens membre` Gold), mots-clés en italique des titres (« *by athletes* »), créneaux « heures pleines » du planning, éléments graphiques.
- Les accents or/argent sont **strictement** réservés aux badges d'abonnement.
- Pas de gradients, pas de couleurs vives — sobriété éditoriale.

---

## 3. Typographie

Le site repose sur **deux familles** très contrastées : un serif éditorial pour l'expression et la hiérarchie, et un sans-serif géométrique très étroit pour la navigation et les libellés.

### Familles

```css
--font-display: 'Playfair Display', 'GT Sectra', 'Tiempos Headline', Georgia, serif;
--font-body: 'Playfair Display', Georgia, serif; /* le serif est aussi utilisé en body */
--font-ui: 'Neue Haas Grotesk Display', 'Inter Tight', 'Helvetica Neue', sans-serif;
--font-script: 'Caveat', 'Reenie Beanie', cursive; /* "Let's play better together!" */
```

> **Note** : le logo `PING PANG effect` est un lettrage custom (graffiti/marker) — à conserver en SVG, pas reproduit en webfont.

### Échelle typographique

| Rôle | Police | Taille | Poids | Tracking | Casse |
|---|---|---|---|---|---|
| Display H1 (« PRIX & ABONNEMENTS », « HEURES CREUSES/PLEINES ») | `--font-display` | clamp(48px, 6vw, 96px) | 600 | -0.01em | UPPERCASE |
| Hero H1 (« PLAY BETTER? ») | `--font-display` | clamp(56px, 8vw, 120px) | 600 | -0.02em | UPPERCASE |
| Italique éditorial (« *by athletes* », « *Let's play better together!* ») | `--font-display` *italic* | clamp(40px, 5vw, 80px) | 400 *italic* | 0 | Sentence |
| H2 section (« Nos offres », « ANMTT x PPP ») | `--font-display` | 28–36px | 500 | 0 | Sentence |
| H3 carte (« Play Half », « Gold Membership ») | `--font-display` | 22–24px | 500 | 0 | Sentence |
| Prix (« 70€/mois », « 30min ») | `--font-display` | 36–44px | 600 | -0.01em | — |
| Body | `--font-display` | 15–16px | 400 | 0 | Sentence |
| Nav / Logo wordmark (« PING PANG PARIS ») | `--font-ui` | 13–14px | 600 | 0.18em | UPPERCASE |
| Libellés (« À partir de », « Heures creuses ») | `--font-ui` | 12–13px | 400 | 0.04em | Sentence |
| Footer titres (« NOUS SUIVRE », « PING PANG PARIS ») | `--font-ui` | 14px | 700 | 0.12em | UPPERCASE |
| Microcopy / footer liens | `--font-ui` | 12–13px | 400 | 0.06em | Sentence |

### Règles typographiques

- **Les grands titres sont systématiquement en serif UPPERCASE** avec un mot ou deux en italique pour créer la respiration éditoriale (« FOR ATHLETES *by athletes* »).
- La navigation, le logo wordmark, les boutons et les badges sont en **sans-serif tracké** (espacement inter-lettres marqué).
- Pas de mélange chaotique : 2 familles maximum + le script manuscrit pour 1 ou 2 occurrences seulement.
- Le serif est utilisé même pour le body — c'est une signature, pas une erreur d'accessibilité tant que la taille reste ≥ 15px et l'interligne ≥ 1.5.

---

## 4. Logo & marque

Deux verrouillages à connaître :

1. **`PING PANG PARIS`** — wordmark sans-serif, tracking large, casse haute. Utilisé en header centré et comme signature institutionnelle.
2. **`PING PANG effect`** — logo lettering manuscrit/graffiti noir sur blanc. Utilisé pour les **collections capsules / collabs** (ex : ANMTT × PPP) et les contextes lifestyle/produit.

**Règles** :
- Toujours en noir pur sur fond clair, ou en blanc sur fond `--color-forest`.
- Espace de respiration minimum : équivalent à la hauteur d'un caractère du wordmark.
- Ne jamais étirer, recolorer (sauf inversion), ni placer sur photo non contrôlée.

---

## 5. Layout & grille

### Structure de page

- **Largeur max conteneur** : 1280px (gouttières 32px desktop, 16px mobile).
- **Grille** : 12 colonnes desktop, 6 tablette, 4 mobile.
- **Header** : fixe haut, fond blanc, deux niveaux : (1) nav primaire + logo centré + panier/login/langue ; (2) sous-nav contextuelle (`ACCUEIL · TARIFS · OFFRES · HORAIRES & LIEU`) avec souligné actif.
- **Sections** : alternance fond blanc / image pleine largeur / fond `--color-forest` pour le footer et les bandeaux contact.
- **Espacement vertical entre sections** : 96–128px desktop, 64px mobile.

### Patterns de composition

- **Section hero photographique** : image N&B pleine largeur, titre serif en overlay avec ombre douce ou sans ombre selon contraste de l'image, CTA blanc fin centré.
- **Grille de cartes tarifs** : 4 colonnes desktop pour les offres ponctuelles, 2 colonnes pour les memberships, alignées sur la même grille.
- **Section éditoriale image + texte** : 50/50 en desktop, image à gauche ou en bloc composé (mosaïque de 3 photos avec disque blanc « PING PANG PARIS » qui se superpose).
- **Composition « cercle »** : section *Rejoins le club* — disque blanc avec wordmark au centre, photos disposées autour reliées par un trait fin = signature visuelle identitaire.
- **Asymétrie volontaire** : titres alignés à gauche, italique légèrement décalé sous le mot droit (« FOR ATHLETES » à gauche, *« by athletes »* indenté en dessous).

---

## 6. Composants

### 6.1 Boutons

```
┌──────────────────────────┐
│       Réserver           │   → bouton outline (défaut)
└──────────────────────────┘   bordure 1px noir, fond blanc, label serif
```

```
┌──────────────────────────┐
│      Deviens membre      │   → bouton primaire (Gold)
└──────────────────────────┘   fond --color-forest, texte blanc, label serif
```

| Variante | Fond | Bordure | Texte | Hauteur | Padding |
|---|---|---|---|---|---|
| Primary | `--color-forest` | none | `#fff` serif 16px | 48px | 28px |
| Outline | transparent | 1px `--color-ink` | `--color-ink` serif 16px | 48px | 28px |
| Outline-light (sur photo) | transparent | 1px `#fff` | `#fff` serif 16px | 48px | 28px |
| Lien fléché | transparent | none | serif italique + `→` | inline | 0 |

- **Radius** : 0 (boutons strictement rectangulaires — c'est un parti pris esthétique).
- **Hover** : inversion fond/texte sur outline ; passage `--color-forest-deep` sur primary.
- **Le label est toujours en serif**, jamais en sans-serif. Pas d'icônes dans les boutons sauf la flèche `→`.

### 6.2 Cartes tarifs

Anatomie verticale d'une carte :

```
┌────────────────────────────────┐
│ 🏓 (icône raquette colorée)    │  ← 32px, top-left
│                                │
│ Play Half                      │  ← serif 22px
│ À partir de                    │  ← ui 12px tracké, --color-muted
│ 30min                          │  ← serif 40px bold
│                                │
│ Heures creuses: 10€            │  ← serif 14px
│ Heures pleines: 15€            │
│                                │
│ ┌──────────────────────────┐   │
│ │   Réserver une table     │   │  ← bouton outline plein largeur
│ └──────────────────────────┘   │
│ ────────────────────────────   │  ← séparateur
│ ✓ Raquettes et balles incluses │  ← serif 13px + check fin
└────────────────────────────────┘
   bordure 1px --color-line
   padding 28px
   pas de radius (corners nets)
```

**Variantes** :
- **Carte standard** (Play Half / Play One / Play Ten / Carte Cadeau) — bouton outline.
- **Carte Cadeau** — icône cœur rouge, bouton « Nous contacter » sur fond vert avec mention « Available for 3 months period of time ».
- **Membership card** — badge `Le Club` (or pour Gold, argent pour Platinum) en haut, prix mensuel mis en valeur, bouton primaire `Deviens membre`, liste de bénéfices avec checkmarks.

### 6.3 Badges

```
┌─────────┐
│ Le Club │   → background pill --color-gold ou --color-silver
└─────────┘   serif italique, 11px, padding 4px 10px, radius full
```

### 6.4 Toggle (Tarif normal / Tarif réduit)

Switch horizontal classique avec deux libellés de part et d'autre, pastille vert sapin sur rail blanc bordé. Utilisé pour basculer la grille tarifaire entière.

### 6.5 Formulaire de contact

Style **épuré au trait** sur fond `--color-forest` :
- Champs sans box, juste une **ligne fine blanche en bas** (1px, opacity 0.4).
- Label au-dessus en sans-serif blanc 12px tracké.
- Texte saisi en serif blanc 16px.
- Sticker manuscrit décoratif « *Let's play better together!* » dans une bulle blanche en haut à gauche.
- Bouton `Envoyer` outline blanc, aligné à droite.

### 6.6 Bouton flèche (lien voir plus)

Texte serif italique + flèche `→` soulignée seulement au survol. Utilisé pour « Voir plus », « Voir nos heures creuses & pleines », « Voir la collection ».

### 6.7 Carrousel d'offres

Cartes images pleines (« JOUER AVEC UN PRO », « TEAM BUILDING ») avec titre superposé en serif blanc 32px UPPERCASE en bas-gauche. Navigation par flèches circulaires `←` `→` en haut à droite de la section.

### 6.8 Planning créneaux (Heures creuses/pleines)

Représentation en **barres horizontales pilule** (radius full) :
- **Heures creuses** : barre outline 1px `--color-line`, fond transparent.
- **Heures pleines** : barre pleine `--color-forest`.
- Légende avec deux pilules d'exemple + flèche `→` libellé.
- Axe Y : heures (10h → 00h) en sans-serif 11px à gauche.
- Axe X : jours de la semaine en serif 14px en haut.
- Hauteur de barre ~6px, gap vertical 8px.

### 6.9 Footer

- Fond `--color-forest`, texte blanc.
- 4 colonnes desktop : (1) `NOUS SUIVRE` + champ email outline blanc + flèche d'envoi + icônes Facebook/Instagram cerclées blanches ; (2) `PING PANG PARIS` (liens icons/essential/effect/all) ; (3) `PING PANG LE CLUB` (accueil/pricing/packages/horaires) ; (4) `LEGAL POLICY` (CGV/Confidentialité/Décharge).
- Copyright centré en bas : `© Ping Pang Paris 2026`.
- Au-dessus du footer principal : un **mini-bandeau Ping Pang Café** beige/cream avec illustration silhouette joueur, hours de café (« Lun-Ven : 10h–22h ») = touche lifestyle.

---

## 7. Iconographie

- **Style** : ligne fine 1.5px, rounded caps, taille 16–24px, couleur `--color-ink` ou `--color-forest`.
- **Set** : panier, login, globe (langue), check (✓), flèche fine (`→`), réseaux sociaux (cerclés sur fond vert).
- **Pictos métier** : raquettes de ping-pong stylisées avec pastille colorée (rouge ou noire) selon l'offre, manche bois — c'est l'illustration signature des cartes tarifs.
- **Cœur rouge** plein pour Carte Cadeau.
- Pas d'icônes 3D, pas de duotone, pas d'emoji.

---

## 8. Imagerie & photographie

**Style éditorial impératif** :
- **Noir & blanc dominant**, contraste élevé, grain léger acceptable.
- Sujets : joueurs, ambiance club, mains sur raquette, regards, action, posters de marque.
- Cadrages : plans serrés, portraits, photo de groupe documentaire.
- Aucune photo banque d'image colorée façon « lifestyle stock ». Préférer un photographe identifié, esthétique cohérente.
- Couleur autorisée : photos produit (collection) sur fond neutre, photos café.
- Les images vivent **pleine largeur** ou **dans une grille 2/3 colonnes** sans border-radius.

---

## 9. Motion & interactions

Discret, jamais clinquant.

- **Fade-up** sur les sections au scroll (translate Y 16px → 0, opacity 0 → 1, durée 600ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`).
- **Hover boutons** : transition 200ms sur background et color.
- **Hover cartes tarifs** : élévation très subtile (translateY -2px) + bordure qui passe de `--color-line` à `--color-ink`, 200ms.
- **Hover liens flèche** : la flèche `→` se décale de 4px vers la droite, transition 250ms.
- **Carrousel offres** : transition 500ms ease-in-out entre slides.
- **Toggle tarifs** : pastille glisse 250ms.

Pas de parallax lourd, pas d'animations infinies, pas de marquees.

---

## 10. Accessibilité

- **Contraste** : `--color-ink` sur `--color-bg` AAA ; `#fff` sur `--color-forest` AAA. Vérifier `--color-muted` sur blanc (AA seulement — réserver aux libellés secondaires).
- **Tailles texte** : minimum 14px pour le body, 12px pour les microcopy uniquement.
- **Focus visibles** : outline 2px `--color-forest` + offset 2px sur tous les éléments interactifs.
- **Toggle tarif réduit** : étiqueté ARIA, état lisible.
- **Formulaire** : labels associés, messages d'erreur en serif rouge sous le champ.
- **Multilingue** : `lang="fr"` racine, sélecteur EN bascule vers `lang="en"`.

---

## 11. Responsive

| Breakpoint | Largeur | Comportement clé |
|---|---|---|
| Mobile | ≤ 640px | Nav burger, logo centré, sections empilées, cartes tarifs en 1 colonne, hero hauteur réduite, footer 1 colonne |
| Tablet | 641–1024px | Cartes tarifs en 2 colonnes, footer 2 colonnes |
| Desktop | 1025–1440px | Layout cible décrit ci-dessus, 4 cartes tarifs sur une ligne |
| Wide | > 1440px | Conteneur reste à 1280px, marges automatiques |

Le serif imposant des grands titres est **fluide** via `clamp()` pour ne jamais déborder ni paraître ridicule sur mobile.

---

## 12. Tone of voice (copy)

- **Bilingue assumé** : titres anglais (« PLAY BETTER », « FOR ATHLETES »), corps en français.
- **Direct, sportif, sans superlatif marketing creux**. « Co-fondé par des athlètes qui ont eu à cœur la fierté de la France ».
- Italiques pour les respirations émotionnelles (« *by athletes* », « *Let's play better together!* »).
- Hashtags / mentions × pour les collabs : `ANMTT x PPP`.
- CTAs courts et impératifs : `Joue maintenant`, `Deviens membre`, `Réserver une table`, `Nous contacter`, `Voir plus`.

---

## 13. Tokens CSS (extrait)

```css
:root {
  /* Couleurs */
  --color-bg: #ffffff;
  --color-ink: #0e0e0e;
  --color-forest: #0e3d2e;
  --color-forest-deep: #0a2d22;
  --color-cream: #fafaf7;
  --color-line: #e5e5e0;
  --color-muted: #6b6b6b;
  --color-gold: #c9a86a;
  --color-silver: #9a9a93;
  --color-red: #d7222a;

  /* Typographie */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-ui: 'Neue Haas Grotesk Display', 'Inter Tight', sans-serif;
  --font-script: 'Caveat', cursive;

  /* Espacements */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;
  --space-9: 128px;

  /* Rayons */
  --radius-none: 0;
  --radius-pill: 999px;

  /* Bordures */
  --border-thin: 1px solid var(--color-line);
  --border-ink: 1px solid var(--color-ink);

  /* Conteneur */
  --container: 1280px;
  --gutter: 32px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 600ms;
}
```

---

## 14. Do / Don't

✅ **Do**
- Garder le blanc dominant et utiliser le vert sapin comme une signature ponctuelle.
- Mélanger UPPERCASE serif + un mot italique pour les titres clés.
- Photographies noir & blanc, expressives, authentiques.
- Boutons et cartes strictement rectangulaires (radius 0).
- Espace blanc généreux entre les sections.
- Asymétries éditoriales subtiles (italique décalé sous un mot UPPERCASE).

❌ **Don't**
- Pas de gradients, pas d'ombres marquées, pas de glassmorphisme.
- Pas de couleurs vives en aplat (orange, violet, bleu vif…).
- Pas de polices génériques (Inter, Roboto) en titre.
- Pas de border-radius arrondis partout (sauf pilules planning et badges).
- Pas de photos stock colorées style « business handshake ».
- Pas de surcharge d'icônes — la marque parle par la typographie et la photo.

---

*Source : analyse du site live `pingpang.paris` (homepage, page Tarifs) et du logo `PING PANG effect` — mai 2026.*
