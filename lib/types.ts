export type UserRole = "auxiliar" | "bodega" | "lider" | "supervisor" | "gerente"

export type Profile = {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type Insumo = {
  id: string
  codigo: string
  nombre: string
  categoria: string
  unidad_medida: string
  stock_actual: number
  stock_minimo: number
  stock_critico: number
  ubicacion: string | null
  created_at: string
  updated_at: string
}

export type Folio = {
  id: string
  numero_folio: string
  paciente_nombre: string
  paciente_rut: string
  fecha_cirugia: string
  hora_cirugia: string
  tipo_cirugia: string
  anestesiologo: string
  pabellon: string
  estado: string
  observaciones: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type FolioDetalle = {
  id: string
  folio_id: string
  insumo_id: string
  cantidad: number
  created_at: string
}

export type Kardex = {
  id: string
  insumo_id: string
  tipo_movimiento: string
  cantidad: number
  stock_anterior: number
  stock_nuevo: number
  folio_id: string | null
  responsable_id: string | null
  observaciones: string | null
  created_at: string
}

export type Transferencia = {
  id: string
  numero_transferencia: string
  origen: string
  destino: string
  estado: string
  solicitante_id: string | null
  receptor_id: string | null
  fecha_solicitud: string
  fecha_recepcion: string | null
  observaciones: string | null
  created_at: string
  updated_at: string
}

export type TransferenciaDetalle = {
  id: string
  transferencia_id: string
  insumo_id: string
  cantidad_solicitada: number
  cantidad_recibida: number | null
  created_at: string
}

export type AppRole = "auxiliar" | "almacenista" | "lider" | "supervisor" | "gerente" | "gerente_operaciones"

export type EstadoFolio = "activo" | "cancelado" | "completado"

export type EstadoTraspaso = "pendiente" | "aprobado" | "rechazado" | "completado"

export type EspecialidadMedica =
  | "anestesiologia"
  | "cirugia_general"
  | "traumatologia"
  | "ginecologia"
  | "urologia"
  | "otra"

export type TipoMovimiento = "entrada" | "salida_por_folio" | "ajuste" | "traspaso_entrada" | "traspaso_salida"

export type Hospital = {
  id: string
  estado: string
  tipo: string
  numero_clinica: string
  localidad: string | null
  procedimientos: any | null
  created_at: string
  updated_at: string
}

export interface RolePermissions {
  canViewDashboard: boolean
  canViewFolios: boolean
  canCreateFolios: boolean
  canCancelFolios: boolean
  canViewInventory: boolean
  canManageInventory: boolean
  canViewKardex: boolean
  canViewMedicos: boolean
  canManageMedicos: boolean
  canViewPaquetes: boolean
  canViewReportes: boolean
  canViewTraspasos: boolean
  canManageTraspasos: boolean
  canViewUsuarios: boolean
  canManageUsuarios: boolean
  canAccessAllHospitals: boolean
  canAccessMultipleHospitals: boolean
}

export const ROLE_PERMISSIONS: Record<AppRole, RolePermissions> = {
  auxiliar: {
    canViewDashboard: true,
    canViewFolios: true,
    canCreateFolios: true,
    canCancelFolios: false,
    canViewInventory: false,
    canManageInventory: false,
    canViewKardex: false,
    canViewMedicos: false,
    canManageMedicos: false,
    canViewPaquetes: false,
    canViewReportes: false,
    canViewTraspasos: false,
    canManageTraspasos: false,
    canViewUsuarios: false,
    canManageUsuarios: false,
    canAccessAllHospitals: false,
    canAccessMultipleHospitals: false,
  },
  almacenista: {
    canViewDashboard: true,
    canViewFolios: false,
    canCreateFolios: false,
    canCancelFolios: false,
    canViewInventory: true,
    canManageInventory: true,
    canViewKardex: true,
    canViewMedicos: false,
    canManageMedicos: false,
    canViewPaquetes: false,
    canViewReportes: false,
    canViewTraspasos: false,
    canManageTraspasos: false,
    canViewUsuarios: false,
    canManageUsuarios: false,
    canAccessAllHospitals: false,
    canAccessMultipleHospitals: false,
  },
  lider: {
    canViewDashboard: true,
    canViewFolios: true,
    canCreateFolios: true,
    canCancelFolios: false,
    canViewInventory: true,
    canManageInventory: true,
    canViewKardex: true,
    canViewMedicos: true,
    canManageMedicos: true,
    canViewPaquetes: true,
    canViewReportes: true,
    canViewTraspasos: false,
    canManageTraspasos: false,
    canViewUsuarios: false,
    canManageUsuarios: false,
    canAccessAllHospitals: false,
    canAccessMultipleHospitals: false,
  },
  supervisor: {
    canViewDashboard: true,
    canViewFolios: true,
    canCreateFolios: true,
    canCancelFolios: true,
    canViewInventory: true,
    canManageInventory: true,
    canViewKardex: true,
    canViewMedicos: true,
    canManageMedicos: true,
    canViewPaquetes: true,
    canViewReportes: true,
    canViewTraspasos: false,
    canManageTraspasos: false,
    canViewUsuarios: false,
    canManageUsuarios: false,
    canAccessAllHospitals: false,
    canAccessMultipleHospitals: true,
  },
  gerente: {
    canViewDashboard: true,
    canViewFolios: true,
    canCreateFolios: true,
    canCancelFolios: true,
    canViewInventory: true,
    canManageInventory: true,
    canViewKardex: true,
    canViewMedicos: true,
    canManageMedicos: true,
    canViewPaquetes: true,
    canViewReportes: true,
    canViewTraspasos: true,
    canManageTraspasos: true,
    canViewUsuarios: true,
    canManageUsuarios: true,
    canAccessAllHospitals: true,
    canAccessMultipleHospitals: true,
  },
  gerente_operaciones: {
    canViewDashboard: true,
    canViewFolios: true,
    canCreateFolios: true,
    canCancelFolios: true,
    canViewInventory: true,
    canManageInventory: true,
    canViewKardex: true,
    canViewMedicos: true,
    canManageMedicos: true,
    canViewPaquetes: true,
    canViewReportes: true,
    canViewTraspasos: true,
    canManageTraspasos: true,
    canViewUsuarios: true,
    canManageUsuarios: true,
    canAccessAllHospitals: true,
    canAccessMultipleHospitals: true,
  },
}
