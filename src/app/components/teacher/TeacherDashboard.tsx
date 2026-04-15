import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { LogOut, Plus, FileText, BarChart3, Clock, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockForms = [
  {
    id: "1",
    name: "Évaluation mi-parcours INF203",
    course: "Algorithmique Avancée",
    type: "mi-parcours",
    format: "CM/TD",
    status: "published",
    responses: 45,
    totalStudents: 60,
    createdAt: "2026-03-15"
  },
  {
    id: "2",
    name: "Évaluation fin-semestre INF204",
    course: "Systèmes d'Exploitation",
    type: "fin-semestre",
    format: "CM/TP",
    status: "published",
    responses: 32,
    totalStudents: 58,
    createdAt: "2026-03-20"
  },
  {
    id: "3",
    name: "Évaluation mi-parcours INF205",
    course: "Bases de Données",
    type: "mi-parcours",
    format: "CM/TD",
    status: "draft",
    responses: 0,
    totalStudents: 55,
    createdAt: "2026-03-28"
  },
];

export function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherAuth = JSON.parse(localStorage.getItem("teacherAuth") || "{}");
  const isReferent = teacherAuth.role === "referent";

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl tracking-tight">
              Tableau de bord Enseignant
            </h1>
            <p className="text-slate-600 mt-1">
              Bienvenue, {teacherAuth.login} • 
              <Badge variant="outline" className="ml-2">
                {isReferent ? "Référent" : "Enseignant"}
              </Badge>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {isReferent && (
          <Button onClick={() => navigate("/teacher/form/new")} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Créer un nouveau formulaire
          </Button>
        )}

        <div className="space-y-4">
          <h2 className="text-xl">
            Mes Formulaires
          </h2>
          <div className="grid gap-4">
            {mockForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow border-2 hover:border-[#00a859]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#00a859]" />
                        {form.name}
                      </CardTitle>
                      <CardDescription>
                        {form.course} • {form.format}
                      </CardDescription>
                    </div>
                    <Badge variant={form.status === "published" ? "default" : "secondary"}>
                      {form.status === "published" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Publié
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Brouillon
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{form.responses} / {form.totalStudents} réponses</span>
                      </div>
                      <Badge variant="outline">{form.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isReferent && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/teacher/form/${form.id}/edit`)}
                      >
                        Éditer
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/teacher/form/${form.id}/responses`)}
                      disabled={form.responses === 0}
                    >
                      Voir les réponses
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/teacher/form/${form.id}/analytics`)}
                      disabled={form.responses === 0}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Analytiques
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}