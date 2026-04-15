import { Wordcloud } from "@visx/wordcloud";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock analytics data
const clarityData = [
  { name: "1 - Très insuffisant", count: 2 },
  { name: "2 - Insuffisant", count: 5 },
  { name: "3 - Moyen", count: 8 },
  { name: "4 - Bien", count: 18 },
  { name: "5 - Excellent", count: 12 },
];

const rhythmData = [
  { name: "1 - Trop lent", count: 1 },
  { name: "2 - Un peu lent", count: 4 },
  { name: "3 - Adapté", count: 28 },
  { name: "4 - Un peu rapide", count: 10 },
  { name: "5 - Trop rapide", count: 2 },
];

const usefulAspectsData = [
  { name: "Exemples pratiques", value: 35, color: "#00a859" },
  { name: "Exercices", value: 28, color: "#0066a1" },
  { name: "Démonstrations", value: 20, color: "#7ac143" },
  { name: "Discussions", value: 17, color: "#f39200" },
];

const wordCloudData = [
  { text: "pratique", value: 45 },
  { text: "clair", value: 38 },
  { text: "exercices", value: 35 },
  { text: "exemples", value: 32 },
  { text: "intéressant", value: 28 },
  { text: "rythme", value: 25 },
  { text: "explications", value: 22 },
  { text: "cours", value: 20 },
  { text: "théorie", value: 18 },
  { text: "difficile", value: 15 },
  { text: "rapide", value: 14 },
  { text: "utile", value: 12 },
  { text: "complexe", value: 10 },
  { text: "complet", value: 8 },
];

export function FormAnalytics() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const teacherAuth = JSON.parse(localStorage.getItem("teacherAuth") || "{}");
  const isReferent = teacherAuth.role === "referent";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/teacher/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Analytiques du formulaire</CardTitle>
            <CardDescription>
              Évaluation mi-parcours - Algorithmique Avancée • 45 réponses
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="wordcloud">Nuage de mots</TabsTrigger>
            {isReferent && <TabsTrigger value="comparative">Vue comparative</TabsTrigger>}
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Q1: Clarté des explications</CardTitle>
                <CardDescription>Distribution des réponses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clarityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#00a859" name="Nombre de réponses" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00a859] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Analyse</p>
                    <p className="text-sm text-green-700">
                      66% des étudiants trouvent les explications claires ou excellentes (note 4-5)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Q2: Rythme du cours</CardTitle>
                <CardDescription>Distribution des réponses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rhythmData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" name="Nombre de réponses" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Analyse</p>
                    <p className="text-sm text-purple-700">
                      62% des étudiants trouvent le rythme adapté. 27% le trouvent un peu rapide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Q3: Aspects les plus utiles</CardTitle>
                <CardDescription>Répartition des préférences</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={usefulAspectsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {usefulAspectsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wordcloud">
            <Card>
              <CardHeader>
                <CardTitle>Nuage de mots - Suggestions des étudiants</CardTitle>
                <CardDescription>
                  Basé sur les réponses à la question ouverte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: 400 }}>

                  <Wordcloud
                    words={wordCloudData}
                    width={500}
                    height={400}
                    fontSize={(word) => Math.sqrt(word.value) * 10}
                    rotate={() => (Math.random() > 0.5 ? 0 : 90)}
                  >
                    {(cloudWords) =>
                      cloudWords.map((w, i) => (
                        <text
                          key={w.text}
                          fill={["#00a859", "#0066a1", "#7ac143", "#f39200"][i % 4]}
                          textAnchor="middle"
                          transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                          fontSize={w.size}
                          fontFamily="Impact"
                        >
                          {w.text}
                        </text>
                      ))
                    }
                  </Wordcloud>


                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isReferent && (
            <TabsContent value="comparative">
              <Card>
                <CardHeader>
                  <CardTitle>Vue comparative - Tous les enseignants</CardTitle>
                  <CardDescription>
                    Comparaison des évaluations pour la matière Algorithmique Avancée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Prof. Martin (CM)</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Clarté moyenne</p>
                          <p className="text-2xl font-semibold text-blue-600">4.2/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Rythme</p>
                          <p className="text-2xl font-semibold text-purple-600">3.8/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Réponses</p>
                          <p className="text-2xl font-semibold text-green-600">45/60</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Prof. Dubois (TD)</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Clarté moyenne</p>
                          <p className="text-2xl font-semibold text-blue-600">4.5/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Rythme</p>
                          <p className="text-2xl font-semibold text-purple-600">4.0/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Réponses</p>
                          <p className="text-2xl font-semibold text-green-600">38/60</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Prof. Bernard (TP)</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Clarté moyenne</p>
                          <p className="text-2xl font-semibold text-blue-600">3.9/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Rythme</p>
                          <p className="text-2xl font-semibold text-purple-600">3.5/5</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Réponses</p>
                          <p className="text-2xl font-semibold text-green-600">42/60</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}