# Horcy – version web installable

Version de test d'Horcy qui s'ouvre dans un navigateur, notamment sur iPhone, sans rien installer depuis l'App Store.
Ce dépôt est indépendant de `horcy-apk` (Android) et `horcy-ios` (iPhone).

**Adresse :** https://maneaden.github.io/horcy-web/

## Installer sur iPhone
1. Ouvrir l'adresse dans **Safari**.
2. Toucher **Partager** (carré avec une flèche) › **Sur l'écran d'accueil** › **Ajouter**.
3. Ouvrir Horcy depuis l'icône : l'appli s'affiche en plein écran et fonctionne même hors connexion.

Installée ainsi, Safari ne supprime pas ses données. Sans installation, Safari peut les effacer après 7 jours sans visite.

Sur Android : ouvrir l'adresse dans Chrome › menu ⋮ › **Ajouter à l'écran d'accueil**.

## Données d'exemple
Pour essayer avec Ondine et Étoile : télécharger https://maneaden.github.io/horcy-web/exemple/Horcy-exemple.horcy, puis dans Horcy › **Mon écurie** › importer le fichier › **Remplacer**.

## Ce qui fonctionne / ce qui ne fonctionne pas
- Chevaux, échéances, soins, traitements, rations, rappels, dépenses, professionnels, fichiers et photos : **oui**, enregistrés uniquement sur l'appareil (personne d'autre ne les voit).
- Date et heure : celles de l'appareil.
- Rappels : affichés dans « Rappels du jour » à l'ouverture. **Pas de notification** quand l'appli est fermée.
- Météo et température : vérifiées à l'ouverture de l'appli (adresse de l'écurie requise).
- Sauvegarde : « Exporter mes données » ouvre le menu de partage (choisir **Enregistrer dans Fichiers**).

## Version multi-animaux
**Adresse :** https://maneaden.github.io/horcy-web/animaux/ (chevaux, chats, chiens, moutons, tortues).
- Installation identique (Safari › Partager › Sur l'écran d'accueil) : elle apparaît sous le nom « Horcy animaux ».
- Ses données sont séparées de celles de la version chevaux, même sur le même appareil.
- Les sauvegardes .horcy restent compatibles entre les versions (import : Ma maison › importer).
- Écrans dans `app-animaux/`, construits dans `dist/animaux/` par `scripts/build-animaux.mjs`.

## Mise à jour du site
Chaque modification poussée sur `main` reconstruit et republie le site (onglet **Actions**). Les écrans sont dans `app/`.
