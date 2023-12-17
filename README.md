# Lecteur Vidéo HTML Custom en JavaScript Vanilla

## Description

Notre lecteur vidéo HTML custom est une solution légère et performante pour intégrer la lecture de vidéos sur votre site web, développée exclusivement en utilisant JavaScript vanilla. Cette approche élimine toute dépendance à des plugins, bibliothèques externes ou frameworks, offrant ainsi une flexibilité totale et une intégration transparente dans divers environnements web.

## Caractéristiques Clés

- **JavaScript Vanilla :** Développé sans dépendances externes pour garantir une exécution rapide et une intégration facile.
  
- **Interface Utilisateur Intuitive :** Contrôles de lecture, de volume et de progression conviviaux pour une expérience utilisateur optimale.

- **Personnalisation Facile :** Modularité du code permettant une personnalisation aisée de l'apparence et des fonctionnalités.

- **Léger et Rapide :** Évite les surcharges inutiles, assurant une lecture fluide et des performances optimales du site.

- **Compatibilité Multiplateforme :** Fonctionne de manière cohérente sur différents navigateurs pour une expérience utilisateur homogène.

## Technologies Utilisées

- **HTML5 :** Structure de base pour le lecteur vidéo.
  
- **CSS3 :** Styles et mises en forme de l'interface utilisateur.
  
- **JavaScript Vanilla :** Logique de lecture vidéo et gestion des événements.

## Comment Utiliser

1. Intégrez les fichiers HTML, CSS et JavaScript dans votre projet.
   
2. Personnalisez l'apparence et le comportement en modifiant le code selon vos besoins spécifiques.

3. Profitez d'une intégration légère et flexible de la lecture vidéo sur votre site web.

## Exemple d'Intégration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Mon Lecteur Vidéo</title>
</head>
<body>
    <!-- Intégration du lecteur vidéo -->
        <!-- Remplacer "votre-video.mp4" par le chemin vers votre video 
        et size par la resolution de votre video -->
        <ocho src="votre-video.mp4" size="720">
            <!-- Ajoutre des sources de differente qualilté 
            et remplacer size par la resolution de votre nouvelle source  -->
            <!-- <source src="votre-video_1080.mp4" size="1080"> -->
            <!-- Ajouter des sous-titres et remplacer fr par le code iso de votre langue 
            Remplacer "votre-sous-titre.vtt" par le chemin vers votre fichier vtt -->
            <!-- <track kind="subtitles" label="French" srclang="fr" src="votre-sous-titre.vtt">-->
        </ocho>

    <script src="video-player.js"></script>
</body>
</html>
```
## Contribution

Les contributions sont les bienvenues. N'hésitez pas à ouvrir une issue pour discuter des fonctionnalités proposées ou à soumettre une pull request pour corriger des bugs.

### Comment Contribuer

1. Fork le projet.
2. Créez une nouvelle branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`).
3. Committez vos modifications (`git commit -am 'Ajouter une nouvelle fonctionnalité'`).
4. Poussez la branche sur votre fork (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrez une pull request.

### Guidelines de Contribution

- Assurez-vous de tester votre code.
- Suivez les conventions de codage du projet.
- Soyez respectueux envers les autres contributeurs.
- N'oubliez pas de mettre à jour la documentation si nécessaire.

### Rapport de Bugs

Si vous trouvez un bug, veuillez ouvrir une issue en fournissant des détails clairs et pertinents. Incluez des captures d'écran si possible.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

