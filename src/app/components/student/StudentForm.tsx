import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, Save, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock form data
const mockForm = {
  id: "1",
  title: "Évaluation mi-parcours - Algorithmique Avancée",
  course: "INF203",
  questions: [
    {
      id: "q1",
      type: "scale",
      text: "Comment évaluez-vous la clarté des explications du cours ?",
      required: true,
      options: ["1 - Très insuffisant", "2 - Insuffisant", "3 - Moyen", "4 - Bien", "5 - Excellent"]
    },
    {
      id: "q2",
      type: "scale",
      text: "Le rythme du cours est-il adapté ?",
      required: true,
      options: ["1 - Trop lent", "2 - Un peu lent", "3 - Adapté", "4 - Un peu rapide", "5 - Trop rapide"]
    },
    {
      id: "q3",
      type: "multiple",
      text: "Quels aspects du cours trouvez-vous les plus utiles ?",
      required: true,
      options: ["Les exemples pratiques", "Les exercices", "Les démonstrations théoriques", "Les discussions en classe"]
    },
    {
      id: "q4",
      type: "text",
      text: "Quelles suggestions avez-vous pour améliorer le cours ?",
      required: false,
    }
  ]
};

export function StudentForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const requiredQuestions = mockForm.questions.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => responses[q.id]).length;
  const progress = (answeredRequired / requiredQuestions.length) * 100;
  const isComplete = answeredRequired === requiredQuestions.length;

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(`draft_${formId}`, JSON.stringify(responses));
    toast.success("Brouillon enregistré");
  };

  const handleSubmit = () => {
    if (!isComplete) {
      setShowIncompleteWarning(true);
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    // Anonymize and submit
    localStorage.removeItem(`draft_${formId}`);
    toast.success("Formulaire soumis avec succès ✓");
    setTimeout(() => {
      navigate("/student/dashboard");
    }, 1000);
  };

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(`draft_${formId}`);
    if (draft) {
      setResponses(JSON.parse(draft));
      toast.info("Brouillon chargé");
    }
  }, [formId]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/student/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{mockForm.title}</CardTitle>
            <CardDescription>
              {mockForm.course} • Temps estimé : 3 minutes
            </CardDescription>
            <div className="pt-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progression</span>
                <span>{answeredRequired} / {requiredQuestions.length} questions obligatoires</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {mockForm.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-2">
                  <span className="text-[#00a859]">{index + 1}.</span>
                  <span className="flex-1">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.type === "scale" || question.type === "multiple" ? (
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                  >
                    {question.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                        <Label htmlFor={`${question.id}-${optIndex}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    placeholder="Votre réponse..."
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    rows={4}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button variant="outline" onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isComplete}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            Soumettre
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la soumission</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir soumettre ce formulaire ? 
              Vos réponses seront anonymisées et vous ne pourrez plus les modifier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Incomplete Warning Dialog */}
      <AlertDialog open={showIncompleteWarning} onOpenChange={setShowIncompleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Questions manquantes
            </AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez répondre à toutes les questions obligatoires avant de soumettre.
              <div className="mt-4 space-y-1">
                {requiredQuestions.map((q, i) => (
                  !responses[q.id] && (
                    <div key={q.id} className="text-red-600 text-sm">
                      • Question {i + 1}: {q.text}
                    </div>
                  )
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Compris</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}