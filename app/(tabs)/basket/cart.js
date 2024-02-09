import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

const cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.item.price * item.item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: "#0066b2",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
          Basket Total
        </Text>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            Rs {total}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            for {cart.length} items
          </Text>
        </View>
      </View>

      <Text style={{ padding: 10 }}>Cart Items</Text>

      <View style={{ marginHorizontal: 12 }}>
        {cart?.map((item, index) => (
          <Pressable
            style={{
              padding: 10,
              backgroundColor: "white",
              marginVertical: 13,
              flexDirection: "row",
              gap: 12,
              borderRadius: 5,
            }}
            key={index}
          >
            <View>
              <Image
                style={{ width: 40, height: 40 }}
                source={{ uri: item?.item?.image }}
              />
            </View>

            <View style={{flex:1}}>
              <Text>{item?.item.name}</Text>
              <Text>{item?.item.price * item?.item.quantity}</Text>
            </View>

            <Pressable>
              <AntDesign name="pluscircleo" size={24} color="#89CFF0" />
            </Pressable>
          </Pressable>
        ))}
      </View>

      <View style={{flexDirection:"row",padding:15,alignItems:"center",gap:12,marginTop:30}}>
          <Pressable style={{backgroundColor:"#d0d0d0",padding:15,borderRadius:10,flex:1}}>
              <Text style={{textAlign:"center",fontWeight:"500"}}>Empty Basket</Text>
          </Pressable>
          <Pressable style={{backgroundColor:"#0066b2",padding:15,borderRadius:10,flex:1}}>
              <Text style={{textAlign:"center",color:"white",fontWeight:"500"}}>Checkout</Text>
          </Pressable>
      </View>
    </ScrollView>
  );
};

export default cart;

const styles = StyleSheet.create({});
