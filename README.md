# Periods Manager for Super Productivity

# [![Download Plugin](https://img.shields.io/badge/Download-plugin.zip-brightgreen)](./plugin.zip)

**Periods Manager** est un plugin premium pour [Super Productivity](https://super-productivity.com/) qui introduit un système de planification par périodes (time-blocking). Il permet d'organiser votre journée en segments temporels et automatise la gestion de vos tâches actives.

## 🌟 Fonctionnalités

- **🕒 Planification par Périodes** : Définissez des blocs de temps personnalisés (ex: "Deep Work", "Réunions", "Pause Déjeuner") avec des heures de début et de fin précises.
- **📅 Templates Hebdomadaires** : Créez des emplois du temps réutilisables qui s'appliquent automatiquement chaque semaine.
- **⚡ Overrides Quotidiens** : Modifiez le planning d'aujourd'hui sans impacter vos modèles à long terme.
- **🔗 Assignation Intelligente** : Liez des tâches de n'importe quel projet ou tag directement à une période spécifique.
- **🚀 Synchronisation du Timer** : Le timer de Super Productivity détecte automatiquement la période actuelle et suggère ou démarre la tâche assignée.
- **🎨 Interface Premium** : Un design moderne et réactif avec des effets de flou (glassmorphism) parfaitement intégré à l'esthétique de l'application.

## 🛠 Installation

1. Copiez le dossier `periods-manager` dans votre répertoire `src/assets/bundled-plugins/` de Super Productivity.
2. Redémarrez l'application ou rechargez les plugins.
3. Activez "Periods Manager" dans les paramètres des plugins.

## 📖 Mode d'Emploi

1. **Ouvrez le Plugin** : Cliquez sur l'icône Periods Manager dans le panneau latéral.
2. **Configurez vos Périodes** :
   - Utilisez l'onglet **Template** pour définir votre routine hebdomadaire.
   - Utilisez l'onglet **Today** pour ajuster votre planning immédiat.
3. **Assignez vos Tâches** :
   - Utilisez le bouton "+" ou le menu d'assignation rapide pour lier vos tâches aux périodes.
4. **Restez Focus** : Lancez votre timer. À chaque changement de période, le plugin s'assure que vous travaillez sur la bonne tâche.

## 🏗 Détails Techniques

- **Stockage** : Utilise `PluginUserPersistenceService` pour une sauvegarde robuste et synchronisée.
- **UI** : HTML/CSS/JS pur (Vanilla) pour une performance maximale sans dépendances externes.
- **Hooks** : Écoute les événements `currentTaskChange` et `PERSISTED_DATA_UPDATE` pour maintenir l'état à jour.

---
*Développé par Math2480*
