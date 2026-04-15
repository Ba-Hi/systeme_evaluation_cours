import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

// Mock response data
const mockResponses = [
  {
    id: "1",
    timestamp: "2026-03-28 10:30",
    q1: "5 - Excellent",
    q2: "3 - Adapté",
    q3: "Les exemples pratiques",
    q4: "Plus d'exercices pratiques seraient appréciés"
  },
  {
    id: "2",
    timestamp: "2026-03-28 11:15",
    q1: "4 - Bien",
    q2: "3 - Adapté",
    q3: "Les exercices",
    q4: "Le cours est très bien structuré"
  },
  {
    id: "3",
    timestamp: "2026-03-28 14:20",
    q1: "4 - Bien",
    q2: "4 - Un peu rapide",
    q3: "Les démonstrations théoriques",
    q4: "Peut-être ralentir un peu le rythme"
  },
  {
    id: "4",
    timestamp: "2026-03-28 15:45",
    q1: "5 - Excellent",
    q2: "3 - Adapté",
    q3: "Les discussions en classe",
    q4: "Rien à redire, excellent cours !"
  },
  {
    id: "5",
    timestamp: "2026-03-28 16:30",
    q1: "3 - Moyen",
    q2: "4 - Un peu rapide",
    q3: "Les exemples pratiques",
    q4: "Certains concepts mériteraient plus d'explications"
  },
];

const questions = [
  "Comment évaluez-vous la clarté des explications du cours ?",
  "Le rythme du cours est-il adapté ?",
  "Quels aspects du cours trouvez-vous les plus utiles ?",
  "Quelles suggestions avez-vous pour améliorer le cours ?"
];

export function FormResponses() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const handleExport = () => {
    // Simulate export to XLSX
    toast.success("Export XLSX en cours...");
    setTimeout(() => {
      toast.success("Fichier téléchargé : reponses.xlsx");
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Réponses au formulaire</CardTitle>
                <CardDescription>
                  Évaluation mi-parcours - Algorithmique Avancée
                </CardDescription>
              </div>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exporter (XLSX)
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 mb-4">
              Total des réponses : {mockResponses.length} • Les réponses sont anonymisées
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Date/Heure</TableHead>
                    <TableHead>Q1: Clarté</TableHead>
                    <TableHead>Q2: Rythme</TableHead>
                    <TableHead>Q3: Aspects utiles</TableHead>
                    <TableHead>Q4: Suggestions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">{response.timestamp}</TableCell>
                      <TableCell>{response.q1}</TableCell>
                      <TableCell>{response.q2}</TableCell>
                      <TableCell>{response.q3}</TableCell>
                      <TableCell className="max-w-xs truncate">{response.q4}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions du formulaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-blue-600 font-medium">Q{index + 1}:</span>
                  <span className="text-slate-700">{question}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
