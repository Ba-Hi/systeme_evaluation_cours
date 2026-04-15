import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, Plus, Trash2, QrCode, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import QRCodeReact from "react-qr-code";

type QuestionType = "scale" | "multiple" | "text";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
}

export function FormEditor() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!formId;

  const [formName, setFormName] = useState(isEditing ? "Évaluation mi-parcours INF203" : "");
  const [formType, setFormType] = useState<"mi-parcours" | "fin-semestre">("mi-parcours");
  const [formFormat, setFormFormat] = useState<"CM/TD" | "CM/TP">("CM/TD");
  const [questions, setQuestions] = useState<Question[]>(isEditing ? [
    { id: "1", type: "scale", text: "Comment évaluez-vous la clarté du cours ?", options: ["1", "2", "3", "4", "5"] }
  ] : []);
  
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({ id: "", type: "scale", text: "", options: [] });
  const [publishedLink, setPublishedLink] = useState("");

  const handleAddQuestion = () => {
    if (!newQuestion.text) {
      toast.error("Veuillez saisir le texte de la question");
      return;
    }

    const questionToAdd: Question = {
      ...newQuestion,
      id: Date.now().toString(),
      options: newQuestion.type === "scale" 
        ? ["1 - Très insuffisant", "2 - Insuffisant", "3 - Moyen", "4 - Bien", "5 - Excellent"]
        : newQuestion.type === "multiple"
        ? ["Option 1", "Option 2", "Option 3"]
        : undefined
    };

    setQuestions([...questions, questionToAdd]);
    setNewQuestion({ id: "", type: "scale", text: "", options: [] });
    setShowAddQuestion(false);
    toast.success("Question ajoutée");
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Question supprimée");
  };

  const handlePublish = () => {
    if (questions.length === 0) {
      toast.error("Ajoutez au moins une question avant de publier");
      return;
    }
    if (!formName) {
      toast.error("Veuillez donner un nom au formulaire");
      return;
    }

    const link = `https://evaluation.ensimag.fr/form/${Date.now()}`;
    setPublishedLink(link);
    setShowPublishDialog(true);
    toast.success("Formulaire publié avec succès");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publishedLink);
    toast.success("Lien copié ✓");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Modifier le formulaire" : "Créer un nouveau formulaire"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formName">Nom du formulaire</Label>
              <Input
                id="formName"
                placeholder="Ex: Évaluation mi-parcours INF203"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type d'évaluation</Label>
                <Select value={formType} onValueChange={(v: any) => setFormType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mi-parcours">Mi-parcours</SelectItem>
                    <SelectItem value="fin-semestre">Fin-semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={formFormat} onValueChange={(v: any) => setFormFormat(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CM/TD">CM/TD</SelectItem>
                    <SelectItem value="CM/TP">CM/TP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Questions ({questions.length})</h2>
            <Button onClick={() => setShowAddQuestion(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une question
            </Button>
          </div>

          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      <p className="flex-1">{question.text}</p>
                    </div>
                    <div className="ml-6 text-sm text-slate-600">
                      Type: <span className="font-medium">{question.type}</span>
                      {question.options && (
                        <span className="ml-2">• {question.options.length} options</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser
          </Button>
          <Button onClick={handlePublish} className="flex-1">
            <QrCode className="w-4 h-4 mr-2" />
            Publier et générer QR Code
          </Button>
        </div>
      </div>

      {/* Add Question Dialog */}
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type de question</Label>
              <Select 
                value={newQuestion.type} 
                onValueChange={(v: QuestionType) => setNewQuestion({...newQuestion, type: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scale">Échelle (1-5)</SelectItem>
                  <SelectItem value="multiple">Choix multiple</SelectItem>
                  <SelectItem value="text">Texte libre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea
                placeholder="Saisissez votre question..."
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddQuestion(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddQuestion}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog with QR Code */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Formulaire publié</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white">
              {publishedLink && (
                <QRCodeReact value={publishedLink} size={200} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Lien du formulaire</Label>
              <div className="flex gap-2">
                <Input value={publishedLink} readOnly />
                <Button size="icon" variant="outline" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Partagez ce lien ou ce QR code avec vos étudiants pour qu'ils puissent répondre au formulaire.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setShowPublishDialog(false);
              navigate("/teacher/dashboard");
            }}>
              Terminé
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
