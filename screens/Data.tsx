import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

export default function Data({ navigation }) {
  const [isPinSet, setIsPinSet] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bloodPressureData, setBloodPressureData] = useState([]);

  useEffect(() => {
    const checkPin = async () => {
      const storedPin = await AsyncStorage.getItem("babyDataPin");
      if (storedPin) {
        setIsPinSet(true);
        setShowPinModal(true);
      } else {
        setShowPinModal(true);
      }
    };
    checkPin();
  }, []);

  useEffect(() => {
    // Generate random blood pressure data for the last 30 days
    const generateBloodPressureData = () => {
      const data = [];
      for (let i = 0; i < 30; i++) {
        data.push(Math.floor(Math.random() * (50 - 30 + 1)) + 30);
      }
      return data;
    };
    setBloodPressureData(generateBloodPressureData());
  }, []);

  const handleSetPin = async () => {
    if (pin === confirmPin) {
      await AsyncStorage.setItem("babyDataPin", pin);
      setIsPinSet(true);
      setShowPinModal(false);
    } else {
      alert("Les codes PIN ne correspondent pas. Veuillez réessayer.");
    }
  };

  const handleEnterPin = async () => {
    const storedPin = await AsyncStorage.getItem("babyDataPin");
    if (enteredPin === storedPin) {
      setShowPinModal(false);
    } else {
      alert("Code PIN incorrect. Veuillez réessayer.");
    }
  };

  const handleCancelPin = () => {
    setShowPinModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const handlePrevDays = () => {
    setCurrentIndex(currentIndex + 10);
  };

  const handleNextDays = () => {
    if (currentIndex >= 10) {
      setCurrentIndex(currentIndex - 10);
    }
  };

  const getLastTenDays = () => {
    const days = [];
    for (let i = 0; i < 10; i++) {
      const day = moment().subtract(currentIndex + i, "days");
      days.push({
        date: day.format("D"),
        dayName: day.format("dd").charAt(0).toUpperCase(),
      });
    }
    return days.reverse();
  };

  const getCurrentMonth = () => {
    return moment().subtract(currentIndex, "days").format("MMMM YYYY");
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal visible={showPinModal} transparent={true} animationType="slide">
        <View style={styles.modalContainerBlurred}>
          <View style={styles.modalContent}>
            {!isPinSet ? (
              <>
                <Text style={styles.modalTitle}>Définir un code PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrez un code PIN"
                  placeholderTextColor={"#000"}
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmez le code PIN"
                  placeholderTextColor={"#000"}
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSetPin}
                >
                  <Text style={styles.saveButtonText}>
                    Enregistrer le code PIN
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Entrez votre code PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Code PIN"
                  placeholderTextColor={"#000"}
                  value={enteredPin}
                  onChangeText={setEnteredPin}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleEnterPin}
                >
                  <Text style={styles.saveButtonText}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelPin}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/form.png")}
          style={styles.topImage}
        ></Image>
        <Image
          source={require("../assets/form.png")}
          style={styles.botImage}
        ></Image>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📈 Données du bébé</Text>
        </View>

        <Text style={styles.currentDate}>{moment().format("dddd D MMMM YYYY")}</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tension artérielle - {getCurrentMonth()}</Text>
          <View style={styles.customChartContainer}>
            {getLastTenDays().map((day, index) => {
              const bloodPressureValue = bloodPressureData[currentIndex + index] || 0;
              return (
                <View key={index} style={{ alignItems: "center" }}>
                  <View
                    style={{
                      ...styles.chartBar,
                      height: bloodPressureValue * 3,
                      marginLeft: index === 0 ? 0 : 10,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.barValue}>{bloodPressureValue}</Text>
                  </View>
                  <Text style={styles.barLabel}>{day.date}</Text>
                  <Text style={styles.barLabel}>{day.dayName}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={handlePrevDays} style={styles.navButton}>
              <Text style={styles.navButtonText}>◀ 10 jours précédents</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextDays} style={styles.navButton}>
              <Text style={styles.navButtonText}>10 jours suivants ▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dataContainer}>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>Périmètre crânien</Text>
            <Text style={styles.dataValue}>21cm</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>Température</Text>
            <Text style={styles.dataValue}>36.2°C</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>SPO₂</Text>
            <Text style={styles.dataValue}>98%</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>Lait bu</Text>
            <Text style={styles.dataValue}>6ml</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F2F0FF",
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#274C86",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  currentDate: {
    fontSize: 18,
    textAlign: "center",
    color: "#6A6A6A",
    marginVertical: 20,
  },
  topImage: {
    position: "absolute",
    top: 100,
    right: -300,
    width: "100%",
    height: 400,
  },
  botImage: {
    position: "absolute",
    bottom: -150,
    left: -300,
    width: "100%",
    height: 300,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderColor: "#797979",
    borderWidth: 0.5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#274C86",
  },
  customChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 180,
    borderRadius: 10,
    padding: 10,
  },
  chartBar: {
    width: 20,
    backgroundColor: "#1DBF73",
    borderRadius: 5,
  },
  barValue: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 5,
  },
  barLabel: {
    marginTop: 5,
    fontSize: 10,
    color: "#6A6A6A",
  },
  dataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  dataCard: {
    backgroundColor: "#FFFFFF",
    width: "45%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderColor: "#797979",
    borderWidth: 0.5,
  },
  dataTitle: {
    fontSize: 14,
    color: "#6A6A6A",
    marginBottom: 10,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#274C86",
  },
  modalContainerBlurred: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#274C86",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#274C86",
    fontSize: 16,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#274C86",
    borderRadius: 5,
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 14,
  },
});