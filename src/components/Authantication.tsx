import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount } from "../context/account";

const Authentication = () => {
    const { fetchAccountExists, hasWallet, setHasWallet, isAuthenticated, setIsAuthenticated } = useAccount();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        checkSession();
    }, []);
    const checkSession = async () => {
        console.log("Hello Authentication")
        const sessionAuth = await AsyncStorage.getItem("authenticated");
        const walletExists = await AsyncStorage.getItem("eth_wallets");

        if (!walletExists) {
            setHasWallet(false);
            return;
        }

        if (sessionAuth === "true") {
            setIsAuthenticated(true);
            setHasWallet(false);
            return;
        }

        setHasWallet(true);
    };

    const handleSubmit = async () => {
        if (!password) return;

        setError("");
        const success = await fetchAccountExists(password);

        if (success) {
            await AsyncStorage.setItem("authenticated", "true");
            setIsAuthenticated(true);
            setHasWallet(false);
            console.log("✅ User authenticated successfully");
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    if (isAuthenticated || !hasWallet) {
        { console.log("Hey there it's me") }
        return null;
    }

    return (


        <SafeAreaView className="flex bg-black/50 justify-center items-center">
            <StatusBar barStyle={useColorScheme() === "dark" ? "light-content" : "dark-content"} />

            <View className="w-4/5 bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                <Text className="text-center text-lg mb-4 text-white font-semibold">
                    Enter your password
                </Text>

                <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError("");
                    }}
                    className="bg-white/20 text-white px-4 py-2 rounded-md"
                />

                {error ? (
                    <Text className="text-red-400 text-sm mt-2">{error}</Text>
                ) : null}

                <TouchableOpacity
                    disabled={!password}
                    onPress={handleSubmit}
                    className={`mt-4 py-2 rounded-md ${password ? "bg-purple-500" : "bg-purple-300"}`}
                >
                    <Text className="text-center text-white font-semibold">Unlock</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
};

export default Authentication;
