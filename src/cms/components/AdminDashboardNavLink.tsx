import type { ServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

export default function AdminDashboardNavLink({ i18n, payload, viewType }: ServerProps) {
  const href = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: '',
  })

  const className = viewType === 'dashboard' ? 'nav__link active' : 'nav__link'

  return (
    <div className="nav-group nav-group--dashboard-shortcut">
      <a className={className} href={href} id="nav-dashboard-home">
        {i18n.t('general:dashboard')}
      </a>
    </div>
  )
}
