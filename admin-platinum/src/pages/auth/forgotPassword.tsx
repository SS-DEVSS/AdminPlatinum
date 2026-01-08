import CredentialsLayout from "@/components/Layouts/CredentialsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/services/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico.");
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo de recuperación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CredentialsLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar Contraseña</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}
        {message && (
          <div className="text-sm text-green-500 text-center">{message}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
        </Button>
      </form>
    </CredentialsLayout>
  );
};

export default ForgotPassword;
