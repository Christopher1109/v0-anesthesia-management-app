-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('auxiliar', 'bodega', 'lider', 'supervisor', 'gerente');

-- Users/Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'auxiliar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insumos (Supplies/Inventory)
CREATE TABLE IF NOT EXISTS insumos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  unidad_medida TEXT NOT NULL,
  stock_actual INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 10,
  stock_critico INTEGER NOT NULL DEFAULT 5,
  ubicacion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Folios (Anesthesia Procedures)
CREATE TABLE IF NOT EXISTS folios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_folio TEXT UNIQUE NOT NULL,
  paciente_nombre TEXT NOT NULL,
  paciente_rut TEXT NOT NULL,
  fecha_cirugia DATE NOT NULL,
  hora_cirugia TIME NOT NULL,
  tipo_cirugia TEXT NOT NULL,
  anestesiologo TEXT NOT NULL,
  pabellon TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  observaciones TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Folio Details (Items used in each procedure)
CREATE TABLE IF NOT EXISTS folio_detalles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
  insumo_id UUID NOT NULL REFERENCES insumos(id),
  cantidad INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kardex (Inventory movements)
CREATE TABLE IF NOT EXISTS kardex (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insumo_id UUID NOT NULL REFERENCES insumos(id),
  tipo_movimiento TEXT NOT NULL, -- 'entrada', 'salida', 'ajuste', 'transferencia'
  cantidad INTEGER NOT NULL,
  stock_anterior INTEGER NOT NULL,
  stock_nuevo INTEGER NOT NULL,
  folio_id UUID REFERENCES folios(id),
  responsable_id UUID REFERENCES profiles(id),
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transferencias (Transfers between units)
CREATE TABLE IF NOT EXISTS transferencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_transferencia TEXT UNIQUE NOT NULL,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'en_transito', 'recibida', 'rechazada'
  solicitante_id UUID REFERENCES profiles(id),
  receptor_id UUID REFERENCES profiles(id),
  fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_recepcion TIMESTAMPTZ,
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transfer Details
CREATE TABLE IF NOT EXISTS transferencia_detalles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transferencia_id UUID NOT NULL REFERENCES transferencias(id) ON DELETE CASCADE,
  insumo_id UUID NOT NULL REFERENCES insumos(id),
  cantidad_solicitada INTEGER NOT NULL,
  cantidad_recibida INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE folios ENABLE ROW LEVEL SECURITY;
ALTER TABLE folio_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kardex ENABLE ROW LEVEL SECURITY;
ALTER TABLE transferencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE transferencia_detalles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for insumos (all authenticated users can view)
CREATE POLICY "Authenticated users can view insumos" ON insumos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Bodega and above can insert insumos" ON insumos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('bodega', 'lider', 'supervisor', 'gerente'))
);
CREATE POLICY "Bodega and above can update insumos" ON insumos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('bodega', 'lider', 'supervisor', 'gerente'))
);

-- RLS Policies for folios
CREATE POLICY "Authenticated users can view folios" ON folios FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert folios" ON folios FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update folios" ON folios FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for folio_detalles
CREATE POLICY "Authenticated users can view folio_detalles" ON folio_detalles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert folio_detalles" ON folio_detalles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for kardex
CREATE POLICY "Authenticated users can view kardex" ON kardex FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert kardex" ON kardex FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for transferencias
CREATE POLICY "Authenticated users can view transferencias" ON transferencias FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert transferencias" ON transferencias FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update transferencias" ON transferencias FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for transferencia_detalles
CREATE POLICY "Authenticated users can view transferencia_detalles" ON transferencia_detalles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert transferencia_detalles" ON transferencia_detalles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_folios_fecha_cirugia ON folios(fecha_cirugia);
CREATE INDEX idx_folios_estado ON folios(estado);
CREATE INDEX idx_insumos_codigo ON insumos(codigo);
CREATE INDEX idx_kardex_insumo_id ON kardex(insumo_id);
CREATE INDEX idx_kardex_created_at ON kardex(created_at);
CREATE INDEX idx_transferencias_estado ON transferencias(estado);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insumos_updated_at BEFORE UPDATE ON insumos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folios_updated_at BEFORE UPDATE ON folios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transferencias_updated_at BEFORE UPDATE ON transferencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
