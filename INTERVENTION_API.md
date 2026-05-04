# Intégration des APIs d'Intervention

## Vue d'ensemble

Le fichier `ReportBreak.vue` a été mis à jour pour communiquer avec les APIs d'intervention Laravel. Cette intégration permet de gérer les interventions de manière dynamique avec une base de données.

## APIs Intégrées

### 1. Ajouter une intervention
- **Endpoint**: `POST /addIntervention`
- **Fonction**: `addIntervention(data)`
- **Description**: Crée une nouvelle intervention avec tous les détails

### 2. Récupérer toutes les interventions
- **Endpoint**: `GET /displayInterventions`
- **Fonction**: `getInterventions()`
- **Description**: Récupère la liste complète des interventions avec leurs relations

### 3. Mettre à jour une intervention
- **Endpoint**: `PUT /updateIntervention/{id}`
- **Fonction**: `updateIntervention(id, data)`
- **Description**: Met à jour une intervention existante

### 4. Supprimer une intervention
- **Endpoint**: `DELETE /deleteIntervention/{id}`
- **Fonction**: `deleteIntervention(id)`
- **Description**: Supprime une intervention et ses fichiers associés

### 5. Générer le PDF
- **Endpoint**: `GET /generateReportPdf/{id}`
- **Fonction**: `generateInterventionPDF(id)`
- **Description**: Génère un PDF de l'intervention

## Composables

### useIntervention.ts
Composable principal pour gérer les interactions avec les APIs d'intervention :

```typescript
const { 
  addIntervention, 
  getInterventions, 
  updateIntervention, 
  deleteIntervention, 
  generateInterventionPDF 
} = useIntervention();
```

### Fonctionnalités
- Gestion automatique des erreurs avec notifications
- Support des fichiers audio et signatures
- Gestion des FormData pour les uploads
- Type safety avec TypeScript

## Types TypeScript

Les types sont définis dans `types/intervention.d.ts` :

- `Intervention`: Interface principale pour une intervention
- `Equipment`: Interface pour les équipements
- `Client`: Interface pour les clients
- `Technician`: Interface pour les techniciens
- `InterventionFormData`: Interface pour les données de formulaire
- `InterventionResponse`: Interface pour les réponses API

## Fonctionnalités Ajoutées

### 1. Chargement Dynamique
- Les interventions sont chargées depuis l'API au montage du composant
- Indicateur de chargement pendant les requêtes
- État vide avec bouton d'action

### 2. Gestion des Erreurs
- Notifications d'erreur automatiques
- Gestion des erreurs réseau
- Fallback pour la génération PDF

### 3. Interface Utilisateur Améliorée
- Bouton d'actualisation des données
- Indicateurs de chargement
- Messages de confirmation

### 4. Mapping des Statuts
- Conversion automatique entre statuts français et anglais
- Support des statuts personnalisés

## Utilisation

### Chargement des Données
```typescript
// Chargement automatique au montage
onMounted(async () => {
  await loadData();
});

// Chargement manuel
const loadData = async () => {
  const response = await getInterventions();
  reports.value = response.data.map(/* mapping */);
};
```

### Création d'une Intervention
```typescript
const submitForm = async () => {
  const interventionData = {
    equipment_id: parseInt(form.value.equipmentId),
    client_id: parseInt(form.value.clientId),
    // ... autres champs
  };
  
  await addIntervention(interventionData);
  await loadData(); // Recharger les données
};
```

### Suppression d'une Intervention
```typescript
const deleteReport = async (id) => {
  if (confirm('Êtes-vous sûr ?')) {
    await deleteIntervention(id);
    await loadData(); // Recharger les données
  }
};
```

## Configuration

### Variables d'Environnement
Assurez-vous que `VITE_API_URL` est configuré dans votre fichier `.env` :

```env
VITE_API_URL=http://localhost:8000/api
```

### Authentification
Le composable utilise automatiquement l'authentification configurée dans `useAuthStore`.

## Notes Importantes

1. **FormData**: Les requêtes avec fichiers utilisent FormData automatiquement
2. **Relations**: Les interventions incluent les relations equipment, client, et technician
3. **Fichiers**: Les fichiers audio et signatures sont gérés automatiquement
4. **Validation**: La validation côté client et serveur est maintenue
5. **Fallback**: En cas d'erreur API, certaines fonctionnalités utilisent des méthodes locales

## Prochaines Étapes

1. Intégrer les APIs pour les équipements, clients et techniciens
2. Ajouter la pagination pour les grandes listes
3. Implémenter la recherche et le filtrage
4. Ajouter la gestion des permissions
5. Optimiser les performances avec la mise en cache

