export interface Notice { type: 'success' | 'error'; text: string }

const Message = ({ notice, className = 'movieMsg' }: { notice: Notice | null; className?: string }) => (
  notice && <p className={`${className} ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>
)

export const ok = (text: string): Notice => ({ type: 'success', text })
export const failed = (text: string): Notice => ({ type: 'error', text })

export default Message
