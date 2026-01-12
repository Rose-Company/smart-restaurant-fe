interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: any) => void;
        }) => {
          requestAccessToken: () => void;
        };
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode: string;
          callback: (response: any) => void;
        }) => {
          requestCode: () => void;
        };
      };
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, config: any) => void;
        prompt: () => void;
      };
    };
  };
}