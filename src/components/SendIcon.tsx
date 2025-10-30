import React from 'react'
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Arrow from "../Assets/Icons/arrow.svg";

const SendIcon = () => {
    return (
        <View className='rounded-full bg-blue-600 flex justify-center items-center w-14 h-14 '>
            <Arrow width={35} height={35} />
        </View>
    )
}

export default SendIcon