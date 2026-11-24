import { useEffect, useState } from 'react'
import Message, { failed, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'
import type { AdminUser, Profile } from '../../types'
import formatDate from '../../utils/formatDate'
import EditUserDialog from './EditUserDialog'
import SuspendDialog from './SuspendDialog'

const UsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [editing, setEditing] = useState<{ user: AdminUser; profile: Profile } | null>(null)
  const [suspending, setSuspending] = useState<AdminUser | null>(null)

  useEffect(() => {
    api.admin.users().then(setUsers, () => setNotice(failed('Error al cargar los usuarios.')))
  }, [])

  const patch = (id: string, data: Partial<AdminUser>) => setUsers((list) => list.map((user) => (user.id === id ? { ...user, ...data } : user)))

  const edit = async (user: AdminUser) => {
    setNotice(null)
    try { setEditing({ user, profile: await api.admin.user(user.id) }) }
    catch (error) { setNotice(failed(errorMessage(error, 'Error al cargar el usuario.'))) }
  }
  const toggleSuspension = async (user: AdminUser, note: string) => {
    setSuspending(null)
    setEditing(null)
    try { patch(user.id, await api.admin.suspend(user.id, note)) }
    catch (error) { setNotice(failed(errorMessage(error, 'Error al suspender.'))) }
  }

  return (
    <div className='adminSection'>
      <Message notice={notice} className='adminError' />
      <div className='adminCardList'>
        {users.map((u) => (
          <div key={u.id} className={`adminCard ${u.suspended ? 'adminCardInactive' : ''}`}>
            <div className={`adminCardAvatar ${u.suspended ? 'suspended' : ''}`}>{u.firstName[0]}{u.lastName[0]}</div>
            <div className='adminCardBody'>
              <div className='adminCardHeader'>
                <h3 className='adminCardTitle'>{u.firstName} {u.lastName}</h3>
                <div className='adminCardBadges'>
                  <span className={`roleBadge ${u.role}`}>{u.role}</span>
                  <span className={`activeBadge ${u.suspended ? 'off' : 'on'}`}>{u.suspended ? 'Suspendido' : 'Activo'}</span>
                </div>
              </div>
              <p className='adminCardMeta'>{u.email}</p>
              <p className='adminCardMeta'>Registro: {formatDate(u.createdAt)}</p>
              {u.suspensionNote && <p className='adminCardNote'>Nota: {u.suspensionNote}</p>}
            </div>
            <div className='adminCardActions'>
              <button className='editBtn' onClick={() => void edit(u)}>Editar</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditUserDialog
          user={editing.user} profile={editing.profile}
          onSaved={(profile) => patch(editing.user.id, { firstName: profile.firstName, lastName: profile.lastName })}
          onToggleSuspension={() => (editing.user.suspended ? void toggleSuspension(editing.user, '') : setSuspending(editing.user))}
          onClose={() => setEditing(null)}
        />
      )}
      {suspending && <SuspendDialog user={suspending} onConfirm={(note) => void toggleSuspension(suspending, note)} onClose={() => setSuspending(null)} />}
    </div>
  )
}

export default UsersTab
