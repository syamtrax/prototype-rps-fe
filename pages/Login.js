import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState } from "react";
import Background from "../assets/background.png";
import Logo from "../assets/Logo.png";

const { height: screenHeight } = Dimensions.get("window");
const { width: screenWidth } = Dimensions.get("window");
const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    navigation.navigate("Home");
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View>
        <Image
          source={Logo}
          style={{ marginLeft: 20, marginBottom: -5 }}
        ></Image>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              onChangeText={setEmail}
              placeholderTextColor="#ccc"
            />

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={setPassword}
              placeholderTextColor="#ccc"
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.signInButton} onPress={handleSubmit}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Create Account Link */}
          <TouchableOpacity>
            <Text style={styles.link}>Create a New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: "column",
    justifyContent: "flex-end",
    resizeMode: "cover",
    height: screenHeight,
    width: screenWidth,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 20,
    padding: 40,
    height: 424,
    width: "90%",
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2A2A2A",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    marginBottom: 15,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#2395D2", // Blue button color
    borderRadius: 8,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    color: "#2395D2",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Login;
