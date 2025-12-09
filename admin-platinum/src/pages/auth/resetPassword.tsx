import CredentialsLayout from "@/components/Layouts/CredentialsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/services/supabase";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [validToken, setValidToken] = useState<boolean>(false);

  useEffect(() => {
    const checkRecoveryToken = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (!accessToken || type !== "recovery") {
        setError("Enlace de recuperación inválido o expirado.");
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
          setValidToken(true);
        }
      });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Error al verificar el enlace de recuperación.");
        return;
      }

      if (session) {
        setValidToken(true);
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    checkRecoveryToken();
  }, [location]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage("Contraseña actualizada exitosamente. Redirigiendo...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar la contraseña";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CredentialsLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Nueva Contraseña</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tu nueva contraseña
        </p>
      </div>
      {validToken ? (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          {message && (
            <div className="text-sm text-green-500 text-center">{message}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
        </form>
      ) : (
        <div className="grid gap-4">
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          <Button
            type="button"
            className="w-full"
            onClick={() => navigate("/olvide-mi-contrasena")}
          >
            Solicitar Nuevo Enlace
          </Button>
        </div>
      )}
    </CredentialsLayout>
  );
};

export default ResetPassword;

