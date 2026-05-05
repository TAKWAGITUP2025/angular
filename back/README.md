# Gestion de Projets et Tâches — Backend

API REST Node.js + Express + Mongoose

## Installation

```bash
cd back
npm install
```

## Configuration

Créez ou adaptez le fichier `.env` :

```
MONGO_URI=mongodb://localhost:27017/gestion-projets
JWT_SECRET=votre_secret_jwt
PORT=3001
```

## Démarrage

```bash
npm run dev     # développement (nodemon)
npm start       # production
npm run seed    # charger les données de démonstration
```

## Comptes de démonstration

| Utilisateur | Mot de passe | Rôle |
|-------------|--------------|------|
| admin       | admin123     | admin |
| chef        | chef123      | chef  |

## Endpoints API

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/login | Connexion (retourne JWT) |
| POST | /api/auth/register | Création de compte |

### Projets *(JWT requis)*
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/projets | Liste + filtres (search, statut) + % avancement |
| GET | /api/projets/:id | Détail projet + ses tâches |
| POST | /api/projets | Créer un projet |
| PUT | /api/projets/:id | Modifier un projet |
| DELETE | /api/projets/:id | Supprimer projet + tâches associées |

### Tâches *(JWT requis)*
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/taches | Liste + filtres (projet, statut, priorite) |
| GET | /api/taches/:id | Détail tâche |
| POST | /api/taches | Créer une tâche (titre + projet obligatoires) |
| PUT | /api/taches/:id | Modifier une tâche |
| DELETE | /api/taches/:id | Supprimer une tâche |

## Modèles

### Projet
```json
{
  "nom": "string (requis)",
  "description": "string",
  "statut": "en attente | en cours | termine",
  "dateDebut": "Date",
  "dateFin": "Date",
  "responsable": "string"
}
```

### Tâche
```json
{
  "titre": "string (requis)",
  "description": "string",
  "statut": "a faire | en cours | termine",
  "priorite": "basse | moyenne | haute",
  "projet": "ObjectId (requis)",
  "dateLimit": "Date",
  "assigneA": "string"
}
```
