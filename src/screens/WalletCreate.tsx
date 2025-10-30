import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AddAccount from "../components/CreateAccount";
import { HDNodeWallet, Wallet, ethers } from "ethers";
import { useAccount } from "../context/account";

const WalletCreate = () => {
    const { walletWithProvider } = useAccount();
    const [show, setShow] = useState<boolean>(false)
    const [networkName, setNetworkName] = useState<string>();
    const [balance, setBalance] = useState<string>();
    // const [showSendModal, setShowSendModal] = useState(false);
    useEffect(() => {
        if (walletWithProvider && walletWithProvider.provider) {
            fetchNetworkName(walletWithProvider);
        }
    }, [walletWithProvider]);
    const fetchNetworkName = async (wallet: Wallet | HDNodeWallet) => {
        const network = await wallet.provider!.getNetwork();
        const balance = await wallet.provider!.getBalance(wallet.address);
        const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(4);
        const networkName = network.name.toUpperCase();
        setBalance(formattedBalance);
        setNetworkName(networkName);
    };
    return (
        <SafeAreaView className=" bg-white min-h-[80vh]  ">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", alignItems: "center" }}>


                <View className="text-white mt-10 bg-[#9eec62] flex px-6 py-4 min-h-36 w-[90%] justify-between rounded-xl ">

                    {walletWithProvider ? (
                        <View className="flex flex-col justify-between mt-2 space-x-2  h-32 ">
                            <Text className="text-white text-lg font-semibold">{walletWithProvider instanceof HDNodeWallet ? `Account ${walletWithProvider.index + 1}` : <ActivityIndicator />}</Text>
                            <Text className="text-sm font-bold text-gray-50">{`${walletWithProvider.address.slice(0, 10)}...${walletWithProvider.address.slice(-8)}`}</Text>
                            <Text className="text-white text-3xl font-bold">{balance && networkName ? ` ${balance} ${networkName}` : <ActivityIndicator size="large" color="#ACFE" />}</Text>
                        </View>
                    ) : (
                        <View className="flex items-center justify-center py-6">
                            <ActivityIndicator size="large" color="#ACFE" />
                            <Text className="text-white mt-2">Loading wallet info...</Text>
                        </View>
                    )}

                </View>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShow(true)}
                        className="bg-[#7782e7] mb-32 rounded-md"
                    >
                        <Text className="font-semibold text-blue-50 text-center text-lg  px-8 py-4">ADD</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </SafeAreaView >
    );
};

export default WalletCreate;
