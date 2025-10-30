import { StatusBar, Text, View, useColorScheme } from "react-native";
import "../../global.css"
import React, { useEffect, useState } from 'react'
import { ethers, HDNodeWallet, Wallet } from 'ethers'
import { useAccount } from "../context/account";
import { ActivityIndicator } from 'react-native';
import Menu from "../Assets/Icons/menu.svg";
import Notification from "../Assets/Icons/notification.svg"
const Navbar = () => {
    return (
        <View className="flex py-4 bg-white flex-row justify-end gap-4 px-4 ">
            <Menu width={28} height={28} />
            <Notification width={28} height={28} />
        </View>
    )
}

export default Navbar
