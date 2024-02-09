import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity } from "../redux/CartReducer";

const DressItem = ({ item, selectedOption }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  return (
    <View>
      <Pressable
        style={{
          padding: 10,
          backgroundColor: "white",
          marginVertical: 13,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View>
          <Image
            style={{ width: 40, height: 40 }}
            source={{ uri: item?.image }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
          <Text style={{ marginTop: 3 }}>
            Rs{" "}
            {selectedOption == "Wash + Iron"
              ? item.price + 20
              : selectedOption == "Steam Iron"
              ? item.price + 35
              : selectedOption == "Dry Clean"
              ? item.price + 45
              : item.price}
          </Text>
        </View>

        {cart.some((c) => c.item.id == item.id) ? (
          <Pressable
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Pressable
              onPress={() => {
                dispatch(decrementQuantity(item));
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  paddingHorizontal: 6,
                }}
              >
                -
              </Text>
            </Pressable>

            <Pressable>
              <Text
                style={{
                  color: "black",
                  paddingHorizontal: 6,
                  fontSize: 15,
                }}
              >
                {cart.find((c) => c.item.id === item.id)?.item.quantity}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                dispatch(incrementQuantity(item));
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: "black",
                  paddingHorizontal: 6,
                }}
              >
                +
              </Text>
            </Pressable>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              dispatch(addToCart({ item, category: selectedOption }));
            }}
          >
            <AntDesign name="pluscircleo" size={24} color="#89CFF0" />
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

export default DressItem;

const styles = StyleSheet.create({});
