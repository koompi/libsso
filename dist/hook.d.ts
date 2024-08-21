import { default as React } from 'react';
export declare function useSSO({ projectToken, onSucess, ssoDomain, consumerDomain, }: {
    projectToken: string;
    ssoDomain?: string;
    consumerDomain?: string;
    onSucess: (token: string) => void;
}): {
    Detector: () => import("react/jsx-runtime").JSX.Element | null;
    LoadingSSO: (loading: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element | null;
    ConnectDetectedAccount: (props: {
        children: (detectAccount: {
            email: string;
            tg_first_name: string;
            tg_photo_url: string;
        } | undefined, connectDetectAccount: () => void) => React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element | null;
    LoginWithSSO: (props: {
        children: (handler: () => void) => React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element | null;
};
