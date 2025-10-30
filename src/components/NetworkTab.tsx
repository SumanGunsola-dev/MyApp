import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CHAINS from "../config/chains";
import { useAccount } from "../context/account";
import { Wallet, HDNodeWallet, JsonRpcProvider } from "ethers";
interface SetNetwoekProps {
    setNetwork: React.Dispatch<React.SetStateAction<boolean>>;
}
const NetworksTab: React.FC<SetNetwoekProps> = ({ setNetwork }) => {
    const { walletWithProvider, setWalletWithProvider, setNetworkDetails, networkDetails } = useAccount();
    const [selectedChain, setSelectedChain] = useState<string>("sepolia");
    useEffect(() => {
        // setNetworkDetails()
    }, [])

    const handleNetworkSelect = (key: string) => {
        try {
            setSelectedChain(key);
            console.log("Switched to network:", CHAINS[key].name);
            const rpcUrl = CHAINS[key].rpcUrls[0];
            const jsonRpcProvider = new JsonRpcProvider(rpcUrl);
            if (walletWithProvider) {
                const connectedWallet = walletWithProvider.connect(jsonRpcProvider);
                setWalletWithProvider(connectedWallet);
                setNetworkDetails(CHAINS[key]);
                setNetwork(false)
            }

        } catch (err) {
            console.error("❌ Error switching network:", err);
        }
    };


    return (
        <>

            <View className="my-4 ml-7  px-4 py-2  rounded-xl h-[320px] bg-[#111] border border-gray-700 ">
                {/* <Text className="text-white font-semibold mb-3 text-center py-2  ">Change Network</Text> */}

                <ScrollView
                    showsVerticalScrollIndicator={true}
                    className=""
                >
                    {Object.entries(CHAINS).map(([key, chain]) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => handleNetworkSelect(key)}
                            className={`mr-3 my-2 py-2 rounded-xl w-full border ${selectedChain === key
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-gray-700 bg-gray-800"
                                } items-center flex flex-row gap-5 px-2 w-28`}

                        >

                            {chain.icon ? (
                                typeof chain.icon === "function" ? (
                                    <chain.icon width={30} height={30} />
                                ) : (
                                    <Image source={chain.icon} style={{ width: 30, height: 30 }} className="rounded-full" />
                                )
                            ) : null}


                            <Text
                                className={`text-center text-xs ${selectedChain === key ? "text-blue-400" : "text-gray-300"
                                    }`}
                                numberOfLines={1}
                            >
                                {chain.name}
                            </Text>
                        </TouchableOpacity>
                    )
                    )
                    }
                </ScrollView>
            </View>
        </>
    );
};
export default NetworksTab;
