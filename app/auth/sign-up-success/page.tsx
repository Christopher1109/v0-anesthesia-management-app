import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>Verifique su correo electrónico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Se ha enviado un correo de confirmación a su dirección de email. Por favor, verifique su bandeja de
              entrada y confirme su cuenta antes de iniciar sesión.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Ir a Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
