// components/Button.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity
            className="bg-blue-500 p-4 rounded-xl items-center"
            onPress={onPress}
        >
            <Text className="text-white font-semibold">{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
