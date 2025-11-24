-- Create states table if it doesn't exist
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all Mexican states
INSERT INTO states (nombre) VALUES
('Aguascalientes'), ('Baja California'), ('Baja California Sur'), ('Campeche'),
('Chiapas'), ('Chihuahua'), ('Ciudad de México'), ('Coahuila'), ('Colima'),
('Durango'), ('Estado de México'), ('Guanajuato'), ('Guerrero'), ('Hidalgo'),
('Jalisco'), ('Michoacán'), ('Morelos'), ('Nayarit'), ('Nuevo León'), ('Oaxaca'),
('Puebla'), ('Querétaro'), ('Quintana Roo'), ('San Luis Potosí'), ('Sinaloa'),
('Sonora'), ('Tabasco'), ('Tamaulipas'), ('Tlaxcala'), ('Veracruz'),
('Yucatán'), ('Zacatecas')
ON CONFLICT (nombre) DO NOTHING;

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Everyone can read states" ON states;

-- Allow all users to read states
CREATE POLICY "Everyone can read states" ON states FOR SELECT TO authenticated USING (true);
