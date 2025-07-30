import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Charger les tâches programmées
async function loadScheduledTasks() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'scheduled-tasks.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { tasks: [] }
  }
}

// Sauvegarder les tâches
async function saveScheduledTasks(data) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'scheduled-tasks.json')
  
  await mkdir(dirPath, { recursive: true })
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// GET - Récupérer toutes les tâches
export async function GET() {
  try {
    const data = await loadScheduledTasks()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une nouvelle tâche
export async function POST(request) {
  try {
    const body = await request.json()
    const data = await loadScheduledTasks()
    
    const newTask = {
      id: Date.now().toString(),
      type: body.type || 'email',
      scheduledFor: body.scheduledFor,
      status: 'pending',
      createdAt: new Date().toISOString(),
      data: body.data
    }
    
    data.tasks.push(newTask)
    await saveScheduledTasks(data)
    
    return NextResponse.json({ success: true, task: newTask })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une tâche
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body
    
    const data = await loadScheduledTasks()
    data.tasks = data.tasks.filter(task => task.id !== id)
    
    await saveScheduledTasks(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}