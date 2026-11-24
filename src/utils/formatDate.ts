const formatDate = (iso: string | null | undefined, fallback = '—') => (
  iso ? new Date(iso).toLocaleDateString('es-ES') : fallback
)

export default formatDate
