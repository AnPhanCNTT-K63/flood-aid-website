import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../apis/services/AuthService";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginByGoogle = () => {
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    const response = await googleAuth(credentialResponse.credential);
    console.log("Backend Response:", response.data);

    localStorage.setItem("token", response.data?.accessToken);
    navigate("/");
    window.location.reload();
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text="Login with Google"
      />
    </GoogleOAuthProvider>
  );
};

export default LoginByGoogle;
