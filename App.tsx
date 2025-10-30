import "./global.css";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AccountProvider } from "./src/context/account";
import Navbar from "./src/components/Navbar";
import Footer from "./src/components/Footer";
import MainPage from "./src/components/MainPage";
import WalletCreate from "./src/screens/WalletCreate";

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <AccountProvider>
        <NavigationContainer>
          <SafeAreaView className="flex-1 bg-[#ffff] dark:bg-black">
            <StatusBar
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              backgroundColor={isDarkMode ? "#000" : "#fff"}
            />

            <Navbar />

            {/* Stack Navigator here */}
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="MainPage"
            >
              <Stack.Screen name="MainPage" component={MainPage} />
              <Stack.Screen name="WalletCreate" component={WalletCreate} />
            </Stack.Navigator>

            <Footer />
          </SafeAreaView>
        </NavigationContainer>
      </AccountProvider>
    </SafeAreaProvider>
  );
}

export default App;
