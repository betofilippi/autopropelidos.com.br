"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { DialogProps } from "@radix-ui/react-dialog"
import {
  Search,
  FileText,
  Calculator,
  BookOpen,
  HelpCircle,
  Scale,
  Newspaper,
  PlayCircle,
  Clock,
  X,
} from "lucide-react"
import { searchContent, SearchResult, getRecentSearches, addRecentSearch, clearRecentSearches } from "@/lib/services/search"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchModalProps extends DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const iconMap = {
  page: FileText,
  tool: Calculator,
  glossary: BookOpen,
  faq: HelpCircle,
  regulation: Scale,
  news: Newspaper,
  video: PlayCircle,
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [open])

  // Search with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim()) {
        setIsSearching(true)
        const searchResults = await searchContent(search)
        setResults(searchResults)
        setIsSearching(false)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      // Add to recent searches
      addRecentSearch(result.title)
      
      // Navigate to the result
      router.push(result.url)
      
      // Close the modal
      onOpenChange?.(false)
      
      // Reset search
      setSearch("")
    },
    [router, onOpenChange]
  )

  const handleViewAllResults = useCallback(() => {
    if (search.trim()) {
      router.push(`/busca?q=${encodeURIComponent(search)}`)
      onOpenChange?.(false)
      setSearch("")
    }
  }, [search, router, onOpenChange])

  const handleRecentSearch = useCallback(
    (term: string) => {
      setSearch(term)
    },
    []
  )

  const handleClearRecent = useCallback(() => {
    clearRecentSearches()
    setRecentSearches([])
  }, [])

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  const typeLabels = {
    page: "Páginas",
    tool: "Ferramentas",
    glossary: "Glossário",
    faq: "Perguntas Frequentes",
    regulation: "Regulamentações",
    news: "Notícias",
    video: "Vídeos",
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Buscar por ferramentas, termos, perguntas..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {!search && recentSearches.length > 0 && (
          <>
            <CommandGroup>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs text-muted-foreground">Buscas recentes</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearRecent}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </Button>
              </div>
              {recentSearches.map((term) => (
                <CommandItem
                  key={term}
                  onSelect={() => handleRecentSearch(term)}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{term}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {search && !isSearching && results.length === 0 && (
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        )}

        {search && isSearching && (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-muted-foreground">Buscando...</div>
          </div>
        )}

        {Object.entries(groupedResults).map(([type, items]) => {
          const Icon = iconMap[type as keyof typeof iconMap]
          const label = typeLabels[type as keyof typeof typeLabels]

          return (
            <CommandGroup key={type} heading={label}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-start gap-3 py-3"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="font-medium leading-none">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </div>
                    )}
                    {item.category && (
                      <div className="text-xs text-muted-foreground">
                        {item.category}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
        
        {search && !isSearching && results.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={handleViewAllResults}
                className="flex items-center justify-center gap-2 py-3 text-primary"
              >
                <Search className="h-4 w-4" />
                <span className="font-medium">Ver todos os resultados</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}