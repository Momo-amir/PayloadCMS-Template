import type { ServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

export default function AdminDashboardNavLink({ i18n, payload, viewType }: ServerProps) {
  const href = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: '',
  })

  const label = <span className="nav__link-label">{i18n.t('general:dashboard')}</span>

  return (
    <div className="nav-group nav-group--dashboard-shortcut">
      {viewType === 'dashboard' ? (
        <div className="nav__link" id="nav-dashboard-home">
          <div className="nav__link-indicator" />
          {label}
        </div>
      ) : (
        <a className="nav__link" href={href} id="nav-dashboard-home">
          {label}
        </a>
      )}
    </div>
  )
}
