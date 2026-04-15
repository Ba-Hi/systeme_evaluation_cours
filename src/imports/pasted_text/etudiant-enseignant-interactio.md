1. Acteur : Etudiant
Donnees necessaires : identifiant etudiant (login Ensimag), liste des matieres suivies, QR code ou lien de session, réponses au formulaire, état de soumission false au départ.
Tâche globale session_etudiant()
( s'identifier <=> selectionner_matiere | acceder_QRcode )
  then ( repondre_formulaire then { sauvegarder } then soumettre )+
T1 S'identifier
Action utilisateur
Feedback interface
Etat interface
~[champ_login] Mv
champ_login !
champ_login focused = true
      saisir(identifiant')
afficher(identifiant' dans champ)
login = identifiant'
~[champ_mdp] Mv
champ_mdp !
champ_mdp focused = true
      saisir(mdp')
afficher("..." dans champ)
mdp = mdp'
~[btn_connexion] Mv M^
btn_connexion ! -> spinner()
—
    auth_ok(login, mdp) :
afficher(page_accueil)
session = {etudiant, login}, auth = true
    NOT auth_ok :
afficher(msg_erreur !)
authenticated = false, champs -!


T2 Selectionner une matiere (liste | QR code)
Chemin A : selection par liste :
Action utilisateur
Feedback interface
Etat interface
~[matiere'] Mv M^
matiere' !
matiere_selectionnee = matiere'

Chemin B : acces par QR code :
Action utilisateur
Feedback interface
Etat interface
~[btn_qrcode] Mv M^
ouvrir(camera !)
mode = qr_scan
      scanner(qr')
afficher(formulaire(matiere(qr')))
matiere_selectionnee = matiere(qr')


T3 Repondre au formulaire
Donnees : liste de questions (echelle, choix multiple, texte libre), etat de completion par question. Contrainte : <= 3 min (MUST).
Action utilisateur
Feedback interface
Etat interface
( repondre_question(q') )+
barre_progression !
reponses[q'] = valeur', nb_repondues++
      ~[option'] Mv M^
option' ! , Tout option != option' : option -!
reponses[q'] = option'
      { saisir(texte_libre') }
afficher(texte dans zone)
commentaire = texte_libre'
nb_repondues = nb_obligatoires :
btn_soumettre !
formulaire_complet = true


T4 Sauvegarder (optionnel)
Action utilisateur
Feedback interface
Etat interface
{ ~[btn_sauvegarder] Mv M^ }
icone_sauvegarde ! -> "Brouillon enregistre"
brouillon = reponses, sauvegarde = true


T5 Soumettre
Action utilisateur
Feedback interface
Etat interface
formulaire_complet = true :
—
btn_soumettre active
      ~[btn_soumettre] Mv M^
dialogue_confirmation !
—
            ~[btn_confirmer] Mv M^
anonymiser(reponses) -> "Soumis V"
soumis = true, reponses = anonymes
            { ~[btn_annuler] Mv M^ }
dialogue_confirmation -!
—
formulaire_complet = false :
—
btn_soumettre desactive
      ~[btn_soumettre] Mv M^
 msg_erreur !

 afficher("Questions manquantes ")

 (pour tout q non repondue)
     question[q] !
liste_q_manquantes := { q | reponses[q] = ∅ }



2. Acteur : Enseignant
Donnees necessaires : identifiant enseignant (role : Referent ou Enseignant cours), nom du formulaire, type (mi-parcours | fin-semestre), questions, lien/QR code de partage, reponses agregees anonymisees.
Tâche globale session_enseignant()
( s'identifier(role) then ( creer_formulaire | acceder_formulaire )
  then gerer_formulaire* ) | voir_reponses | resumer_reponses

T6 S'identifier (Referent | Enseignant cours)
Action utilisateur
Feedback interface
Etat interface
select(role') where role' in {Referent, Enseignant}
role' !
role = role'
~[btn_connexion] Mv M^
spinner() -> dashboard(role')
session = {enseignant, role'}


T7 Creer un formulaire (type, nom)
[ role = Referent ]
Action utilisateur
Feedback interface
Etat interface
~[btn_nouveau] Mv M^
afficher(dialog_creation !)
mode = creation
      saisir(nom')
champ_nom !
formulaire.nom = nom'
      select(type') in {mi-parcours, fin-semestre}
type' !
formulaire.type = type'
      select(format') in {CM/TD, CM/TP}
format' !
formulaire.format = format'
      ~[btn_creer] Mv M^
afficher(editeur_formulaire)
formulaire.id = new_id(), mode = edition


T8 Acceder a un formulaire existant
Action utilisateur
Feedback interface
Etat interface
~[formulaire'] Mv M^
formulaire' ! -> afficher(editeur(formulaire'))
formulaire_courant = formulaire'


T9 Ajouter/supprimer des questions
[ role = Referent ∧ formulaire.questions.nb >= 1 ] (pour la suppression)
Action utilisateur
Feedback interface
Etat interface
( ajouter_question() )+
liste_questions mise a jour !
formulaire.questions.nb++
      ~[btn_add_question] Mv M^
afficher(dialog_question !)
—
            select(type_q') | saisir(texte_q')
previsualisation_question !
question = {type: type_q', texte: texte_q'}
            ~[btn_valider_q] Mv M^
question ajoutee en liste
formulaire.questions += question
~[question_i] Mv M^
question_i !
-> afficher(options_question !)


~[btn_supprimer] Mv M^
confirmer_suppression !
-> "Question supprimée"
formulaire.questions -= question_i
formulaire.questions.nb := formulaire.questions.nb - 1


T10 Publier & generer lien / QR code
Precondition : formulaire.questions.nb >= 1
Action utilisateur
Feedback interface
Etat interface
formulaire.questions.nb >= 1 :
btn_publier !
—
      ~[btn_publier] Mv M^
generer(lien', qrcode') -> afficher( !)
statut = publie, lien = lien', qr = qrcode'
      { ~[btn_copier_lien] Mv M^ }
"Lien copie V"
clipboard = lien'


T11 Voir les reponses (xlsx)
Action utilisateur
Feedback interface
Etat interface
~[btn_voir_reponses] Mv M^
afficher(tableau_reponses_anonymes !)
vue = reponses_brutes
      { ~[btn_export_xlsx] Mv M^ }
telecharger(reponses.xlsx)
export_xlsx = true


T12 Resumer les reponses (graphes, word cloud)
Action utilisateur
Feedback interface
Etat interface
~[btn_resume] Mv M^
afficher(graphes !, word_cloud !)
vue = synthese_agregee
    role = Referent :
afficher(vue_tous_profs(matiere') !)
vue = synthese_globale_matiere
    role = Enseignant :
afficher(vue_mon_cours !)
vue = synthese_cours_propre



