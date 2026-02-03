export interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const parseJwt = (token: string): GoogleProfile | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const json = JSON.parse(decoded);
    return {
      name: json.name,
      email: json.email,
      picture: json.picture
    };
  } catch (error) {
    console.error('No se pudo decodificar el token de Google.', error);
    return null;
  }
};

export const initGoogleSignIn = (
  container: HTMLElement,
  clientId: string,
  onSuccess: (profile: GoogleProfile) => void,
  onError: (message: string) => void
) => {
  if (!window.google?.accounts?.id) {
    onError('Google Identity Services no está disponible.');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      const profile = parseJwt(response.credential);
      if (!profile?.email) {
        onError('No se pudo validar tu cuenta de Google.');
        return;
      }
      onSuccess(profile);
    }
  });

  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    width: 320
  });
};
