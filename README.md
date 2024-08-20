# Authentification et envoi faire Firestore

À l'aide des exercices antérieurs et de la documentation sur le site du cours, veuillez accomplir les différentes tâches dans le projet fourni.

1. Synchroniser le state et le formulaire pour les composantes Login et Register.
2. Ajouter la validation du formulaire et l'ajout de classes (voir les commentaires).
3. Créer un contexte contenant les fonctionnalités nécessaires à l'authentification (incluant une composante Provider et un hook personnalisé)
4. Adapter les routes pour que seuls Login et Register soient accessibles si l'utilisateur n'est pas connecté et Posts seulement s'il est connecté.
5. Adapter le Header à l'état d'authentification de l'utilisateur.
6. Programmer l'authentification/inscription/déconnexion de l'utilisateur.
7. Afficher un message d'erreur à l'utilisateur (dans Login.jsx) si la connexion à échoué.
8. Permettre que l'utilisateur soit connecté automatiquement s'il s'était authentifié lors de sa visite précédente.
9. Synchroniser le formulaire de Posts à un state.
10. Programmer l'envoi de posts, de leur auteur (son email) ainsi que du id de l'auteur à Firestore.
11. Afficher le message et le courriel de chacun des posts depuis Firestore.
12. Animer l'affichage des nouveaux posts dans le ul à l'aide de Framer-motion après en avoir amélioré le CSS.
13. Filtrer les messages par auteur en utilisant le filtre et les [requêtes Firestore](https://firebase.google.com/docs/firestore/query-data/queries?hl=fr#execute_a_query)
