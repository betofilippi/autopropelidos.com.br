import { Suspense } from "react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"

function SearchResults() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            </Link>
            <h1 className="text-2xl font-bold">Buscar</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Busca temporariamente desabilitada</h3>
          <p className="text-gray-600">
            Esta funcionalidade está sendo atualizada. Volte em breve.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}