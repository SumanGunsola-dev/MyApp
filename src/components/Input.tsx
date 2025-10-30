import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, secureTextEntry, ...props }) => {
    return (
        <View className="mb-4">
            {label && <Text className="mb-2 text-gray-700">{label}</Text>}
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-black"
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#999"
                {...props}
            />
        </View>
    );
};
