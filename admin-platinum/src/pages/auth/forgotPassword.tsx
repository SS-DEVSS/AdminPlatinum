import CredentialsLayout from "@/components/Layouts/CredentialsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verifiedCode, setVerifiedCode] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleCode = (value: string) => {
    setVerificationCode(value);
  };

  const verifyCode = () => {
    if (verificationCode === "123456") {
      setVerifiedCode(true);
    }
    return;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const verifyPassword = () => {
    if (newPassword === confirmPassword) {
      navigate("/");
    } else {
    }
  };

  return (
    <CredentialsLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">
          {verifiedCode ? "Contraseña Nueva" : "Ingrese Código"}
        </h1>
        <p className="text-balance text-muted-foreground">
          {verifiedCode
            ? "Ingrese una nueva contraseña"
            : "Ingrese el código que enviamos a su correo m******a@gmail.com."}
        </p>
      </div>
      <div className="grid gap-6">
        {verifiedCode ? (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="new-password">Contraseña Nueva</Label>
            </div>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="flex items-center">
              <Label htmlFor="confirm-password">Verificar Contraseña</Label>
            </div>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={handleCode}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}
        <Button
          onClick={verifiedCode ? verifyPassword : verifyCode}
          type="submit"
          className="w-full"
        >
          {verifiedCode ? "Verificar Contraseña" : "Verificar Código"}
        </Button>
      </div>
    </CredentialsLayout>
  );
};

export default ForgotPassword;
