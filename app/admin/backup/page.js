'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Backup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [backups, setBackups] = useState([])
  const [exportStatus, setExportStatus] = useState({})
  const [selectedModules, setSelectedModules] = useState({
    clients: true,
    sites: true,
    facturation: true,
    depenses: true,
    outils: true,
    agenda: true,
    parametres: true
  })

  const modules = [
    { id: 'clients', nom: 'Fiches Clients', icon: '👥', fichier: 'clients.json' },
    { id: 'sites', nom: 'Sites en Gestion', icon: '🌐', fichier: 'sites.json' },
    { id: 'facturation', nom: 'Facturation', icon: '📄', fichier: 'facturation.json' },
    { id: 'depenses', nom: 'Dépenses', icon: '💸', fichier: 'depenses.json' },
    { id: 'outils', nom: 'Outils Web', icon: '🔧', fichier: 'outils.json' },
    { id: 'agenda', nom: 'Agenda & Projets', icon: '📅', fichier: 'agenda.json' },
    { id: 'parametres', nom: 'Paramètres', icon: '⚙️', fichier: 'parametres.json' }
  ]

  useEffect(() => {
    loadBackupHistory()
  }, [])

  const loadBackupHistory = () => {
    // Charger l'historique des backups depuis localStorage
    const history = JSON.parse(localStorage.getItem('backupHistory') || '[]')
    setBackups(history)
  }

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedModules).every(v => v)
    const newSelection = {}
    modules.forEach(m => {
      newSelection[m.id] = !allSelected
    })
    setSelectedModules(newSelection)
  }

  const exportModule = async (moduleId) => {
    try {
      let endpoint = ''
      switch(moduleId) {
        case 'clients': endpoint = '/api/admin/crm'; break
        case 'sites': endpoint = '/api/admin/sites'; break
        case 'facturation': endpoint = '/api/admin/facturation'; break
        case 'depenses': endpoint = '/api/admin/depenses'; break
        case 'outils': endpoint = '/api/admin/outils'; break
        case 'agenda': endpoint = '/api/admin/agenda'; break
        case 'parametres': endpoint = '/api/admin/parametres'; break
      }

      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Erreur lors de la récupération')
      
      const data = await response.json()
      return { moduleId, data, success: true }
    } catch (error) {
      console.error(`Erreur export ${moduleId}:`, error)
      return { moduleId, error: error.message, success: false }
    }
  }

  const handleExportSelected = async () => {
    setLoading(true)
    setExportStatus({})

    const selectedModuleIds = Object.entries(selectedModules)
      .filter(([_, selected]) => selected)
      .map(([id]) => id)

    if (selectedModuleIds.length === 0) {
      alert('Veuillez sélectionner au moins un module')
      setLoading(false)
      return
    }

    // Exporter tous les modules sélectionnés
    const exports = await Promise.all(
      selectedModuleIds.map(id => exportModule(id))
    )

    // Créer l'objet de sauvegarde
    const backup = {
      date: new Date().toISOString(),
      version: '1.0',
      modules: {}
    }

    let hasErrors = false
    exports.forEach(result => {
      if (result.success) {
        backup.modules[result.moduleId] = result.data
        setExportStatus(prev => ({ ...prev, [result.moduleId]: 'success' }))
      } else {
        hasErrors = true
        setExportStatus(prev => ({ ...prev, [result.moduleId]: 'error' }))
      }
    })

    if (!hasErrors) {
      // Télécharger le fichier
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      // Sauvegarder dans l'historique
      const newBackup = {
        id: Date.now().toString(),
        date: backup.date,
        modules: selectedModuleIds,
        taille: blob.size
      }
      const history = [...backups, newBackup].slice(-10) // Garder les 10 derniers
      localStorage.setItem('backupHistory', JSON.stringify(history))
      setBackups(history)

      // Message de succès
      setTimeout(() => {
        alert('Export réussi ! Le fichier a été téléchargé.')
        setExportStatus({})
      }, 1000)
    }

    setLoading(false)
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    
    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      if (!backup.modules) {
        throw new Error('Format de fichier invalide')
      }

      const confirmMsg = `Êtes-vous sûr de vouloir restaurer cette sauvegarde du ${new Date(backup.date).toLocaleDateString('fr-FR')} ?
      
Modules à restaurer : ${Object.keys(backup.modules).join(', ')}

⚠️ ATTENTION : Cela remplacera toutes les données actuelles !`

      if (!confirm(confirmMsg)) {
        setLoading(false)
        return
      }

      // Restaurer chaque module
      for (const [moduleId, data] of Object.entries(backup.modules)) {
        let endpoint = ''
        switch(moduleId) {
          case 'clients': endpoint = '/api/admin/crm/restore'; break
          case 'sites': endpoint = '/api/admin/sites/restore'; break
          case 'facturation': endpoint = '/api/admin/facturation/restore'; break
          case 'depenses': endpoint = '/api/admin/depenses/restore'; break
          case 'outils': endpoint = '/api/admin/outils/restore'; break
          case 'agenda': endpoint = '/api/admin/agenda/restore'; break
          case 'parametres': endpoint = '/api/admin/parametres/restore'; break
        }

        if (endpoint) {
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        }
      }

      alert('Restauration terminée avec succès !')
      window.location.reload() // Recharger pour voir les nouvelles données

    } catch (error) {
      alert('Erreur lors de l\'import : ' + error.message)
    } finally {
      setLoading(false)
      event.target.value = '' // Reset input file
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                ← Retour
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">💾 Sauvegarde & Export</h1>
                <p className="text-sm text-gray-500 mt-1">Exportez et importez vos données</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">📤 Exporter les données</h2>
              <p className="text-sm text-gray-500 mt-1">Sélectionnez les modules à sauvegarder</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {Object.values(selectedModules).every(v => v) ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
              </div>

              <div className="space-y-3">
                {modules.map(module => (
                  <label key={module.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedModules[module.id]}
                      onChange={(e) => setSelectedModules(prev => ({
                        ...prev,
                        [module.id]: e.target.checked
                      }))}
                      className="mr-3"
                    />
                    <span className="text-2xl mr-3">{module.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{module.nom}</p>
                      <p className="text-xs text-gray-500">{module.fichier}</p>
                    </div>
                    {exportStatus[module.id] === 'success' && (
                      <span className="text-green-600">✓</span>
                    )}
                    {exportStatus[module.id] === 'error' && (
                      <span className="text-red-600">✗</span>
                    )}
                  </label>
                ))}
              </div>

              <button
                onClick={handleExportSelected}
                disabled={loading || Object.values(selectedModules).every(v => !v)}
                className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Export en cours...
                  </span>
                ) : (
                  '📥 Télécharger la sauvegarde'
                )}
              </button>
            </div>
          </div>

          {/* Import */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">📥 Importer des données</h2>
              <p className="text-sm text-gray-500 mt-1">Restaurer depuis une sauvegarde</p>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-gray-600 mb-4">
                  Glissez un fichier de sauvegarde ici ou
                </p>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition inline-block">
                    Parcourir
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Formats acceptés : .json
                </p>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex">
                  <span className="text-amber-600 mr-2">⚠️</span>
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Attention</p>
                    <p className="text-amber-700 mt-1">
                      L'import remplacera toutes les données existantes des modules sélectionnés. 
                      Assurez-vous d'avoir une sauvegarde récente avant de procéder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique */}
        {backups.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">📚 Historique des sauvegardes</h2>
              <p className="text-sm text-gray-500 mt-1">Dernières sauvegardes effectuées</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modules</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {backups.reverse().map(backup => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(backup.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {backup.modules.map(moduleId => {
                            const module = modules.find(m => m.id === moduleId)
                            return module ? (
                              <span key={moduleId} className="text-xl" title={module.nom}>
                                {module.icon}
                              </span>
                            ) : null
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatFileSize(backup.taille)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Conseils */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">💡 Bonnes pratiques</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Effectuez des sauvegardes régulières (hebdomadaires)</li>
              <li>• Conservez plusieurs versions de sauvegarde</li>
              <li>• Stockez vos sauvegardes sur un support externe</li>
              <li>• Testez régulièrement la restauration</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-medium text-green-900 mb-2">🔒 Sécurité</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Les sauvegardes contiennent des données sensibles</li>
              <li>• Chiffrez vos fichiers de sauvegarde</li>
              <li>• Ne partagez pas vos sauvegardes</li>
              <li>• Utilisez un mot de passe pour les archives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}