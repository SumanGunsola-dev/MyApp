import { ALCHEMY_API_KEY } from "@env";
import Ethereum from "../Assets/Images/ethereum-eth.svg";
import Base from "../Assets/Images/base.svg";
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

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
    icon?: FC<SvgProps> | ReturnType<typeof require>;
}

export const CHAINS: Record<string, ChainInfo> = {
    ethereum: {
        name: "Ethereum Mainnet",
        chainId: 1,
        rpcUrls: [`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://etherscan.io"],
        icon: Ethereum,
    },
    sepolia: {
        name: "Sepolia Testnet",
        chainId: 11155111,
        rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],
        nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
        icon: Ethereum,
    },
    polygon: {
        name: "Polygon",
        chainId: 137,
        rpcUrls: ["https://polygon-rpc.com"],
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        blockExplorerUrls: ["https://polygonscan.com"],
        icon: require("../Assets/Images/Polygon.png"),
    },
    optimism: {
        name: "Optimism",
        chainId: 10,
        rpcUrls: ["https://mainnet.optimism.io"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
        icon: require("../Assets/Images/Optimism.jpg")
        ,
    },

    arbitrum: {
        name: "Arbitrum One",
        chainId: 42161,
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://arbiscan.io"],
        icon: require("../Assets/Images/arbitrum.png"),
    },
    base: {
        name: "Base",
        chainId: 8453,
        rpcUrls: ["https://mainnet.base.org"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://basescan.org"],
        icon: Base,
    },
    avalanche: {
        name: "Avalanche C-Chain",
        chainId: 43114,
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
        blockExplorerUrls: ["https://snowtrace.io"],
        icon: require("../Assets/Images/Avalanche.png"),
    },
    bsc: {
        name: "BNB Smart Chain",
        chainId: 56,
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        blockExplorerUrls: ["https://bscscan.com"],
        icon: require("../Assets/Images/bsc.png"),
    },
    fantom: {
        name: "Fantom Opera",
        chainId: 250,
        rpcUrls: ["https://rpc.ftm.tools"],
        nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
        blockExplorerUrls: ["https://ftmscan.com"],
        icon: require("../Assets/Images/fantom.png"),
    },
    zksync: {
        name: "zkSync Era",
        chainId: 324,
        rpcUrls: ["https://mainnet.era.zksync.io"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://explorer.zksync.io"],
        icon: require("../Assets/Images/zlsync.webp"),
    },
    linea: {
        name: "Linea",
        chainId: 59144,
        rpcUrls: ["https://rpc.linea.build"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://lineascan.build"],
        icon: require("../Assets/Images/linea.png"),
    },
    celo: {
        name: "Celo",
        chainId: 42220,
        rpcUrls: ["https://forno.celo.org"],
        nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
        blockExplorerUrls: ["https://celoscan.io"],
        icon: require("../Assets/Images/celo.png"),
    },
};

export default CHAINS;
