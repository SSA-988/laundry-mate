import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";
import { addDoc, collection, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../../../redux/CartReducer";

const address = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.item.price * item.item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  const [step, setStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(moment());
  const [deliveryDate, setDeliveryDate] = useState(moment());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedAdress, setSelectedAdress] = useState("");
  console.log("addresses", addresses);
  const userUid = auth?.currentUser.uid;
  console.log("userId", userUid);
  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };
  const pickupTimeOptions = [
    { startTime: "6:30 AM", endTime: "9:00 AM" },
    { startTime: "9:00 AM", endTime: "11:30 AM" },
    { startTime: "5:00 PM", endTime: "7:30 PM" },
    { startTime: "7:30 PM", endTime: "10:00 PM" },
  ];

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressCollectionRef = collection(
          db,
          "users",
          userUid,
          "userAddresses"
        );

        const addressQuery = query(addressCollectionRef);

        const querySnapshot = await getDocs(addressQuery);
        const addresses = [];

        querySnapshot.forEach((doc) => {
          addresses.push({ id: doc.id, ...doc.data() });
        });
        setAddresses(addresses);
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchAddress();
  }, []);

  const handleNext = () => {
    setStep((prevStep) => {
      const nextStep = prevStep + 1;
      console.log("next step", nextStep);

      //check if next step is equal to 4
      if (nextStep == 5) {
        // call the place order function
        placeOrder();
      }

      return nextStep;
    });
  };
  console.log(step);
  const placeOrder = async () => {
    dispatch(cleanCart());

    router.replace("/(tabs)/orders");

    const ordersCollectionRef = collection(db, "users", userUid, "orders");

    const orderDocRef = await addDoc(ordersCollectionRef, {
      items: { ...cart },
      address: selectedAdress,
      pickuptime: `${selectedTime.startTime} - ${selectedTime.endTime}`,
      deliveryTime: `${selectedDeliveryTime.startTime} - ${selectedDeliveryTime.endTime}`,
    });

    console.log("order placed successfully!", orderDocRef.id);
  };
  const getNext6Days = () => {
    const nextDays = [];
    for (let i = 0; i < 5; i++) {
      const nextDate = moment(currentDate).add(i, "days");

      nextDays.push(nextDate);
    }

    return nextDays;
  };
  const getNextDays = () => {
    const nextDays = [];
    let startDate = moment().add(1, "days");

    if (moment(selectedDate).isSameOrBefore(moment().add(2, "days"), "day")) {
      startDate = moment(selectedDate).add(2, "days");
    }

    for (let i = 0; i < 5; i++) {
      const nextDate = moment(startDate).add(i, "days");
      nextDays.push(nextDate);
    }

    return nextDays;
  };
  const renderDateButtons = () => {
    const next6Days = getNext6Days();

    return next6Days?.map((date, index) => (
      <TouchableOpacity
        onPress={() => setSelectedDate(date)}
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 6,
          width: 50,
          backgroundColor: date.isSame(selectedDate, "day")
            ? "#0066b2"
            : "white",
          borderColor: date.isSame(selectedDate, "day")
            ? "transparent"
            : "#0066b2",
          borderWidth: date.isSame(selectedDate, "day") ? 0 : 1,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            color: date.isSame(selectedDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("D")}
        </Text>
        <Text
          style={{
            marginTop: 3,
            textAlign: "center",
            fontSize: 13,
            color: date.isSame(selectedDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("ddd")}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderButtons = () => {
    const next6Days = getNextDays();

    return next6Days.map((date, index) => (
      <TouchableOpacity
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 6,
          width: 50,
          backgroundColor: date.isSame(deliveryDate, "day")
            ? "#0066b2"
            : "white",
          borderColor: date.isSame(deliveryDate, "day")
            ? "transparent"
            : "#0066b2",
          borderWidth: date.isSame(deliveryDate, "day") ? 0 : 1,
        }}
        onPress={() => setDeliveryDate(date)}
        key={index}
      >
        <Text
          style={{
            textAlign: "center",
            marginTop: 3,
            fontSize: 13,
            color: date.isSame(deliveryDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("D")}
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 3,
            fontSize: 13,
            color: date.isSame(deliveryDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("ddd")}
        </Text>
      </TouchableOpacity>
    ));
  };
  const renderPickUpTimeOptions = () => {
    if (selectedDate) {
      const isCurrentDate = selectedDate.isSame(currentDate, "day");

      const currentTime = moment();

      return pickupTimeOptions.map((option, index) => {
        console.log(option);
        const startTime = moment(
          selectedDate.format("YYYY-MM-DD") + " " + option.startTime,
          "YYYY-MM-DD LT"
        );

        //check if the time slot is past the current time
        const isTimeSlotPast = isCurrentDate && startTime.isBefore(currentDate);

        return (
          <TouchableOpacity
            onPress={() => {
              if (!isTimeSlotPast) {
                setSelectedTime(option);
              }
            }}
            style={{
              textDecorationLine: isTimeSlotPast ? "line-through" : "none",
              opacity: isTimeSlotPast ? 0.5 : 1,
              padding: 10,
              margin: 10,
              borderRadius: 5,
              backgroundColor:
                selectedTime &&
                selectedTime.startTime === option.startTime &&
                selectedTime.endTime === option.endTime
                  ? "#0066b2"
                  : "white",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color:
                  selectedTime &&
                  selectedTime.startTime === option.startTime &&
                  selectedTime.endTime === option.endTime
                    ? "white"
                    : "black",
              }}
            >{`${option.startTime} - ${option.endTime}`}</Text>
          </TouchableOpacity>
        );
      });
    }
  };
  const renderTimeOptions = () => {
    return pickupTimeOptions.map((option, index) => {
      console.log(option);
      const startTime = moment(
        selectedDate.format("YYYY-MM-DD") + " " + option.startTime,
        "YYYY-MM-DD LT"
      );

      // Check if the time slot is past the current time
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedDeliveryTime(option);
          }}
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor:
              selectedDeliveryTime &&
              selectedDeliveryTime.startTime === option.startTime &&
              selectedDeliveryTime.endTime === option.endTime
                ? "#0066b2"
                : "white",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color:
                selectedDeliveryTime &&
                selectedDeliveryTime.startTime === option.startTime &&
                selectedDeliveryTime.endTime === option.endTime
                  ? "white"
                  : "black",
            }}
          >{`${option.startTime} - ${option.endTime}`}</Text>
        </TouchableOpacity>
      );
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#FEBE10",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#A0A0A0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </View>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: "500" }}>
          Choose your address
        </Text>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#A0A0A0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="cross" size={24} color="white" />
        </View>
      </View>

      <View
        style={{
          padding: 10,
          backgroundColor: "white",
          height: 100,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Pressable
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#A0A0A0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>

        <Pressable
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: "#F5F5F5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="location" size={24} color="#0066b2" />
        </Pressable>

        <Pressable
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: "#F5F5F5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="back-in-time" size={24} color="#0066b2" />
        </Pressable>

        <Pressable
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#A0A0A0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="chevron-right" size={24} color="white" />
        </Pressable>
      </View>

      <View style={{ backgroundColor: "#F0F8FF", flex: 1, padding: 10 }}>
        <ScrollView>
          {step == 1 && (
            <View>
              {/* Map  over all the addresses */}
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <AntDesign name="plus" size={24} color="black" />
                <Pressable onPress={() => router.push("/home/add")}>
                  <Text style={{ fontSize: 16 }}>Add address</Text>
                </Pressable>
              </Pressable>

              <View>
                {/* map over the addresses */}
                {addresses?.map((item, index) => (
                  <Pressable
                    onPress={() => setSelectedAdress(item)}
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                      marginVertical: 10,
                      borderRadius: 15,
                      borderWidth: selectedAdress === item ? 2 : 1,
                      borderColor: "#0066b2",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Ionicons
                          name="location-outline"
                          size={24}
                          color="#0066b2"
                        />
                        <Text style={{ fontSize: 17, fontWeight: "500" }}>
                          Home
                        </Text>
                      </View>
                      <FontAwesome name="flag" size={24} color="#0066b2" />
                    </View>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        fontWeight: "500",
                        width: "95%",
                      }}
                    >
                      {item?.houseNo} {item?.landmark}
                    </Text>
                    <Text
                      style={{
                        marginTop: 6,
                        color: "gray",
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Bangalore {item?.postalCode}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step == 2 && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <EvilIcons name="location" size={24} color="black" />
                <View>
                  <Text style={{ fontSize: 16 }}>Pick up slot</Text>
                  <Text
                    style={{ marginTop: 4, fontWeight: "500", fontSize: 16 }}
                  >
                    {currentDate.format("MMMM YYYY")}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {renderDateButtons()}
              </View>

              <Text style={{ marginHorizontal: 10 }}>Pickup Time Options</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {renderPickUpTimeOptions()}
              </View>
            </View>
          )}

          {step == 3 && (
            <>
              <View
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <EvilIcons name="location" size={24} color="black" />
                    <Text>Pick up slot</Text>
                  </View>
                  <AntDesign name="edit" size={24} color="black" />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      padding: 10,
                      margin: 10,
                      borderRadius: 6,
                      width: 50,
                      backgroundColor: "#0066b2",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: "white",
                      }}
                    >
                      {selectedDate.format("D")}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        marginTop: 3,
                        fontSize: 13,
                      }}
                    >
                      {selectedDate.format("ddd")}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: "#0066b2",
                    }}
                  >
                    <Text
                      style={{ textAlign: "center", color: "white" }}
                    >{`${selectedTime.startTime} - ${selectedTime.endTime}`}</Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {renderButtons()}
                </View>

                <Text style={{ marginHorizontal: 10 }}>
                  Pickup Time Options
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {renderTimeOptions()}
                </View>
              </View>
            </>
          )}

          {step == 4 && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Your Cart
                </Text>
              </View>

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

                    <View style={{ flex: 1 }}>
                      <Text>{item?.item.name}</Text>
                      <Text>{item?.item.price * item?.item.quantity}</Text>
                    </View>

                    <Pressable>
                      <AntDesign name="pluscircleo" size={24} color="#89CFF0" />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
              <View
                style={{
                  backgroundColor: "#0066b2",
                  padding: 10,
                  borderBottomLeftRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Total Amount
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs {total}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Promo Code
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs 0
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Delivery Charges
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs 25
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Total Payable
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs {total + 25}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "#0066b2",
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    TOTAL AMOUNT
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs {total}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    TAXES AND CHARGES
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs 150
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    TOTAL PAYABLE
                  </Text>
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Rs {total + 25 + 150}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {cart.length > 0 && (
        <Pressable style={{ backgroundColor: "#E0E0E0", padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="basket-outline" size={24} color="black" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500" }}>
                Basket Total Rs {total}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 3 }}>
                You have {cart.length} items saved in your basket
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/basket/cart")}
              style={{ padding: 10, backgroundColor: "white", borderRadius: 4 }}
            >
              <Text>View</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      <View
        style={{
          backgroundColor: "white",
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginTop: "auto",
        }}
      >
        <Pressable
          disabled={step === 1}
          onPress={handleBack}
          style={{
            backgroundColor: "#d0d0d0",
            padding: 15,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Back</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          style={{
            backgroundColor: "#0066b2",
            padding: 15,
            borderRadius: 10,
            flex: 1,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "500" }}
          >
            {step == 4 ? "Place Order" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default address;

const styles = StyleSheet.create({});
