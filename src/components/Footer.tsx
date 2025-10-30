import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types"; // 👈 path may differ
import SendIcon from "./SendIcon";
import Emoji from "../Assets/Icons/emoji.svg";
import Wallets from "../Assets/Icons/wallet.svg";
import Chat from "../Assets/Icons/chat.svg";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View
            className="bg-[#ffffffe8]"
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
        >
            <View className="flex-row justify-between px-8 py-8 bg-[#ffffffe8] min-h-20 w-full">
                <View className="items-center">
                    <Chat width={28} height={28} />
                    <Text className="text-sm text-blue-300 mt-1">Chat</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("WalletCreate")}>
                    <Wallets width={28} height={28} />
                    <Text className="text-sm text-blue-300 mt-1">Wallet</Text>
                </TouchableOpacity>

                <View className="items-center">
                    <Emoji width={28} height={28} />
                    <Text className="text-sm text-blue-300 mt-1">Profile</Text>
                </View>
            </View>
        </View>
    );
};

export default Footer;
