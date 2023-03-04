import styles from "../styles/InstructionsComponent.module.css";
import * as React from 'react';
import { useAccount, useContractWrite, useEnsName } from 'wagmi'
import abi from "./abi.json";
import { ethers } from "ethers";
function useDebounce(value, delay) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = React.useState(value);
	React.useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);
			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay] // Only re-call effect if value or delay changes
	);
	return debouncedValue;
}
export default function AxelarComponent() {
	const { address, isConnected } = useAccount()
	const [isLoading, setIsLoading] = React.useState(false)
	const [data, setData] = React.useState();
	const [isSuccess, setIsSuccess] = React.useState(false)

	const doWrite = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract("0xe14923bd10029327b71496425e62075dfd1859b1", abi, signer);
		const transaction = await contract.setRemoteValue("Polygon", "0x955f05543c9ff76843df04f944e5a1e4952bfc5d", "wow", { value: ethers.utils.parseEther("0.005") })
		const data = await transaction.wait();
		setIsLoading(false);
		setIsSuccess(true);
		setData(data);
	}


	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Cross Chain <span>Randomness</span>
				</h1>
				<p>
					Get randomness from Ethereum RANDAO on other chains using Axelar and use it for anything!
				</p>
			</header>

			<div className={styles.buttons_container}>
				<a
					onClick={(e) => {
						doWrite(e);
					}}>

				<div className={styles.button}>
					<p>Request Randomness On Polygon</p>
				</div>
				</a>

				{isLoading && <p><br/>Submitted and waiting for transaction....</p>}
				{isSuccess && <p><br/>Done! (<a target={"_blank"} href={`https://goerli.etherscan.io/tx/${data?.hash}`}>Click for Etherscan link</a>)</p>}
			</div>
			<div>
				<p>Made with 💙</p>
			</div>
		</div>
	);
}
