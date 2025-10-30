import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import { Alert } from "react-native";
import { HDNodeWallet, Wallet, JsonRpcProvider, parseEther, ethers } from "ethers";
import { ALCHEMY_API_KEY } from '@env';
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";
import type { ImageSourcePropType } from "react-native";
// ---------- TYPES ----------
interface Password {
    password: string;
    comPassword: string;
}
export interface ChainInfo {
    name: string;
    chainId: number;
    rpcUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrls: string[];
    icon?: string | ImageSourcePropType | FC<SvgProps>;
}
interface AccountContextType {
    walletWithProvider: HDNodeWallet | Wallet | undefined;
    password: Password;
    setPassword: React.Dispatch<React.SetStateAction<Password>>;
    setWalletWithProvider: React.Dispatch<React.SetStateAction<HDNodeWallet | Wallet | undefined>>;
    fetchAccountExists: (password: string) => Promise<boolean>;
    handleCreateEth: () => string[] | undefined;
    handleSetPassword: (password: Password) => Promise<boolean>;
    handleImportPrivateKeyEth: (private_key: string) => void;
    copyToClipboard: (text: string[]) => void;
    hasWallet: boolean;
    setHasWallet: React.Dispatch<React.SetStateAction<boolean>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddNewAccountEth: () => void;
    derivedAccounts: (HDNodeWallet | Wallet)[];
    handleTransactionsEth: (_to: string, _value: string) => Promise<string>;
    networkDetails: (ChainInfo | undefined);
    setNetworkDetails: React.Dispatch<React.SetStateAction<ChainInfo | undefined>>;

}

// ---------- PROVIDER ----------
const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [walletWithProvider, setWalletWithProvider] = useState<HDNodeWallet | Wallet>();
    const [derivedAccounts, setDerivedAccounts] = useState<(Wallet | HDNodeWallet)[]>([]);
    const [wallet, setWallet] = useState<HDNodeWallet | Wallet>();
    const [hasWallet, setHasWallet] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState<Password>({ password: "", comPassword: "" });
    const [actualPassword, setActualPassword] = useState<string>("");
    const [networkDetails, setNetworkDetails] = useState<ChainInfo>();
    // ---------- UTILS ----------
    const copyToClipboard = (text: string[]) => {
        const joinedText = text.join(" ");
        Clipboard.setString(joinedText);
        Alert.alert("Copied to clipboard!");
    };

    const saveWalletToStorage = async (encryptedJson: string) => {
        // biomatrix
        try {
            const storedWallets: string[] = JSON.parse(await AsyncStorage.getItem("eth_wallets") || "[]");
            storedWallets.push(encryptedJson);
            await AsyncStorage.setItem("eth_wallets", JSON.stringify(storedWallets));
            console.log("Wallet saved to AsyncStorage");
        } catch (e) {
            console.log("Error saving wallet:", e);
        }
    };

    // ---------- CREATE ETH WALLET ----------
    const handleCreateEth = () => {
        try {
            const wallet = HDNodeWallet.createRandom();
            const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
            setWallet(wallet);
            const walletWithProvider = wallet.connect(provider);
            setWalletWithProvider(walletWithProvider);
            setDerivedAccounts([wallet]);
            console.log("Wallet Address:", wallet.address);
            console.log("Private Key:", wallet.privateKey);

            if (wallet.mnemonic?.phrase) {
                return wallet.mnemonic.phrase.split(" ");
            }
        } catch (error) {
            console.error("Error creating Ethereum account:", error);
            return [];
        }
    };

    // ---------- SAVE WALLET (ENCRYPT) ----------
    const handleSetPassword = async (password: Password) => {
        try {
            if (password.password === password.comPassword && password.password.length >= 8) {
                if (!wallet) { return false; }
                const encryptedJson = await wallet.encrypt(password.password);
                await saveWalletToStorage(encryptedJson);
                console.log("Encrypted Wallet JSON:", encryptedJson);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log("Error encrypting wallet:", e);
            return false;
        }
    };

    // ---------- IMPORT PRIVATE KEY ----------
    const handleImportPrivateKeyEth = (private_key: string) => {
        try {
            const importedWallet = new Wallet(private_key);
            const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
            const walletWithProvider = importedWallet.connect(provider);
            setWallet(importedWallet);
            setWalletWithProvider(walletWithProvider);
            console.log("Imported wallet:", walletWithProvider.address);
        } catch (error) {
            console.log("Error importing private key:", error);
        }
    };

    // ---------- SEND TRANSACTION ----------
    const handleTransactionsEth = async (_to: string, _value: string): Promise<string> => {
        try {
            if (!walletWithProvider?.provider || !walletWithProvider) {
                throw new Error("Wallet not connected");
            }

            if (!ethers.isAddress(_to)) throw new Error("Invalid recipient address");

            const nonce = await walletWithProvider.provider.getTransactionCount(walletWithProvider.address);
            const feeData = await walletWithProvider.provider.getFeeData();
            const _chainId = (await walletWithProvider.provider.getNetwork()).chainId;

            if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas)
                throw new Error("Unable to fetch gas fees");

            const tx = {
                to: _to,
                value: parseEther(_value),
                nonce,
                gasLimit: 21000,
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                chainId: _chainId,
            };

            console.log("Signing transaction...");
            const signedTx = await walletWithProvider.signTransaction(tx);
            console.log("Broadcasting transaction...");
            const txResponse = await walletWithProvider.provider.broadcastTransaction(signedTx);
            console.log("Transaction hash:", txResponse.hash);

            const receipt = await txResponse.wait();
            if (!receipt) throw new Error("Transaction receipt not found");

            console.log("Transaction confirmed in block:", receipt.blockNumber);
            if (receipt.status === 0) throw new Error("Transaction failed on blockchain");

            return txResponse.hash;
        } catch (error: any) {
            console.error("Transaction error:", error);
            throw new Error(error.message || "Transaction failed");
        }
    };

    // ---------- ADD NEW ETH ACCOUNT ----------
    const handleAddNewAccountEth = () => {
        try {
            if (!(wallet instanceof HDNodeWallet) || !wallet.mnemonic) {
                console.log("No valid HD wallet or mnemonic found");
                return;
            }

            const mnemonicPhrase = wallet.mnemonic.phrase;
            const root = HDNodeWallet.fromPhrase(mnemonicPhrase);
            const nextIndex = derivedAccounts.length;
            const path = `m/44'/60'/0'/0/${nextIndex}`;
            const newWallet = root.derivePath(path);

            const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
            const newWalletWithProvider = newWallet.connect(provider);

            setDerivedAccounts([...derivedAccounts, newWallet]);
            setWallet(newWallet);
            setWalletWithProvider(newWalletWithProvider);

            newWallet.encrypt(actualPassword).then(saveWalletToStorage);
            console.log(`Added account ${nextIndex}:`, newWalletWithProvider.address);
        } catch (error) {
            console.log("Error adding new ETH account:", error);
        }
    };

    // ---------- LOAD WALLETS ----------
    const fetchAccountExists = async (password: string) => {
        try {
            setActualPassword(password);
            const storedWallets: string[] = JSON.parse(await AsyncStorage.getItem("eth_wallets") || "[]");
            const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
            if (storedWallets.length > 0) {
                const WalletsWithoutProvider = await Promise.all(
                    storedWallets.map(async (json) => await Wallet.fromEncryptedJson(json, password))
                );
                const WalletsWithProvider = WalletsWithoutProvider.map((w) => w.connect(provider));
                setDerivedAccounts(WalletsWithProvider);
                setWalletWithProvider(WalletsWithProvider[0]);
                setWallet(WalletsWithoutProvider[0]);
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error checking account existence:", error);
            return false;
        }
    };

    return (
        <AccountContext.Provider
            value={{
                walletWithProvider,
                password,
                setPassword,
                setWalletWithProvider,
                fetchAccountExists,
                handleCreateEth,
                handleSetPassword,
                handleImportPrivateKeyEth,
                copyToClipboard,
                hasWallet,
                setHasWallet,
                isAuthenticated,
                setIsAuthenticated,
                handleAddNewAccountEth,
                derivedAccounts,
                handleTransactionsEth,
                networkDetails,
                setNetworkDetails
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};


export const useAccount = (): AccountContextType => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error("useAccount must be used within an AccountProvider");
    }
    return context;
};
