'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Download,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Users,
  Calendar,
  Tag,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  RotateCcw,
  Repeat,
  Youtube,
  Zap,
  MessageCircle,
  Heart,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  description: string
  youtube_id: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  dislikes: number
  published_at: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
    subscribers: number
  }
  chapters?: {
    time: number
    title: string
    description: string
  }[]
}

interface Playlist {
  id: string
  title: string
  description: string
  videos: Video[]
  thumbnail: string
  author: string
  created_at: string
}

interface InteractiveVideoPlayerProps {
  video: Video
  playlist?: Playlist
  autoplay?: boolean
  showPlaylist?: boolean
  showChapters?: boolean
  showRelated?: boolean
  enableSharing?: boolean
  relatedVideos?: Video[]
}

export default function InteractiveVideoPlayer({
  video,
  playlist,
  autoplay = false,
  showPlaylist = true,
  showChapters = true,
  showRelated = true,
  enableSharing = true,
  relatedVideos = []
}: InteractiveVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(video.duration)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState('720p')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [bufferedTime, setBufferedTime] = useState(0)
  
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const currentPlaylist = playlist?.videos || [video]
  const currentVideo = currentPlaylist[currentVideoIndex] || video

  useEffect(() => {
    if (autoplay) {
      setIsPlaying(true)
    }
  }, [autoplay])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      
      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'm':
        case 'M':
          toggleMute()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skipBackward()
          break
        case 'ArrowRight':
          e.preventDefault()
          skipForward()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(100, prev + 10))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(0, prev - 10))
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10))
  }

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 10))
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate)
    setIsSettingsOpen(false)
  }

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality)
    setIsSettingsOpen(false)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
    toast({
      title: isLiked ? "Like removido" : "Vídeo curtido",
      description: isLiked ? "Sua reação foi removida." : "Obrigado pela sua reação!",
    })
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removido dos salvos" : "Vídeo salvo",
      description: isSaved ? "Vídeo removido da sua lista." : "Vídeo adicionado à sua lista.",
    })
  }

  const handleShare = (platform?: string, timestamp?: number) => {
    const baseUrl = currentVideo.youtube_id 
      ? `https://www.youtube.com/watch?v=${currentVideo.youtube_id}`
      : window.location.href
    
    const url = timestamp ? `${baseUrl}&t=${timestamp}s` : baseUrl
    const title = encodeURIComponent(currentVideo.title)
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copiado",
          description: timestamp ? "Link com timestamp copiado." : "Link copiado para a área de transferência.",
        })
        break
      default:
        if (navigator.share) {
          navigator.share({
            title: currentVideo.title,
            url: url
          })
        } else {
          navigator.clipboard.writeText(url)
          toast({
            title: "Link copiado",
            description: "Link copiado para a área de transferência.",
          })
        }
    }
    setIsShareOpen(false)
  }

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const playNext = () => {
    if (currentVideoIndex < currentPlaylist.length - 1) {
      handleVideoSelect(currentVideoIndex + 1)
    }
  }

  const playPrevious = () => {
    if (currentVideoIndex > 0) {
      handleVideoSelect(currentVideoIndex - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div
              ref={playerRef}
              className="relative aspect-video bg-black group"
              onMouseMove={handleMouseMove}
            >
              {/* YouTube Embed or Video Element */}
              {currentVideo.youtube_id ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=${autoplay ? 1 : 0}&controls=0&rel=0&modestbranding=1&playsinline=1`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Youtube className="h-16 w-16 mx-auto mb-4" />
                    <p>Vídeo não disponível</p>
                  </div>
                </div>
              )}

              {/* Video Controls Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0"
              )}>
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      AO VIVO
                    </Badge>
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {quality}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSettingsOpen(true)}
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20 h-16 w-16 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  {/* Progress Bar */}
                  <div className="relative">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <div 
                      className="absolute top-0 left-0 h-1 bg-white/30 rounded-full"
                      style={{ width: `${(bufferedTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playPrevious}
                        disabled={currentVideoIndex === 0}
                        className="text-white hover:bg-white/20 disabled:opacity-50"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipBackward}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipForward}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playNext}
                        disabled={currentVideoIndex === currentPlaylist.length - 1}
                        className="text-white hover:bg-white/20 disabled:opacity-50"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        
                        <div className="w-20">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentVideo.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViews(currentVideo.views)} visualizações</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(currentVideo.published_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Video Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={cn(
                        "gap-2",
                        isLiked ? "bg-blue-50 text-blue-600 border-blue-200" : ""
                      )}
                    >
                      <ThumbsUp className={cn("h-4 w-4", isLiked ? "fill-current" : "")} />
                      {currentVideo.likes + (isLiked ? 1 : 0)}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDislike}
                      className={cn(
                        "gap-2",
                        isDisliked ? "bg-red-50 text-red-600 border-red-200" : ""
                      )}
                    >
                      <ThumbsDown className={cn("h-4 w-4", isDisliked ? "fill-current" : "")} />
                      {currentVideo.dislikes + (isDisliked ? 1 : 0)}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className={cn(
                        "gap-2",
                        isSaved ? "bg-yellow-50 text-yellow-600 border-yellow-200" : ""
                      )}
                    >
                      {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      {isSaved ? "Salvo" : "Salvar"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Share2 className="h-4 w-4" />
                          Compartilhar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Compartilhar vídeo</div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('facebook')}
                              className="justify-start"
                            >
                              <Facebook className="h-4 w-4 mr-2" />
                              Facebook
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('twitter')}
                              className="justify-start"
                            >
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('linkedin')}
                              className="justify-start"
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('copy')}
                              className="justify-start"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar link
                            </Button>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="text-sm text-gray-600 mb-2">Compartilhar com timestamp atual:</div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('copy', currentTime)}
                              className="w-full justify-start"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Copiar link em {formatTime(currentTime)}
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Link href={`https://www.youtube.com/watch?v=${currentVideo.youtube_id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Ver no YouTube
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Video Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{currentVideo.description}</p>
                  
                  {/* Tags */}
                  {currentVideo.tags && currentVideo.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {currentVideo.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Playlist */}
          {showPlaylist && playlist && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <List className="h-5 w-5" />
                  {playlist.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{playlist.description}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {playlist.videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(index)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      index === currentVideoIndex ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{formatTime(video.duration)}</span>
                          <span>•</span>
                          <span>{formatViews(video.views)} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related Videos */}
          {showRelated && relatedVideos.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vídeos relacionados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedVideos.slice(0, 5).map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}`}>
                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{formatViews(video.views)} views</span>
                          <span>•</span>
                          <span>{formatDate(video.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Chapters */}
          {showChapters && currentVideo.chapters && currentVideo.chapters.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Capítulos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentVideo.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentTime(chapter.time)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      currentTime >= chapter.time && 
                      (index === currentVideo.chapters!.length - 1 || currentTime < currentVideo.chapters![index + 1].time)
                        ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xs font-mono text-gray-500 mt-1">
                        {formatTime(chapter.time)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{chapter.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{chapter.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurações do Player</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Velocidade de reprodução</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <Button
                    key={rate}
                    variant={playbackRate === rate ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlaybackRateChange(rate)}
                  >
                    {rate}x
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Qualidade</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['360p', '480p', '720p', '1080p'].map((q) => (
                  <Button
                    key={q}
                    variant={quality === q ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQualityChange(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Hook para carregar dados de vídeo
export function useVideoData(videoId: string) {
  const [video, setVideo] = useState<Video | null>(null)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVideoData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockVideo: Video = {
        id: videoId,
        title: 'Novas Regras do CONTRAN para Patinetes Elétricos 2024',
        description: 'Entenda todas as mudanças na regulamentação dos patinetes elétricos aprovadas pelo CONTRAN. Limites de velocidade, equipamentos obrigatórios e multas.',
        youtube_id: 'dQw4w9WgXcQ',
        thumbnail: '/images/video-placeholder.jpg',
        duration: 840,
        views: 12540,
        likes: 892,
        dislikes: 23,
        published_at: new Date().toISOString(),
        category: 'regulation',
        tags: ['CONTRAN', 'patinetes', 'regulamentação', 'mobilidade urbana'],
        author: {
          name: 'Autopropelidos Brasil',
          avatar: '/images/placeholder-user.jpg',
          subscribers: 45000
        },
        chapters: [
          { time: 0, title: 'Introdução', description: 'Apresentação do tema' },
          { time: 120, title: 'Novas Regras', description: 'Detalhes das mudanças' },
          { time: 380, title: 'Equipamentos', description: 'Equipamentos obrigatórios' },
          { time: 620, title: 'Multas', description: 'Valores e aplicação' },
          { time: 760, title: 'Conclusão', description: 'Considerações finais' }
        ]
      }
      
      setVideo(mockVideo)
      setLoading(false)
    }

    loadVideoData()
  }, [videoId])

  return { video, playlist, relatedVideos, loading }
}