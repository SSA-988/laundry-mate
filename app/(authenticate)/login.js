import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState,useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("auth");
  //       if (token) {
  //         router.replace("/(tabs)/home");
  //       }
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   };
  //   checkLoginStatus();
  // }, []);
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      const token = user?.stsTokenManager.accessToken;

      AsyncStorage.setItem("auth",token);
    });

    router.replace("/(tabs)/home");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "#FEBE10", width: "100%" }}>
        <View
          style={{
            marginTop: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 200, height: 50, resizeMode: "cover" }}
            source={{
              uri: "https://laundrymate.in/assets/images/shared/branding/Logo.webp",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Wash Wizard
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#FEBE10",
            }}
          >
            Log in to your Account
          </Text>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#FEBE10",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "white",
                width: 300,
                marginVertical: 10,
                fontSize: email ? 17 : 17,
              }}
              placeholder="Enter your email"
              placeholderTextColor={"white"}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#FEBE10",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="white"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                color: "white",
                width: 300,
                marginVertical: 10,
                fontSize: password ? 17 : 17,
              }}
              placeholder="Enter your password"
              placeholderTextColor={"white"}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 50 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>
            Don't have an account? Sign up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
