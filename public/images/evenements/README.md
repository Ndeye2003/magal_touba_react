# Images des Événements

Ce dossier contient les images uploadées pour les événements du Magal Touba.

## Structure

- Les images sont nommées : `evenement-{ID}-{timestamp}.{extension}`
- Formats acceptés : JPG, PNG, WebP
- Taille maximale : 5MB

## Développement

En mode développement, les images sont stockées temporairement en sessionStorage pour la prévisualisation.

En production, un système de stockage approprié devrait être mis en place (serveur de fichiers, CDN, etc.).

## URLs d'accès

Les images sont accessibles via :
`http://localhost:3000/images/evenements/nom-du-fichier.jpg`