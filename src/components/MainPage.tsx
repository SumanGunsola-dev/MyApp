import { Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import "../../global.css";
import React, { useEffect, useState } from "react";
import { ethers, HDNodeWallet, Wallet } from "ethers";
import { useAccount } from "../context/account";
import { SafeAreaView } from "react-native-safe-area-context";
import SendTransaction from "../components/SendTransaction";
import SendIcon from "../components/SendIcon";
import CreateAccount from "./CreateAccount";
import Authentication from "./Authantication";
import NetworksTab from "./NetworkTab";
import DropDown from "../Assets/Icons/dropdown.svg"
const MainPage = () => {
    const { walletWithProvider } = useAccount();
    const [networkName, setNetworkName] = useState<string>();
    const [balance, setBalance] = useState<string>();
    const [showSendModal, setShowSendModal] = useState<boolean>(false);
    const [network, setNetwork] = useState<boolean>(false)
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
        <SafeAreaView className="flex-1 bg-white">
            <CreateAccount />
            <Authentication />

            <View className="flex-1 items-center mt-10">
                <View className="bg-blue-500 min-h-44 w-[90%] flex flex-col gap-6 rounded-xl px-4 py-4">
                    {balance && networkName && walletWithProvider ? (
                        <View className="flex gap-4">
                            <Text className="text-lg text-white mb-2">
                                {`${balance} ${networkName}`}
                            </Text>

                            <View className="flex  gap-4">
                                <Text className="text-white text-xl">Status account</Text>
                                <Text className="text-white text-base">
                                    {`${walletWithProvider.address.slice(0, 10)}...${walletWithProvider.address.slice(-8)}`}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="flex items-center justify-center py-6">
                            <ActivityIndicator size="large" color="#A07CFE" />
                            <Text className="text-white mt-2">Loading wallet info...</Text>
                        </View>
                    )}
                </View>


                <View
                    style={{
                        position: "absolute",
                        bottom: 140,
                        left: "45%",
                        zIndex: 10,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowSendModal(true)}
                    >
                        <SendIcon />
                    </TouchableOpacity>
                </View>

                <View className="w-full flex min-h-[500px]  ">
                    {!network && (
                        <View className="bg-[#111] my-4 ml-7  px-4 py-2 gap-28 rounded-md  w-[60%] flex flex-row">
                            <Text className="text-blue-300 text-center w-36   ">
                                {networkName ? networkName : <ActivityIndicator size="large" color="#A07CFE" />}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setNetwork(true)}
                            >
                                <DropDown width={30} height={30} stroke="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    {network && (
                        <View className="max-w-[60%]">
                            <NetworksTab setNetwork={setNetwork} />
                        </View>

                    )}
                </View>

                <Modal
                    visible={showSendModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowSendModal(false)}
                >
                    <View className="flex-1 bg-[#00000066] justify-end items-center">
                        <View className="w-[90%]">
                            <SendTransaction setShowSendModal={setShowSendModal} />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView >
    );
};

export default MainPage;
