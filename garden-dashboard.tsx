"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  LayoutDashboard,
  Leaf,
  Menu,
  Settings,
  Sprout,
  Thermometer,
  Droplets,
  Activity,
  MessageSquare,
  Bell,
  Users,
  Clock,
  CheckCircle2,
  Send,
  ThumbsUp,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import axios from "axios"

export default function GardenDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobile, setIsMobile] = useState(false)

  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidite: null,
    pourcentage_luminosite: null,
    valeur_eau: null,
    tension_sol: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temperature = await axios.get("http://localhost:3001/api/temperature")
        const humidite = await axios.get("http://localhost:3001/api/humidite")
        const sol = await axios.get("http://localhost:3001/api/sol")
        const luminosite = await axios.get("http://localhost:3001/api/luminosite")
        const niveau_eau = await axios.get("http://localhost:3001/api/niveau_eau")
  
        const data = {
          temperature: temperature.data.temperature,
          humidite: humidite.data.humidite,
          pourcentage_luminosite: luminosite.data.pourcentage_luminosite,
          valeur_eau: niveau_eau.data.valeur_eau,
          tension_sol: sol.data.tension_sol,
        }
  
        setSensorData(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }


    fetchData()
    const interval = setInterval(fetchData, 2000) // ← met à jour toutes les 2 secondes
  
    return () => clearInterval(interval)
  }, [])

  // Vérifier si l'écran est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Données pour les graphiques
  const [humidityHistory, setHumidityHistory] = useState<{ day: string; value: number; optimal: number }[]>([])
const [temperatureHistory, setTemperatureHistory] = useState<{ day: string; value: number; optimal: number }[]>([])
const [luminosityHistory, setLuminosityHistory] = useState<{ day: string; value: number; optimal: number }[]>([])
const [eauHistory, setEauHistory] = useState<{ day: string; value: number; optimal: number }[]>([])

useEffect(() => {
  const fetchData = async () => {
    try {
      const tempRes = await axios.get("http://localhost:3001/api/temperature")
      const humRes = await axios.get("http://localhost:3001/api/humidite")
      const lumiRes = await axios.get("http://localhost:3001/api/luminosite")
      const eauRes = await axios.get("http://localhost:3001/api/niveau_eau")

      const temp = tempRes.data.temperature
      const hum = humRes.data.humidite
      const lumi = lumiRes.data.pourcentage_luminosite
      const eau = eauRes.data.valeur_eau

      setSensorData(prev => ({
        ...prev,
        temperature: temp,
        humidite: hum,
        pourcentage_luminosite: lumi,
        valeur_eau: eau,
      }))

      const updateHistory = (prev, newValue, optimal = 65) => {
        const date = new Date()
        const day = date.toLocaleDateString("fr-FR", { weekday: "short" })
        const formattedDay = day.charAt(0).toUpperCase() + day.slice(1, 3) // "Lun", "Mar", etc.

        const newEntry = {
          day: formattedDay,
          value: newValue,
          optimal,
        }

        return [...prev.slice(-6), newEntry] // Garde les 7 dernières valeurs
      }

      setHumidityHistory(prev => updateHistory(prev, hum, 65))
      setTemperatureHistory(prev => updateHistory(prev, temp, 22))
      setLuminosityHistory(prev => updateHistory(prev, Math.round(lumi), 85))
      setEauHistory(prev => updateHistory(prev, Math.round((eau / 65535) * 100), 70)) // Eau convertie en %

    } catch (err) {
      console.error("Erreur fetch capteurs:", err)
    }
  }

  fetchData()
  const interval = setInterval(fetchData, 2000) // actualise toutes les 2 sec

  return () => clearInterval(interval)
}, [])
  

  // Données pour l'historique des activités
  const activityHistory = [
    {
      id: 1,
      user: { name: "Sophie", avatar: "/placeholder.svg?height=40&width=40" },
      action: "a arrosé la Zone 3",
      time: "Il y a 30 min",
      zone: "Zone 3",
      likes: 2,
      comments: 1,
    },
    {
      id: 2,
      user: { name: "Thomas", avatar: "/placeholder.svg?height=40&width=40" },
      action: "a récolté 2kg de tomates",
      time: "Il y a 2h",
      zone: "Zone 1",
      likes: 5,
      comments: 3,
    },
    {
      id: 3,
      user: { name: "Léa", avatar: "/placeholder.svg?height=40&width=40" },
      action: "a ajouté de l'engrais naturel",
      time: "Hier, 18:30",
      zone: "Zone 2",
      likes: 3,
      comments: 0,
    },
    {
      id: 4,
      user: { name: "Marc", avatar: "/placeholder.svg?height=40&width=40" },
      action: "a taillé les plants de tomates",
      time: "Hier, 15:45",
      zone: "Zone 1",
      likes: 1,
      comments: 2,
    },
    {
      id: 5,
      user: { name: "Sophie", avatar: "/placeholder.svg?height=40&width=40" },
      action: "a planté de nouvelles graines de radis",
      time: "Il y a 2 jours",
      zone: "Zone 2",
      likes: 4,
      comments: 1,
    },
  ]

  // Données pour les membres de l'équipe
  const teamMembers = [
    { name: "Sophie", avatar: "/placeholder.svg?height=40&width=40", role: "Admin", status: "En ligne" },
    { name: "Thomas", avatar: "/placeholder.svg?height=40&width=40", role: "Jardinier", status: "En ligne" },
    { name: "Léa", avatar: "/placeholder.svg?height=40&width=40", role: "Jardinier", status: "Hors ligne" },
    { name: "Marc", avatar: "/placeholder.svg?height=40&width=40", role: "Jardinier", status: "Inactif" },
  ]

  // Données pour les messages
  const messages = [
    {
      id: 1,
      user: { name: "Thomas", avatar: "/placeholder.svg?height=40&width=40" },
      message:
        "J'ai remarqué que les plants de tomates ont besoin d'être tuteurés. Quelqu'un peut s'en occuper demain ?",
      time: "Il y a 1h",
    },
    {
      id: 2,
      user: { name: "Sophie", avatar: "/placeholder.svg?height=40&width=40" },
      message: "Je peux m'en occuper demain matin vers 10h !",
      time: "Il y a 45min",
    },
    {
      id: 3,
      user: { name: "Léa", avatar: "/placeholder.svg?height=40&width=40" },
      message: "Super ! J'apporterai de nouveaux tuteurs, les anciens commencent à s'abîmer.",
      time: "Il y a 30min",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-[#f8faf5]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[#f8faf5]">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold text-[#4a8f3c]"
                  onClick={() => setIsOpen(false)}
                >
                  <Leaf className="h-6 w-6" />
                  <span className="text-xl">MonPotager</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => {
                    setActiveTab("overview")
                    setIsOpen(false)
                  }}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Tableau de bord
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => {
                    setActiveTab("garden")
                    setIsOpen(false)
                  }}
                >
                  <Sprout className="h-5 w-5" />
                  Mon potager
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => {
                    setActiveTab("team")
                    setIsOpen(false)
                  }}
                >
                  <Users className="h-5 w-5" />
                  Équipe
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => {
                    setActiveTab("sensors")
                    setIsOpen(false)
                  }}
                >
                  <Activity className="h-5 w-5" />
                  Capteurs
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => {
                    setActiveTab("tasks")
                    setIsOpen(false)
                  }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Tâches
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  Calendrier
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-[#4a8f3c]"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Paramètres
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold text-[#4a8f3c] md:text-xl">
            <Leaf className="h-6 w-6" />
            <span>MonPotager</span>
          </Link>
          <div className="ml-auto hidden md:block">
            <SidebarTrigger />
          </div>
          <nav className="ml-auto flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e94e4e] text-[10px] text-white">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div className="hidden md:block">
              <Button variant="outline" size="sm">
                Aide
              </Button>
            </div>
            <Avatar className="h-8 w-8 border-2 border-[#4a8f3c]">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sophie" />
              <AvatarFallback>SO</AvatarFallback>
            </Avatar>
          </nav>
        </header>
        <div className="flex flex-1">
          <Sidebar collapsible="icon" variant="floating" className="bg-gradient-to-b from-[#f0f7eb] to-[#e9f5e3]">
            <SidebarHeader className="p-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#4a8f3c] to-[#7abe4e] shadow-md">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-[#2c5e1a] font-medium">Menu Principal</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                        tooltip="Tableau de bord"
                        className={`transition-all duration-200 ${
                          activeTab === "overview"
                            ? "bg-gradient-to-r from-[#4a8f3c] to-[#7abe4e] text-white shadow-md"
                            : "hover:bg-[#e0e9d9] hover:text-[#2c5e1a]"
                        }`}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Tableau de bord</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "garden"}
                        onClick={() => setActiveTab("garden")}
                        tooltip="Mon potager"
                        className={`transition-all duration-200 ${
                          activeTab === "garden"
                            ? "bg-gradient-to-r from-[#4a8f3c] to-[#7abe4e] text-white shadow-md"
                            : "hover:bg-[#e0e9d9] hover:text-[#2c5e1a]"
                        }`}
                      >
                        <Sprout className="h-5 w-5" />
                        <span>Mon potager</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-[#9c27b0] font-medium">Collaboration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "team"}
                        onClick={() => setActiveTab("team")}
                        tooltip="Équipe"
                        className={`transition-all duration-200 ${
                          activeTab === "team"
                            ? "bg-gradient-to-r from-[#9c27b0] to-[#ba68c8] text-white shadow-md"
                            : "hover:bg-[#f9f0fc] hover:text-[#9c27b0]"
                        }`}
                      >
                        <Users className="h-5 w-5" />
                        <span>Équipe</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-[#2196f3] font-medium">Données & Tâches</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "sensors"}
                        onClick={() => setActiveTab("sensors")}
                        tooltip="Capteurs"
                        className={`transition-all duration-200 ${
                          activeTab === "sensors"
                            ? "bg-gradient-to-r from-[#2196f3] to-[#64b5f6] text-white shadow-md"
                            : "hover:bg-[#e3f2fd] hover:text-[#2196f3]"
                        }`}
                      >
                        <Activity className="h-5 w-5" />
                        <span>Capteurs</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "tasks"}
                        onClick={() => setActiveTab("tasks")}
                        tooltip="Tâches"
                        className={`transition-all duration-200 ${
                          activeTab === "tasks"
                            ? "bg-gradient-to-r from-[#ff9800] to-[#ffb74d] text-white shadow-md"
                            : "hover:bg-[#fff3e0] hover:text-[#ff9800]"
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Tâches</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-500 font-medium">Autres</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip="Calendrier"
                        className="hover:bg-[#e0e9d9] hover:text-[#2c5e1a] transition-all duration-200"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Calendrier</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip="Paramètres"
                        className="hover:bg-[#e0e9d9] hover:text-[#2c5e1a] transition-all duration-200"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Paramètres</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                <Avatar className="h-8 w-8 border-2 border-[#4a8f3c]">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sophie" />
                  <AvatarFallback>SO</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">Sophie</p>
                  <p className="text-xs text-muted-foreground truncate">Admin</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-[#f8faf5]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:justify-between">
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  activeTab === "overview"
                    ? "text-[#2c5e1a]"
                    : activeTab === "team"
                      ? "text-[#9c27b0]"
                      : activeTab === "sensors"
                        ? "text-[#2196f3]"
                        : activeTab === "tasks"
                          ? "text-[#ff9800]"
                          : "text-[#2c5e1a]"
                }`}
              >
                {activeTab === "overview"
                  ? "Tableau de bord"
                  : activeTab === "garden"
                    ? "Mon potager"
                    : activeTab === "team"
                      ? "Équipe"
                      : activeTab === "sensors"
                        ? "Capteurs"
                        : activeTab === "tasks"
                          ? "Tâches"
                          : "Tableau de bord"}
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Clock className="h-4 w-4 mr-1" />
                  Dernière mise à jour: il y a 5 min
                </Button>
                <Button
                  size="sm"
                  className={
                    activeTab === "overview"
                      ? "bg-[#4a8f3c] hover:bg-[#3a7e2c]"
                      : activeTab === "team"
                        ? "bg-[#9c27b0] hover:bg-[#7b1fa2]"
                        : activeTab === "sensors"
                          ? "bg-[#2196f3] hover:bg-[#1976d2]"
                          : activeTab === "tasks"
                            ? "bg-[#ff9800] hover:bg-[#f57c00]"
                            : "bg-[#4a8f3c] hover:bg-[#3a7e2c]"
                  }
                >
                  Actualiser
                </Button>
              </div>
            </div>

            {/* Tableau de bord */}
            {activeTab === "overview" && (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                {/* Graphiques et indicateurs - 2/3 de l'écran */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
                    <Card className="border-[#e0e9d9] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Humidité de l'air</CardTitle>
                        <Droplets className="h-4 w-4 text-[#4a8fd8]" />
                      </CardHeader>
                      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="text-xl sm:text-2xl font-bold">{sensorData.humidite !== null && `${sensorData.humidite}%`}</div>
                        <p className="text-xs text-muted-foreground">Optimal: 60-70%</p>
                        <Progress value={68} className="mt-1 sm:mt-2 bg-[#e0e9d9]" indicatorClassName="bg-[#4a8fd8]" />
                      </CardContent>
                    </Card>
                    <Card className="border-[#e0e9d9] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Humidité du sol</CardTitle>
                        <Activity className="h-4 w-4 text-[#d88c4a]" />
                      </CardHeader>
                      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="text-xl sm:text-2xl font-bold">{sensorData.valeur_eau !== null && `${Math.round((sensorData.valeur_eau / 65535) * 100)}%`}</div>
                        <p className="text-xs text-muted-foreground">Optimal: 6.0-7.0</p>
                        <Progress value={65} className="mt-1 sm:mt-2 bg-[#e0e9d9]" indicatorClassName="bg-[#d88c4a]" />
                      </CardContent>
                    </Card>
                    <Card className="border-[#e0e9d9] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Température</CardTitle>
                        <Thermometer className="h-4 w-4 text-[#d84a4a]" />
                      </CardHeader>
                      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="text-xl sm:text-2xl font-bold">{sensorData.temperature !== null && `${sensorData.temperature}°C`}</div>
                        <p className="text-xs text-muted-foreground">Optimal: 18-24°C</p>
                        <Progress value={75} className="mt-1 sm:mt-2 bg-[#e0e9d9]" indicatorClassName="bg-[#d84a4a]" />
                      </CardContent>
                    </Card>
                    <Card className="border-[#e0e9d9] bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Luminositer</CardTitle>
                        <Leaf className="h-4 w-4 text-[#4a8f3c]" />
                      </CardHeader>
                      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="text-xl sm:text-2xl font-bold">{sensorData.pourcentage_luminosite !== null && `${Math.round(sensorData.pourcentage_luminosite)}%`}</div>
                        <p className="text-xs text-muted-foreground">4 alertes mineures</p>
                        <Progress value={85} className="mt-1 sm:mt-2 bg-[#e0e9d9]" indicatorClassName="bg-[#4a8f3c]" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Graphique de pH */}
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg">Niveau d'acidité du sol</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Données des 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={luminosityHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[5.5, 7.0]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#d88c4a" strokeWidth={2} />
                            <Line type="monotone" dataKey="optimal" stroke="#82ca9d" strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Graphique d'humidité */}
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg">Évolution de l'humidité</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Données des 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={humidityHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4a8fd8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4a8fd8" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" />
                            <YAxis domain={[40, 80]} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#4a8fd8"
                              fillOpacity={1}
                              fill="url(#colorHumidity)"
                            />
                            <Line type="monotone" dataKey="optimal" stroke="#82ca9d" strokeDasharray="5 5" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Graphique de pH */}
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg">Niveau d'acidité du sol</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Données des 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={eauHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[5.5, 7.0]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#d88c4a" strokeWidth={2} />
                            <Line type="monotone" dataKey="optimal" stroke="#82ca9d" strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Graphique de température */}
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader className="pb-2 sm:pb-6">
                      <CardTitle className="text-base sm:text-lg">Évolution de la température</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Données des 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={temperatureHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              name="Température (°C)"
                              dataKey="value"
                              stroke="#d84a4a"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              name="Optimal"
                              dataKey="optimal"
                              stroke="#82ca9d"
                              strokeDasharray="5 5"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Activités récentes - 1/3 de l'écran */}
                <div className="md:col-span-1">
                  <Card className="border-[#e0e9d9] bg-white h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold">Activités récentes</CardTitle>
                      <CardDescription>Suivez les dernières actions effectuées par votre équipe</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] md:h-[calc(100vh-300px)] pr-4">
                        <div className="space-y-4">
                          {activityHistory.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-[#e0e9d9] last:border-0"
                            >
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs sm:text-sm font-medium">
                                    <span className="font-semibold">{activity.user.name}</span> {activity.action}
                                  </p>
                                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                                </div>
                                <Badge variant="outline" className="bg-[#f0f7eb]">
                                  {activity.zone}
                                </Badge>
                                <div className="flex items-center gap-2 sm:gap-4 pt-1">
                                  <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    <span className="text-xs">{activity.likes}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    <span className="text-xs">{activity.comments}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 ml-auto">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t border-[#e0e9d9] pt-4">
                      <div className="flex w-full gap-1 sm:gap-2">
                        <Input placeholder="Partagez une mise à jour..." className="flex-1" />
                        <Button className="bg-[#4a8f3c] hover:bg-[#3a7e2c]">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {/* Mon potager */}
            {activeTab === "garden" && (
              <div className="space-y-4">
                <Card className="border-[#e0e9d9] bg-white">
                  <CardHeader>
                    <CardTitle>Vue de mon potager</CardTitle>
                    <CardDescription>Représentation visuelle de vos zones de culture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] bg-[#e9f5e3] rounded-lg border border-[#c8e0b8] p-4">
                      {/* Zone 1 - Tomates, Basilic, Poivrons */}
                      <div className="absolute top-[5%] left-[5%] w-[40%] sm:w-[35%] md:w-[30%] h-[35%] bg-[#d4e8c9] rounded-md border border-[#b8d4a4] p-2">
                        <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-[#2c5e1a]">Zone 1</div>
                        <div className="flex flex-wrap gap-2">
                          {/* Tomates */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#e94e4e] rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#f06060] rounded-full"></div>
                            </div>
                            <div className="w-1 h-8 bg-[#4a8f3c]"></div>
                            <div className="text-xs">Tomate</div>
                          </div>
                          {/* Basilic */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-[#4a8f3c] rounded-md flex flex-col items-center justify-center">
                              <div className="w-8 h-1 bg-[#3a7e2c] mb-1"></div>
                              <div className="w-8 h-1 bg-[#3a7e2c] mb-1"></div>
                              <div className="w-8 h-1 bg-[#3a7e2c]"></div>
                            </div>
                            <div className="text-xs">Basilic</div>
                          </div>
                          {/* Poivrons */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-12 bg-[#e9a64e] rounded-b-full flex items-center justify-center">
                              <div className="w-8 h-10 bg-[#f0b060] rounded-b-full"></div>
                            </div>
                            <div className="w-1 h-4 bg-[#4a8f3c]"></div>
                            <div className="text-xs">Poivron</div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center">
                          <Droplets className="h-4 w-4 text-[#4a8fd8] mr-1" />
                          <span className="text-xs font-medium text-[#4a8f3c]">72%</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-[#9c27b0] hover:bg-[#7b1fa2]">Thomas</Badge>
                        </div>
                      </div>

                      {/* Zone 2 - Carottes, Radis, Laitue */}
                      <div className="absolute top-[5%] right-[5%] w-[40%] sm:w-[35%] md:w-[30%] h-[35%] bg-[#d4e8c9] rounded-md border border-[#b8d4a4] p-2">
                        <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-[#2c5e1a]">Zone 2</div>
                        <div className="flex flex-wrap gap-2">
                          {/* Carottes */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-6 bg-[#4a8f3c] rounded-t-md"></div>
                            <div className="w-4 h-10 bg-[#e9824e] rounded-b-md"></div>
                            <div className="text-xs">Carotte</div>
                          </div>
                          {/* Radis */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-4 bg-[#4a8f3c] rounded-t-md"></div>
                            <div className="w-8 h-8 bg-[#e94e4e] rounded-full"></div>
                            <div className="text-xs">Radis</div>
                          </div>
                          {/* Laitue */}
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-8 bg-[#a4d476] rounded-full flex flex-col items-center justify-center">
                              <div className="w-10 h-6 bg-[#b8e08a] rounded-full"></div>
                            </div>
                            <div className="text-xs">Laitue</div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center">
                          <Droplets className="h-4 w-4 text-[#4a8fd8] mr-1" />
                          <span className="text-xs font-medium text-[#4a8f3c]">65%</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-[#ff9800] hover:bg-[#f57c00]">Sophie</Badge>
                        </div>
                      </div>

                      {/* Zone 3 - Courgettes, Concombres */}
                      <div className="absolute bottom-[5%] left-[20%] sm:left-[25%] md:left-[30%] w-[60%] sm:w-[50%] md:w-[40%] h-[30%] bg-[#d4e8c9] rounded-md border border-[#b8d4a4] p-2">
                        <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-[#2c5e1a]">Zone 3</div>
                        <div className="flex flex-wrap gap-4">
                          {/* Courgettes */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-8 bg-[#4a8f3c] rounded-t-md"></div>
                            <div className="w-10 h-14 bg-[#a4d476] rounded-md"></div>
                            <div className="text-xs">Courgette</div>
                          </div>
                          {/* Concombres */}
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-8 bg-[#4a8f3c] rounded-t-md"></div>
                            <div className="w-6 h-14 bg-[#7abe4e] rounded-md"></div>
                            <div className="text-xs">Concombre</div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center">
                          <Droplets className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-xs font-medium text-amber-500">58%</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-[#2196f3] hover:bg-[#1976d2]">Léa</Badge>
                        </div>
                      </div>

                      {/* Légende */}
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-white/80 p-1 sm:p-2 rounded-md text-[10px] sm:text-xs">
                        <div className="font-semibold mb-1">Légende:</div>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-[#4a8f3c] rounded-full"></div>
                          <span>Optimal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span>Attention requise</span>
                        </div>
                      </div>

                      {/* Badges des membres */}
                      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-white/80 p-1 sm:p-2 rounded-md text-[10px] sm:text-xs">
                        <div className="font-semibold mb-1">Responsables:</div>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-[#9c27b0] hover:bg-[#7b1fa2] mb-1">Thomas - Zone 1</Badge>
                          <Badge className="bg-[#ff9800] hover:bg-[#f57c00] mb-1">Sophie - Zone 2</Badge>
                          <Badge className="bg-[#2196f3] hover:bg-[#1976d2]">Léa - Zone 3</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader>
                      <CardTitle>Statistiques de croissance</CardTitle>
                      <CardDescription>Évolution de vos cultures</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={[
                              { name: "Tomates", croissance: 85 },
                              { name: "Basilic", croissance: 95 },
                              { name: "Poivrons", croissance: 70 },
                              { name: "Carottes", croissance: 60 },
                              { name: "Radis", croissance: 90 },
                              { name: "Laitue", croissance: 75 },
                              { name: "Courgettes", croissance: 65 },
                              { name: "Concombres", croissance: 55 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="croissance" name="Croissance (%)" fill="#4a8f3c" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-[#e0e9d9] bg-white">
                    <CardHeader>
                      <CardTitle>Prévisions météo</CardTitle>
                      <CardDescription>Pour les 5 prochains jours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">Lun</div>
                          <div className="text-[#4a8fd8] text-2xl">☀️</div>
                          <div className="text-xs">24°C</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">Mar</div>
                          <div className="text-[#4a8fd8] text-2xl">⛅</div>
                          <div className="text-xs">22°C</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">Mer</div>
                          <div className="text-[#4a8fd8] text-2xl">🌧️</div>
                          <div className="text-xs">19°C</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">Jeu</div>
                          <div className="text-[#4a8fd8] text-2xl">🌧️</div>
                          <div className="text-xs">18°C</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">Ven</div>
                          <div className="text-[#4a8fd8] text-2xl">⛅</div>
                          <div className="text-xs">21°C</div>
                        </div>
                      </div>
                      <div className="mt-4 p-2 bg-[#e0f2ff] rounded-md text-sm">
                        <p className="font-medium text-[#4a8fd8]">Conseil:</p>
                        <p className="text-xs">
                          Prévoyez d'arroser moins mercredi et jeudi en raison des précipitations prévues.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Équipe */}
            {activeTab === "team" && (
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card className="border-[#f0e0f5] bg-white">
                    <CardHeader>
                      <CardTitle>Membres de l'équipe</CardTitle>
                      <CardDescription>Collaborez avec votre équipe pour entretenir votre potager</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center gap-4 p-2 rounded-lg border border-[#f0e0f5]">
                            <Avatar className="h-10 w-10 border-2 border-[#9c27b0]">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                            <Badge
                              variant={member.status === "En ligne" ? "default" : "outline"}
                              className={member.status === "En ligne" ? "bg-[#4caf50]" : ""}
                            >
                              {member.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#9c27b0] hover:bg-[#7b1fa2]">
                        <Users className="h-4 w-4 mr-2" />
                        Inviter un membre
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="border-[#f0e0f5] bg-white">
                    <CardHeader>
                      <CardTitle>Discussion d'équipe</CardTitle>
                      <CardDescription>Échangez avec votre équipe sur l'entretien du potager</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[250px] sm:h-[300px] w-full pr-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="flex gap-4">
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src={message.user.avatar} alt={message.user.name} />
                                <AvatarFallback>{message.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{message.user.name}</span>
                                  <span className="text-xs text-muted-foreground">{message.time}</span>
                                </div>
                                <p className="text-sm bg-[#f9f0fc] p-2 rounded-md">{message.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t border-[#f0e0f5] pt-4">
                      <div className="flex w-full gap-1 sm:gap-2">
                        <Textarea placeholder="Écrivez votre message..." className="flex-1 min-h-[60px]" />
                        <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2]">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
                <Card className="border-[#f0e0f5] bg-white">
                  <CardHeader>
                    <CardTitle>Répartition des tâches</CardTitle>
                    <CardDescription>Assignez des tâches aux membres de votre équipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-2 p-4 border border-[#f0e0f5] rounded-lg">
                        <div className="font-medium text-[#9c27b0]">Sophie</div>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#4caf50]" />
                            <span className="text-sm">Arroser la Zone 2</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#ff9800]" />
                            <span className="text-sm">Planter des radis</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 p-4 border border-[#f0e0f5] rounded-lg">
                        <div className="font-medium text-[#9c27b0]">Thomas</div>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#4caf50]" />
                            <span className="text-sm">Récolter les tomates</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#ff9800]" />
                            <span className="text-sm">Tuteurer les plants</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 p-4 border border-[#f0e0f5] rounded-lg">
                        <div className="font-medium text-[#9c27b0]">Léa</div>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#4caf50]" />
                            <span className="text-sm">Arroser la Zone 3</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-[#f9f0fc] rounded-md">
                            <CheckCircle2 className="h-4 w-4 text-[#ff9800]" />
                            <span className="text-sm">Apporter des tuteurs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#9c27b0] hover:bg-[#7b1fa2]">Assigner une nouvelle tâche</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Capteurs */}
            {activeTab === "sensors" && (
              <div className="space-y-4">
                <Card className="border-[#e0f2ff] bg-white">
                  <CardHeader>
                    <CardTitle>Capteurs actifs</CardTitle>
                    <CardDescription>Vue d'ensemble de tous les capteurs installés dans votre potager</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2ff]">
                            <Droplets className="h-6 w-6 text-[#2196f3]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur d'humidité #1</h3>
                            <p className="text-xs text-muted-foreground">Zone 1 - Tomates</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">72%</span>
                              <span className="text-xs text-[#4a8f3c]">Optimal</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2ff]">
                            <Droplets className="h-6 w-6 text-[#2196f3]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur d'humidité #2</h3>
                            <p className="text-xs text-muted-foreground">Zone 2 - Carottes</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">65%</span>
                              <span className="text-xs text-[#4a8f3c]">Optimal</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2ff]">
                            <Droplets className="h-6 w-6 text-[#2196f3]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur d'humidité #3</h3>
                            <p className="text-xs text-muted-foreground">Zone 3 - Courgettes</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">58%</span>
                              <span className="text-xs text-amber-500">Faible</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2e0]">
                            <Activity className="h-6 w-6 text-[#ff9800]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur de pH #1</h3>
                            <p className="text-xs text-muted-foreground">Zone 1 - Tomates</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">6.8</span>
                              <span className="text-xs text-[#4a8f3c]">Optimal</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2e0]">
                            <Activity className="h-6 w-6 text-[#ff9800]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur de pH #2</h3>
                            <p className="text-xs text-muted-foreground">Zone 2 - Carottes</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">6.2</span>
                              <span className="text-xs text-[#4a8f3c]">Optimal</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg border border-[#e0f2ff] p-4 bg-white">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2e0]">
                            <Activity className="h-6 w-6 text-[#ff9800]" />
                          </div>
                          <div className="grid gap-1">
                            <h3 className="text-sm font-medium">Capteur de pH #3</h3>
                            <p className="text-xs text-muted-foreground">Zone 3 - Courgettes</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">6.5</span>
                              <span className="text-xs text-[#4a8f3c]">Optimal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#e0f2ff] bg-white">
                  <CardHeader>
                    <CardTitle>Historique des mesures</CardTitle>
                    <CardDescription>Évolution des données sur les 7 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] sm:h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={temperatureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            name="Température (°C)"
                            dataKey="value"
                            stroke="#d84a4a"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            name="Optimal"
                            dataKey="optimal"
                            stroke="#82ca9d"
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tâches */}
            {activeTab === "tasks" && (
              <div className="space-y-4">
                <Card className="border-[#fff2e0] bg-white">
                  <CardHeader>
                    <CardTitle>Tâches à effectuer</CardTitle>
                    <CardDescription>Basées sur les données des capteurs et le calendrier de culture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-lg border border-amber-200 p-4 bg-amber-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                          <Droplets className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <h3 className="text-sm font-medium">Arroser la Zone 3</h3>
                          <p className="text-xs text-muted-foreground">Humidité faible (58%)</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-1 sm:mr-2 text-xs">
                              Priorité haute
                            </Badge>
                            <Badge className="bg-[#2196f3] text-xs">
                              <span className="hidden sm:inline">Assigné à </span>
                              Léa
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="ml-auto bg-[#ff9800] hover:bg-[#f57c00] text-xs sm:text-sm whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Marquer comme fait</span>
                          <span className="sm:hidden">Fait</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border border-[#fff2e0] p-4 bg-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Sprout className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <h3 className="text-sm font-medium">Récolter les tomates mûres</h3>
                          <p className="text-xs text-muted-foreground">Zone 1</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-1 sm:mr-2 text-xs">
                              Priorité moyenne
                            </Badge>
                            <Badge className="bg-[#9c27b0] text-xs">
                              <span className="hidden sm:inline">Assigné à </span>
                              Thomas
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto text-xs sm:text-sm whitespace-nowrap">
                          <span className="hidden sm:inline">Marquer comme fait</span>
                          <span className="sm:hidden">Fait</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border border-[#fff2e0] p-4 bg-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Sprout className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <h3 className="text-sm font-medium">Tailler les plants de tomates</h3>
                          <p className="text-xs text-muted-foreground">Zone 1</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-1 sm:mr-2 text-xs">
                              Priorité basse
                            </Badge>
                            <Badge className="bg-[#9c27b0] text-xs">
                              <span className="hidden sm:inline">Assigné à </span>
                              Thomas
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto text-xs sm:text-sm whitespace-nowrap">
                          <span className="hidden sm:inline">Marquer comme fait</span>
                          <span className="sm:hidden">Fait</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-[#ff9800] hover:bg-[#f57c00]">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Ajouter une tâche
                    </Button>
                  </CardFooter>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-[#fff2e0] bg-white">
                    <CardHeader>
                      <CardTitle>Tâches terminées</CardTitle>
                      <CardDescription>Historique des tâches récemment accomplies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[250px] sm:h-[300px] w-full pr-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 rounded-lg border border-[#e0e9d9] p-4 bg-[#f8faf5]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e9d9]">
                              <CheckCircle2 className="h-5 w-5 text-[#4a8f3c]" />
                            </div>
                            <div className="grid gap-1 flex-1">
                              <h3 className="text-sm font-medium">Arrosage de la Zone 2</h3>
                              <p className="text-xs text-muted-foreground">Terminé par Sophie - Hier, 18:30</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-lg border border-[#e0e9d9] p-4 bg-[#f8faf5]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e9d9]">
                              <CheckCircle2 className="h-5 w-5 text-[#4a8f3c]" />
                            </div>
                            <div className="grid gap-1 flex-1">
                              <h3 className="text-sm font-medium">Récolte de 2kg de tomates</h3>
                              <p className="text-xs text-muted-foreground">Terminé par Thomas - Hier, 15:45</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-lg border border-[#e0e9d9] p-4 bg-[#f8faf5]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e9d9]">
                              <CheckCircle2 className="h-5 w-5 text-[#4a8f3c]" />
                            </div>
                            <div className="grid gap-1 flex-1">
                              <h3 className="text-sm font-medium">Ajout d'engrais naturel</h3>
                              <p className="text-xs text-muted-foreground">Terminé par Léa - Il y a 2 jours</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-lg border border-[#e0e9d9] p-4 bg-[#f8faf5]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e9d9]">
                              <CheckCircle2 className="h-5 w-5 text-[#4a8f3c]" />
                            </div>
                            <div className="grid gap-1 flex-1">
                              <h3 className="text-sm font-medium">Plantation de radis</h3>
                              <p className="text-xs text-muted-foreground">Terminé par Sophie - Il y a 2 jours</p>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card className="border-[#fff2e0] bg-white">
                    <CardHeader>
                      <CardTitle>Calendrier des tâches</CardTitle>
                      <CardDescription>Planification des tâches à venir</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-2 bg-[#f8faf5] rounded-md">
                          <div className="font-medium text-[#ff9800] mb-2">Aujourd'hui</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#fff2e0]">
                              <Droplets className="h-4 w-4 text-[#2196f3]" />
                              <span className="text-sm flex-1">Arroser la Zone 3</span>
                              <Badge className="bg-[#2196f3]">Léa</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-[#f8faf5] rounded-md">
                          <div className="font-medium text-[#ff9800] mb-2">Demain</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#fff2e0]">
                              <Sprout className="h-4 w-4 text-[#4a8f3c]" />
                              <span className="text-sm flex-1">Récolter les tomates</span>
                              <Badge className="bg-[#9c27b0]">Thomas</Badge>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#fff2e0]">
                              <Sprout className="h-4 w-4 text-[#4a8f3c]" />
                              <span className="text-sm flex-1">Tuteurer les plants</span>
                              <Badge className="bg-[#9c27b0]">Thomas</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-[#f8faf5] rounded-md">
                          <div className="font-medium text-[#ff9800] mb-2">Cette semaine</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#fff2e0]">
                              <Sprout className="h-4 w-4 text-[#4a8f3c]" />
                              <span className="text-sm flex-1">Planter de nouvelles graines</span>
                              <Badge className="bg-[#ff9800]">Sophie</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}