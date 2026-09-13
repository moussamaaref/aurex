# Instructions GitHub Copilot — AUREX et Vault Obsidian

## Sources de contexte

- Le code du projet AUREX se trouve dans ce workspace.
- Le Vault Obsidian est le dossier `C:\Users\DAYCONN3\Documents\Obsidian Vault`.
- Les fichiers Markdown du Vault sont la documentation et la base de connaissances du projet.
- Rechercher dans le code et dans le Vault avant de proposer une nouvelle implementation ou documentation.

## Regles Obsidian

- Les liens `[[Nom de note]]` sont des liens internes Obsidian et doivent etre preserves.
- Utiliser un lien interne lorsqu'une note correspondante existe deja.
- Respecter les noms, dossiers et conventions existants.
- Preserver integralement le YAML/frontmatter lorsqu'il existe.
- Utiliser du Markdown propre avec des titres, tableaux et listes lisibles.
- Ne supprimer, renommer ou deplacer aucune note sans demande explicite.
- Ne pas remplacer inutilement le contenu existant : modifier uniquement les sections necessaires.
- Verifier les liens internes et signaler les liens vers des notes inexistantes.

## Documentation AUREX

- La documentation principale se trouve dans `moussa/AUREX`.
- Mettre a jour la note existante la plus pertinente plutot que creer des doublons.
- Utiliser les noms de notes et les liens deja presents dans `moussa/AUREX/README.md`.
- Documenter les changements techniques, les variables d'environnement, les decisions et les limites connues.
- Ne jamais ecrire de secret Supabase, de cle `service_role` ou de credential dans une note, le code ou Git.

## Fin de session obligatoire

Avant de terminer une session qui modifie le projet :

1. Identifier les changements qui affectent l'architecture, Supabase, le CMS, le deploiement ou l'utilisation du projet.
2. Mettre a jour la note Obsidian AUREX correspondante.
3. Ajouter une etape dans `moussa/AUREX/06 - Prochaines etapes.md` si un travail reste a faire.
4. Verifier les liens `[[...]]` ajoutes ou modifies.
5. Resumer dans la reponse finale les notes Obsidian mises a jour.

Si aucune mise a jour documentaire n'est necessaire, l'indiquer explicitement.
