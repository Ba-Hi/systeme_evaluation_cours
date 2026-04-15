import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LogOut, QrCode, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockCourses = [
  { id: "1", name: "Algorithmique Avancée", code: "INF203", type: "mi-parcours", status: "pending" },
  { id: "2", name: "Systèmes d'Exploitation", code: "INF204", type: "fin-semestre", status: "pending" },
  { id: "3", name: "Bases de Données", code: "INF205", type: "mi-parcours", status: "completed" },
  { id: "4", name: "Réseaux Informatiques", code: "INF206", type: "fin-semestre", status: "pending" },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const studentAuth = JSON.parse(localStorage.getItem("studentAuth") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("studentAuth");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const handleCourseSelect = (courseId: string) => {
    navigate(`/student/form/${courseId}`);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
    // Simulate QR code scan
    setTimeout(() => {
      setShowQRScanner(false);
      toast.success("QR Code scanné avec succès");
      navigate("/student/form/1");
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-slate-600 mt-1">
              Bienvenue, {studentAuth.login}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleQRScan} size="lg" className="flex-1">
            <QrCode className="w-5 h-5 mr-2" />
            Scanner un QR Code
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl">
            Mes Matières
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockCourses.map((course) => (
              <Card 
                key={course.id}
                className={`hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#00a859] ${
                  course.status === "completed" ? "opacity-60" : ""
                }`}
                onClick={() => course.status === "pending" && handleCourseSelect(course.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#00a859]" />
                        {course.name}
                      </CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    {course.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-[#00a859]" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Évaluation {course.type}
                    </div>
                    {course.status === "pending" ? (
                      <span className="text-[#f39200]">En attente</span>
                    ) : (
                      <span className="text-[#00a859]">Complété</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanner le QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-48 h-48 bg-slate-200 rounded-lg flex items-center justify-center animate-pulse">
              <QrCode className="w-24 h-24 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">Scannez le QR code affiché en cours...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}