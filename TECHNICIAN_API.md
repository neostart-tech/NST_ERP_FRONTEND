# Intégration des APIs des Techniciens

## Vue d'ensemble

Le fichier `AddTechnician.vue` a été mis à jour pour communiquer avec les APIs des techniciens Laravel. Cette intégration permet de gérer les techniciens de manière dynamique avec une base de données.

## APIs Intégrées

### 1. Ajouter un technicien
- **Endpoint**: `POST /addTechnician`
- **Fonction**: `addTechnician(data)`
- **Description**: Crée un nouveau technicien avec tous les détails

### 2. Récupérer tous les techniciens
- **Endpoint**: `GET /displayTechnicians`
- **Fonction**: `getTechnicians()`
- **Description**: Récupère la liste complète des techniciens

### 3. Mettre à jour un technicien
- **Endpoint**: `PUT /updateTechnician/{id}`
- **Fonction**: `updateTechnician(id, data)`
- **Description**: Met à jour un technicien existant

### 4. Supprimer un technicien
- **Endpoint**: `DELETE /deleteTechnician/{id}`
- **Fonction**: `deleteTechnician(id)`
- **Description**: Supprime un technicien et ses fichiers associés

## Composables

### useTechnician.ts
Composable principal pour gérer les interactions avec les APIs des techniciens :

```typescript
const { 
  addTechnician, 
  getTechnicians, 
  updateTechnician, 
  deleteTechnician 
} = useTechnician();
```

### Fonctionnalités
- Gestion automatique des erreurs avec notifications
- Support des photos de profil
- Gestion des FormData pour les uploads
- Type safety avec TypeScript

## Types TypeScript

Les types sont définis dans `types/technician.d.ts` :

- `Technician`: Interface principale pour un technicien
- `TechnicianFormData`: Interface pour les données de formulaire
- `TechnicianResponse`: Interface pour les réponses API
- `TechnicianListResponse`: Interface pour les listes de techniciens

## Fonctionnalités Ajoutées

### 1. Chargement Dynamique
- Les techniciens sont chargés depuis l'API au montage du composant
- Indicateur de chargement pendant les requêtes
- État vide avec bouton d'action

### 2. Gestion des Erreurs
- Notifications d'erreur automatiques
- Gestion des erreurs réseau
- Fallback avec données d'exemple en cas d'erreur

### 3. Interface Utilisateur Améliorée
- Bouton d'actualisation des données
- Indicateurs de chargement
- Messages de confirmation
- Gestion des photos de profil

### 4. Validation et Sécurité
- Validation des champs obligatoires
- Gestion sécurisée des uploads de photos
- Protection contre les erreurs de données

## Utilisation

### Chargement des Données
```typescript
// Chargement automatique au montage
onMounted(async () => {
  await loadTechnicians();
});

// Chargement manuel
const loadTechnicians = async () => {
  const response = await getTechnicians();
  techniciens.value = response.data.map(/* mapping */);
};
```

### Création d'un Technicien
```typescript
const submitForm = async () => {
  const technicianData = {
    nom: form.value.nom,
    specialite: form.value.specialite,
    experience: parseInt(form.value.experience),
    email: form.value.email,
    telephone: form.value.telephone,
    adresse: form.value.adresse,
    disponibilite: form.value.disponibilite,
    photo: form.value.photo
  };
  
  await addTechnician(technicianData);
  await loadTechnicians(); // Recharger les données
};
```

### Modification d'un Technicien
```typescript
const editTechnicien = (technicien) => {
  isEditing.value = true;
  currentTechnicienId.value = technicien.id;
  form.value = { ...technicien, photo: null, photoPreview: technicien.photo };
  showModal.value = true;
};
```

### Suppression d'un Technicien
```typescript
const deleteTechnicien = async (technicien) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${technicien.nom} ?`)) {
    await deleteTechnician(technicien.id);
    await loadTechnicians(); // Recharger les données
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

1. **FormData**: Les requêtes avec photos utilisent FormData automatiquement
2. **Photos**: Les photos de profil sont gérées avec fallback vers des avatars générés
3. **Validation**: La validation côté client et serveur est maintenue
4. **Fallback**: En cas d'erreur API, l'interface utilise des données d'exemple
5. **Gestion des Erreurs**: Toutes les erreurs sont affichées avec des notifications

## Prochaines Étapes

1. Intégrer la gestion des permissions pour les techniciens
2. Ajouter la pagination pour les grandes listes
3. Implémenter la recherche avancée et le filtrage
4. Ajouter la gestion des horaires et disponibilités
5. Optimiser les performances avec la mise en cache des photos

## Structure des Données

### Technicien
```typescript
{
  id: number;
  nom: string;
  specialite: string;
  experience?: number;
  email: string;
  telephone: string;
  adresse?: string;
  disponibilite: string;
  photo?: string;
  dateAjout: string;
  created_at?: string;
  updated_at?: string;
}
```

### Formulaire
```typescript
{
  nom: string;
  specialite: string;
  experience?: number;
  email: string;
  telephone: string;
  adresse?: string;
  disponibilite: string;
  photo?: File;
}
```

