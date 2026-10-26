import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

const USERS = ["Ibu", "Avwan", "Dayat", "Habsyi"]

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('chat_user') || null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const fileRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    let active = true
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, username, text, created_at')
          .order('created_at', { ascending: true })
        if (!active) return
        if (error) return
        setMessages(data || [])
      } catch (e) {}
    }
    fetch()
    const id = setInterval(fetch, 1000)
    return () => { active = false; clearInterval(id) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 p-6">
        <h1 className="text-2xl font-bold text-white mb-8">Pilih Identitas</h1>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {USERS.map((u) => (
            <button
              key={u}
              onClick={() => {
                localStorage.setItem('chat_user', u)
                setUser(u)
              }}
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xl font-semibold py-6 rounded-none shadow-none active:bg-neutral-600"
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const sendText = async () => {
    const text = input.trim()
    if (!text) return
    try {
      await supabase.from('messages').insert({ username: user, text })
      setInput('')
    } catch (e) {}
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const path = file.name
      const { error: upErr } = await supabase.storage.from('chat-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
      if (upErr) return
      const { data } = supabase.storage.from('chat-media').getPublicUrl(path)
      if (data?.publicUrl) {
        await supabase.from('messages').insert({ username: user, text: data.publicUrl })
      }
    } catch (e) {}
    if (fileRef.current) fileRef.current.value = ''
  }

  const isImage = (t) => /(\.jpg|\.jpeg|\.png|\.gif)$/i.test(t)
  const isVideo = (t) => /(\.mp4|\.webm)$/i.test(t)

  return (
    <div className="h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 shrink-0">
        <div className="font-bold text-base">Chat Kelompok</div>
        <div className="text-xs text-neutral-400">{user}</div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id || Math.random()} className="text-sm leading-snug">
            <span className="font-semibold text-neutral-300">{m.username}:</span>{" "}
            <span className="text-neutral-100 break-words">{m.text}</span>
            {isImage(m.text) && (
              <div className="mt-1"><img src={m.text} alt="media" className="max-w-[150px] h-auto border border-neutral-700 bg-neutral-900" loading="lazy" /></div>
            )}
            {isVideo(m.text) && (
              <div className="mt-1"><video src={m.text} controls className="max-w-[150px] h-auto bg-neutral-900 border border-neutral-700" preload="none" /></div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className="bg-neutral-900 border-t border-neutral-800 p-2 flex gap-2 shrink-0">
        <label className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-bold px-3 py-2 rounded-none cursor-pointer select-none" title="Upload file">
          + File
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendText()}
          placeholder="Ketik pesan..."
          className="flex-1 bg-neutral-800 text-white border border-neutral-600 px-3 py-2 text-sm rounded-none outline-none focus:border-neutral-400"
        />
        <button onClick={sendText} className="bg-neutral-200 text-black font-bold px-4 py-2 text-sm rounded-none hover:bg-white">Kirim</button>
      </footer>
    </div>
  )
}
