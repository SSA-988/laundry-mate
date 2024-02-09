import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';

const index = () => {
  const userUid = auth?.currentUser.uid;
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollectionRef = collection(db, "users", userUid, "orders");

        const ordersQuery = query(ordersCollectionRef);

        const querySnapshot = await getDocs(ordersQuery);

        const fetchedOrders = [];

        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchOrders();
  }, []);
  console.log("orders", orders);
  return (
    <View style={{ padding: 12, height: 200, backgroundColor: "#FEBE10" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Image
            style={{ width: 200, height: 50, resizeMode: "cover" }}
            source={{
              uri: "https://laundrymate.in/assets/images/shared/branding/Logo.webp",
            }}
          />
        </View>
        <Octicons name="three-bars" size={24} color="white" />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginTop: 12,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#C0C0C0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </View>
        <Text>My Orders</Text>
      </View>

      <View>
        {orders?.map((item, index) => (
          <Pressable
            style={{
              marginVertical: 12,
              backgroundColor: "white",
              borderRadius: 7,
            }}
            key={index}
          >
            <View
              style={{
                backgroundColor: "#0066b2",
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7,
              }}
            >
              <View>
                <Text
                  style={{ color: "white", fontSize: 15, fontWeight: "500" }}
                >
                  Order Detail
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "500",
                    marginTop: 3,
                  }}
                >
                  {item?.id}
                </Text>
              </View>

              <View>
                <Text
                  style={{ color: "white", fontSize: 15, fontWeight: "500" }}
                >
                  Payment
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "500",
                    marginTop: 4,
                  }}
                >
                  Cash on delivery
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                marginHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    fontWeight: "500",
                    color: "gray",
                    width: 200,
                  }}
                >
                  {item?.address.houseNo} {item?.address.landmark}
                </Text>
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600" }}>
                    PICK UP
                  </Text>
                  <Text style={{ fontSize: 15, marginTop: 4 }}>
                    {item?.pickuptime}
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600" }}>
                    DELIVERY
                  </Text>
                  <Text style={{ fontSize: 15, marginTop: 4 }}>
                    {item?.deliveryTime}
                  </Text>
                </View>
                <View style={{ marginBottom: 20 }} />
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F0F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="note-outline"
                    size={24}
                    color="black"
                  />
                </View>
                <Text style={{textAlign:"center",fontSize:13,fontWeight:"500"}}>Order Summary</Text>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F0F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                 <FontAwesome name="folder-open-o" size={24} color="black" />
                </View>
                <Text style={{textAlign:"center",fontSize:13,fontWeight:"500"}}>FeedBack</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
