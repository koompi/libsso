import React, { useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

export function useSSO({
	projectToken,
	onSucess,
	ssoDomain = "https://sso.baray.io",
	consumerDomain = window.location.origin,
}: {
	projectToken: string;
	ssoDomain?: string;
	consumerDomain?: string;
	onSucess: (token: string) => void;
}) {
	const iframe = useRef<HTMLIFrameElement>(null);

	const [checking, setIsChecking] = useState(true);
	const [isDetected, setIsDetected] = useState(false);
	const [posted, setPosted] = useState(false);

	const [toLogin, setToLogin] = useState<{
		email: string;
		tg_first_name: string;
		tg_photo_url: string;
	}>();

	useEventListener("message", (e) => {
		if (e.origin === ssoDomain) {
			if (e.data.name === "login_status") {
				setIsDetected(e.data.isLogin);
				console.log("received", e.data.user);

				setToLogin(e.data.user);
				setIsChecking(false);
			}
		}
	});

	useEffect(() => {
		if (projectToken && iframe && iframe.current) {
			setTimeout(() => {
				iframe.current!.contentWindow!.postMessage({ name: "check" }, "*", []);
				setPosted(true);
			}, 2000);
		}
	}, [projectToken, posted, iframe]);

	useEffect(() => {
		const search = new URLSearchParams(window.location.search);
		const token = search.get("token");
		if (token) {
			setTimeout(() => onSucess(token), 1000);
		}
	}, [onSucess]);

	const Detector = () => {
		if (!projectToken) {
			return null;
		}

		return (
			<iframe
				src={`${ssoDomain}/?token=${projectToken}&origin=${consumerDomain}`}
				ref={iframe}
				hidden
			/>
		);
	};

	const LoadingSSO = (loading: { children?: React.ReactNode }) => {
		if (!checking) {
			return null;
		}
		return <>{loading.children}</>;
	};

	const ConnectDetectedAccount = (props: {
		children: (
			detectAccount: () => typeof toLogin,
			connectDetectAccount: () => void
		) => React.ReactNode;
	}) => {
		if (!checking && isDetected) {
			return (
				<>
					{props.children(
						() => toLogin,
						() => {
							iframe.current!.contentWindow!.postMessage(
								{ name: "yes" },
								"*",
								[]
							);
						}
					)}
				</>
			);
		}

		return null;
	};

	const LoginWithSSO = (props: {
		children: (handler: () => void) => React.ReactNode;
	}) => {
		if (!checking && !isDetected) {
			return (
				<>
					{props.children(() => {
						window.location.replace(
							`${ssoDomain}/?token=${projectToken}&origin=${consumerDomain}`
						);
					})}
				</>
			);
		}
		return null;
	};

	return {
		Detector,
		LoadingSSO,
		ConnectDetectedAccount,
		LoginWithSSO,
	};
}
