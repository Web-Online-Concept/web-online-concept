import Link from 'next/link'

export default function BlogPagination({ currentPage, totalPages, basePath }) {
  // Calculer les pages à afficher
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // Nombre maximum de pages visibles
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    // Ajuster si on est proche de la fin
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <nav className="flex justify-center items-center space-x-2">
      {/* Bouton Précédent */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#0073a8] transition-colors"
          aria-label="Page précédente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="px-3 py-2 text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}
      
      {/* Première page */}
      {pageNumbers[0] > 1 && (
        <>
          <Link
            href={`${basePath}?page=1`}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#0073a8] transition-colors"
          >
            1
          </Link>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}
      
      {/* Numéros de page */}
      {pageNumbers.map(page => (
        page === currentPage ? (
          <span
            key={page}
            className="px-4 py-2 text-white bg-[#0073a8] border border-[#0073a8] rounded-md font-semibold"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#0073a8] transition-colors"
          >
            {page}
          </Link>
        )
      ))}
      
      {/* Dernière page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Link
            href={`${basePath}?page=${totalPages}`}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#0073a8] transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}
      
      {/* Bouton Suivant */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#0073a8] transition-colors"
          aria-label="Page suivante"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="px-3 py-2 text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  )
}