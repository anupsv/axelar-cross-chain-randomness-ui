import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import * as React from 'react';
import { useAccount, useContractWrite, useEnsName } from 'wagmi'
import abi from "./abi.json";
import {
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi'
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
	const router = useRouter();
	const { address, isConnected } = useAccount()
	const [message, setMessage] = React.useState('')
	const debouncedTokenId = useDebounce(message, 10)

	const {
		config,
		error: prepareError,
		isError: isPrepareError,
	} = usePrepareContractWrite({
		address: '0xe14923bd10029327b71496425e62075dfd1859b1',
		abi: abi,
		functionName: 'setRemoteValue',
		args: ["Polygon", "0x955f05543c9ff76843df04f944e5a1e4952bfc5d", "wow"],
		enabled: Boolean(debouncedTokenId)
	})
	const { data, error, isError, write } = useContractWrite(config)

	console.log(data, error);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	})

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
					target={"_blank"}
					onClick={(e) => {
						e.preventDefault();
						write();
					}}>

				<div className={styles.button}>
					<p>Request Randomness On Polygon</p>
				</div>
				</a>
			</div>
			<div>
				{(isPrepareError || isError) && (
					<div>Error: {(prepareError || error)?.message}</div>
				)}
				<p>Made with 💙</p>
			</div>
		</div>
	);
}
