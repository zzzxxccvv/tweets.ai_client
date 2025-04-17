import { marked } from 'marked'
import { useState } from 'react'
const renderer = new marked.Renderer()

renderer.link = function ({ href, title, text }) {
  const link = `<a class="break-words" href="${href}" target="_blank"${title ? ` title="${title}"` : ''}>${text}</a>`
  return link
}

marked.setOptions({
  renderer: renderer
})

export default function Markdown() {
  const [content, setContent] = useState('')
  const html = marked.parse(content)

  return (
    <div className='flex w-full'>
      <div className='flex-1 w-1/2 p-4 bg-gray-50'>
        <textarea className='w-full h-screen bg-gray-50' value={content} onChange={e => setContent(e.target.value)}></textarea>
      </div>
      <div className='flex-1 prose md:prose-lg w-full h-screen p-4' dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}
