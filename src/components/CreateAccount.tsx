import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, View, Modal, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Arrow from "../Assets/Icons/arrow.svg";
import Dropdown from "../Assets/Icons/dropdown.svg";
import { useAccount } from '../context/account';
import Copy from "../Assets/Icons/copy.svg"

const CreateAccount = () => {
    const [visible, setVisible] = useState(false);
    const [removePopUp, setRemovePopUp] = useState<boolean>(true);
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [privateKey, setPrivateKey] = useState<string>("")
    // const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleCreateEth, setPassword, password, handleSetPassword, copyToClipboard, handleImportPrivateKeyEth } = useAccount();

    const handleCreateSolana = () => {
        // Add Solana implementation here
    }

    useEffect(() => {
        const checkWalletExists = async () => {
            try {
                const walletExists = await AsyncStorage.getItem("eth_wallets");
                if (!walletExists) {
                    setRemovePopUp(false);
                }
            } catch (error) {
                console.error("Error checking wallet existence:", error);
                setRemovePopUp(false);
            }
        };

        checkWalletExists();
    }, [])

    const handleClick = async () => {
        setVisible(true);
        setRemovePopUp(true);
        const ethMnemonic = handleCreateEth();
        if (ethMnemonic) {
            setMnemonic(ethMnemonic);
        }
    }

    const handleChange = (name: string, value: string) => {
        setError("")
        setPassword((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handlesetPassword = async () => {
        try {
            setError("")

            const result: boolean = await handleSetPassword(password);
            if (result) {
                setVisible(false);
                setPassword({ password: "", comPassword: "" });
                await AsyncStorage.setItem("authenticated", "true");
            } else {
                setError("Password don't match or are too short");
            }
        } catch (error) {
            console.error("Error in handleSetPasswordPress:", error);
            setError("Something went wrong. Please try again.");

        }
    }

    return (
        <>
            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>

                <View className="flex-1 bg-black/50 backdrop-blur-sm justify-center items-center p-4">
                    <View className="bg-white/90 flex justify-between rounded-xl w-[90%]  p-6 space-y-4">
                        <Text className="text-center font-bold text-xl text-gray-900 my-2">Set Password</Text>
                        <View className='flex justify-between mb-6 gap-5'>

                            <TextInput
                                placeholder="Your password"
                                secureTextEntry
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold"
                                value={password.password}
                                onChangeText={(val) => handleChange("password", val)}
                            />
                            <TextInput
                                placeholder="Confirm password"
                                secureTextEntry
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 font-semibold"
                                value={password.comPassword}
                                onChangeText={(val) => handleChange("comPassword", val)}
                            />

                        </View>
                        {error ? <Text className="text-gray-600 text-sm">{error}</Text> : null}

                        <TouchableOpacity
                            disabled={password.password.length < 8 || password.comPassword.length < 8}
                            onPress={() => handlesetPassword()}
                            className={`py-2.5 rounded-lg w-28 items-center self-center ${password.password.length < 8 ? "bg-gray-500" : "bg-black/80"
                                }`}
                        >
                            <Text className="text-gray-200 text-lg font-semibold font-mono">{isLoading ? <ActivityIndicator size="small" color="#AGsdg7" /> : "Set"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={(mnemonic && mnemonic.length > 0 && !visible)} transparent animationType="fade" onRequestClose={() => setMnemonic([])}>
                <View className="flex-1 bg-black/50 backdrop-blur-sm justify-center items-center p-4">
                    <View className="bg-black/70 border border-gray-700 rounded-xl p-5 w-[90%] max-w-[350px]">
                        <Text className="text-center text-gray-50 text-lg font-bold mb-2">Secret Recovery Phrase</Text>

                        <ScrollView className="max-h-[300px] mb-4">
                            <Text className="text-gray-300 font-semibold mb-3">
                                Your Secret Recovery Phrase is the only key to your wallet.{"\n\n"}
                                <Text className="text-gray-100 font-bold">
                                    Anyone with access to this phrase can control your funds permanently.
                                </Text>
                                {"\n\n"}Store it securely and never share it with anyone.
                            </Text>

                            <View className="flex flex-wrap flex-row justify-between">
                                {mnemonic.map((word: string, index: number) => (
                                    <View
                                        key={index}
                                        className="border border-gray-300 rounded-lg px-3 py-1.5 m-1 min-w-[30%] items-center"
                                    >
                                        <Text className="text-gray-100 font-mono">{word}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            onPress={() => copyToClipboard(mnemonic)}
                            className="mt-2 flex items-end mr-5 my-2"
                        >
                            <Copy width={25} height={25} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setMnemonic([])}
                            className="mt-4 bg-white rounded-lg py-2"
                        >
                            <Text className="text-gray-900 font-mono text-center font-semibold">Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
                <View className="flex-1 bg-black/50 backdrop-blur-sm justify-center items-center p-4">
                    <View className="bg-black/70 border border-gray-600 rounded-xl p-6 flex items-center justify-between gap-4 w-[90%] max-w-[350px] min-h-[400px]">
                        <Text className="text-gray-200 font-semibold text-lg mb-2">Import with Private Key</Text>

                        <TextInput
                            value={privateKey}
                            placeholder="Enter your private key"
                            placeholderTextColor="#999"
                            onChangeText={setPrivateKey}
                            secureTextEntry
                            className="w-full border border-gray-500 rounded-lg text-gray-100 px-4 py-3"
                        />

                        <TouchableOpacity
                            onPress={() => handleImportPrivateKeyEth(privateKey)}
                            className="bg-blue-500 py-2.5 rounded-lg w-full mt-4"
                        >
                            <Text className="text-white font-semibold text-center">Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShow(false)} className="mt-2">
                            <Text className="text-gray-400 text-sm">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={!removePopUp} transparent animationType="fade" onRequestClose={() => setRemovePopUp(true)}>
                <View className="flex-1 bg-[#00000066] w-full  justify-center items-center">

                    <View className='bg-[rgba(0,0,0,0.76)] rounded-2xl px-16 py-6 min-w-[80vw] max-h-[620px]'>
                        <View className='flex flex-col gap-5 mb-5'>
                            <View className='flex items-end ml-10 w-full'>
                                <TouchableOpacity onPress={() => setRemovePopUp(true)}>
                                    <Text className='text-blue-400 text-end'>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text className='text-center text-white text-2xl font-bold'>Add Account</Text>
                            </View>
                        </View>

                        <View className='mb-6'>
                            <Text className='text-[#ccc] my-8 text-xl font-semibold'>Create a new account</Text>
                            <TouchableOpacity onPress={handleClick}>
                                <Text className='text-[#A07CFE] text-lg p-4'>Ethereum account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreateSolana}>
                                <Text className='text-[#A07CFE] text-lg p-4'>Solana account</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='mb-6'>
                            <Text className='text-[#ccc] mb-8 text-xl font-semibold'>Import a wallet or account</Text>
                            <TouchableOpacity>
                                <Text className='text-[#A07CFE] text-lg p-4'>Secret Recovery Phrase</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setShow(true);
                                setRemovePopUp(true)
                            }}>
                                <Text className='text-[#A07CFE] text-lg p-4'>Private Key</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='mb-6'>
                            <Text className='text-[#ccc] mb-8 text-xl font-semibold'>Connect an account</Text>
                            <TouchableOpacity>
                                <Text className='text-[#A07CFE] text-lg p-4'>Hardware wallet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default CreateAccount;