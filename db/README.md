# Base de données — Ping Pang & Co. Elite

Schéma PostgreSQL / Supabase simplifié : **9 tables** au total, JSONB pour les données imbriquées.

## Installation

```bash
psql $DATABASE_URL -f db/schema.sql
psql $DATABASE_URL -f db/seed.sql
```

## Les 9 tables

| Table | Contenu |
|---|---|
| `users` | Comptes auth (email + password) |
| `players` | Profils + stats ELO + badges + streak + follows (JSONB) |
| `matches` | Matchs + sets + changements ELO (JSONB) |
| `activities` | Feed : matchs, training, achievements, follows, tournois, annonces + commentaires/likes (JSONB) |
| `clubs` | Clubs + membres + events + chat + défis + achievements (tout en JSONB) |
| `club_admin` | Tournois + cotisations + bookings + coachings + finances + annonces (JSONB) |
| `challenges` | Défis entre joueurs |
| `messages` | Messagerie privée |
| `venues` | Tables PP + tags + horaires + reviews + territoire club (JSONB) |

## Comptes de démo

Mot de passe : `demo1234`

| Email | Joueur | ELO |
|---|---|---|
| `leon@pingpang.app` | Léon Le Calvez (utilisateur courant, créateur Paris 13 TT) | 1487 |
| `felix@pingpang.app` | Félix Lebrun (pro, premium) | 2812 |
| `alexis@pingpang.app` | Alexis Lebrun | 2778 |
| `wang@pingpang.app` | Wang Chuqin (World #1, premium) | 2901 |
| `harimoto@pingpang.app` | Tomokazu Harimoto | 2802 |
| `marie@pingpang.app` | Marie Dubois (créatrice Lyon TT) | 1820 |
| `carlos@pingpang.app` | Carlos Diaz | 1965 |
| `sofia@pingpang.app` | Sofia Müller (créatrice Berlin Open TT) | 2040 |

## Exemples de requêtes JSONB

```sql
-- Tous les membres de Paris 13 TT
SELECT jsonb_array_elements(members) FROM clubs WHERE id = 'c1';

-- Tous les clubs où p5 est membre
SELECT id, name FROM clubs WHERE members @> '[{"player_id":"p5"}]';

-- Score total p1 dans le match m1
SELECT jsonb_array_length(sets) AS nb_sets FROM matches WHERE id = 'm1';

-- Tournois ouverts d'un club
SELECT jsonb_array_elements(tournaments) AS t FROM club_admin
WHERE club_id = 'c1' AND tournaments @> '[{"status":"open"}]';

-- Reviews 5★ d'une venue
SELECT jsonb_array_elements(reviews) FROM venues
WHERE id = 'v1' AND reviews @> '[{"rating":5}]';
```
