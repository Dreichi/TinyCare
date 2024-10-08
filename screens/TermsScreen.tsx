import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Règlement et Traitement des Données</Text>
      <Text style={styles.content}>
        Bienvenue sur notre application. En vous inscrivant, vous acceptez les
        termes et conditions suivants :{"\n\n"}
        1. Utilisation de l'Application: Vous acceptez d'utiliser l'application
        uniquement à des fins légales et conformément à toutes les lois
        applicables.{"\n"}
        2. Compte Utilisateur: Vous êtes responsable de la sécurité de votre
        compte et de toutes les activités effectuées sous votre compte.{"\n"}
        3. Protection des Données: Vos données personnelles seront traitées
        conformément à notre politique de confidentialité. Nous nous engageons à
        protéger vos informations personnelles et à ne pas les divulguer sans
        votre consentement.{"\n"}
        4. Contenu Généré par l'Utilisateur: Vous êtes responsable du contenu
        que vous publiez sur l'application. Nous nous réservons le droit de
        supprimer tout contenu jugé inapproprié.{"\n"}
        5. Propriété Intellectuelle: Tous les droits de propriété intellectuelle
        de l'application et de son contenu appartiennent à nos développeurs.
        Vous ne pouvez pas copier, modifier, ou distribuer nos contenus sans
        autorisation écrite préalable.{"\n"}
        6. Modifications des Termes: Nous nous réservons le droit de modifier
        ces termes et conditions à tout moment. Les modifications seront
        effectives dès leur publication sur l'application.{"\n"}
        7. Limitation de Responsabilité: Nous ne serons pas responsables des
        dommages indirects, spéciaux ou consécutifs résultant de l'utilisation
        ou de l'incapacité à utiliser l'application.{"\n"}
        8. Résiliation: Nous nous réservons le droit de suspendre ou de résilier
        votre accès à l'application en cas de violation des termes et
        conditions.{"\n\n"}
        Vos données seront traitées conformément à notre politique de
        confidentialité. Pour toute question, veuillez nous contacter.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
