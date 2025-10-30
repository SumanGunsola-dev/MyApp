import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Dropdown from "../Assets/Icons/dropdown.svg";
import { ethers, Wallet, HDNodeWallet } from 'ethers'

import { useAccount } from '../context/account';
interface Transaction {
    address: string,
    amount: string
}

interface SendTransactionProps {
    setShowSendModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const SendTransaction: React.FC<SendTransactionProps> = ({ setShowSendModal }) => {
    const { walletWithProvider, handleTransactionsEth } = useAccount();
    const [balance, setBalance] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [transaction, setTransaction] = useState<Transaction>({
        address: "",
        amount: ""
    });

    const handleChange = (field: keyof Transaction, value: string) => {

        setTransaction((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleClick = async () => {

        if (!transaction.address || !transaction.amount) {
            setError("Please enter both address and amount");
            return;
        }

        if (parseFloat(transaction.amount) <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        if (parseFloat(transaction.amount) > parseFloat(balance)) {
            setError("Insufficient balance");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            const txHash = await handleTransactionsEth(
                transaction.address,
                transaction.amount
            );

            setSuccessMessage(`Transaction successful! Hash: ${txHash}`);

            setTransaction({ address: "", amount: "" });

            if (walletWithProvider && walletWithProvider.provider) {
                await fetchNetworkName(walletWithProvider);
            }
        } catch (error: any) {
            console.error("Transaction error:", error);
            setError(error.message || "Transaction failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log("Wallet with Provider in AccountInfo:", walletWithProvider);
        if (walletWithProvider && walletWithProvider.provider) {
            fetchNetworkName(walletWithProvider);
        }
    }, [walletWithProvider]);
    const fetchNetworkName = async (wallet: Wallet | HDNodeWallet) => {
        const balance = await wallet.provider!.getBalance(wallet.address);
        const balanceInether = ethers.formatEther(balance);
        setBalance(balanceInether);
    }

    return (
        <View className=" bg-white rounded-lg  min-h-[520px] min-w-[100%] py-5 mb-10 px-10">

            <View className="flex-row flex justify-between items-center mb-6">
                <Text className="text-xl font-bold text-black">Send Transaction</Text>
                <Text onPress={() => setShowSendModal(false)} className="text-blue-500 ml-2 text-lg">Cancel</Text>
            </View>


            <View className="flex-row justify-between items-start mb-8">
                <TextInput
                    className="border-b border-gray-300 text-2xl flex-1 w-5 mr-3"
                    placeholder="0.0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    onChangeText={(text) => handleChange("amount", text)}
                />
                <View className="flex-row items-center space-x-6 ">
                    <View className='min-w-14'>

                        <Image
                            source={require("../Assets/Images/Avalanche.png")}
                            style={{ width: 35, height: 35, borderRadius: 20 }}
                        />
                    </View>
                    <Text className="text-lg font-semibold text-black">AVA</Text>
                    <Dropdown width={20} height={20} />
                </View>
            </View>


            <View className="mb-6">
                <Text className="text-gray-500 mb-2">From</Text>
                <View className="flex-row items-center justify-between bg-gray-100 p-5 rounded-2xl">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <Text className="text-white text-lg font-bold">S</Text>
                        </View>
                        <View>
                            <Text className="text-black font-semibold" >Status Account</Text>
                            <Text className="text-gray-500 text-sm">{balance ? balance : <ActivityIndicator size="small" color="#A07CFE" />}</Text>
                        </View>
                    </View>
                    <Dropdown width={25} height={25} />
                </View>
            </View>


            <View className="mb-8">
                <Text className="text-gray-500 mb-2">To</Text>
                <View className="bg-gray-600 p-5 rounded-2xl">
                    {/* <Text className="text-black font-semibold">an</Text> */}
                    <TextInput className="text-gray-900 text-sm" placeholder='Address or Domain Name' onChangeText={(text) => handleChange("address", text)}
                        value={transaction.address} />
                </View>
            </View>


            <TouchableOpacity
                activeOpacity={0.8}
                className=" w-full flex items-center justify-center mt-4"
                onPress={handleClick}
            >
                <Text className="font-semibold bg-blue-50 py-4 px-8 rounded-md text-blue-500 text-xl text-center" >{isLoading ? <ActivityIndicator color="#AFG5" size="small" /> : "Send"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SendTransaction
