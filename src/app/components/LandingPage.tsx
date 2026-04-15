import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { GraduationCap, Users } from "lucide-react";
import { EnsimagLogo } from "./EnsimagLogo";

export function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <EnsimagLogo className="h-20" />
          </div>
          <h1 className="text-5xl tracking-tight">
            Système d'Évaluation
          </h1>
          <p className="text-xl text-slate-600">
            Plateforme de feedback étudiant-enseignant
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-[#00a859]">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00a859] to-[#7ac143] rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Espace Étudiant</CardTitle>
              <CardDescription>
                Répondez aux formulaires d'évaluation de vos cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student/login">
                <Button className="w-full" size="lg">
                  Connexion Étudiant
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-[#0066a1]">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0066a1] to-[#00a859] rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Espace Enseignant</CardTitle>
              <CardDescription>
                Créez des formulaires et consultez les résultats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/teacher/login">
                <Button className="w-full" size="lg" variant="outline">
                  Connexion Enseignant
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}