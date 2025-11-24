-- =================================================================
-- DATOS INICIALES DEL SISTEMA
-- Estados e Insumos básicos
-- =================================================================

-- =================================================================
-- 1. ESTADOS DE MÉXICO
-- =================================================================

INSERT INTO states (nombre) VALUES
('Aguascalientes'),
('Baja California'),
('Baja California Sur'),
('Campeche'),
('Chiapas'),
('Chihuahua'),
('Ciudad de México'),
('Coahuila'),
('Colima'),
('Durango'),
('Estado de México'),
('Guanajuato'),
('Guerrero'),
('Hidalgo'),
('Jalisco'),
('Michoacán'),
('Morelos'),
('Nayarit'),
('Nuevo León'),
('Oaxaca'),
('Puebla'),
('Querétaro'),
('Quintana Roo'),
('San Luis Potosí'),
('Sinaloa'),
('Sonora'),
('Tabasco'),
('Tamaulipas'),
('Tlaxcala'),
('Veracruz'),
('Yucatán'),
('Zacatecas')
ON CONFLICT (nombre) DO NOTHING;

-- =================================================================
-- 2. INSUMOS BÁSICOS DE ANESTESIA
-- =================================================================
-- Updated to use correct column names: codigo, nombre, categoria, unidad_medida, stock_actual, stock_minimo, stock_critico, ubicacion

INSERT INTO insumos (codigo, nombre, categoria, unidad_medida, stock_actual, stock_minimo, stock_critico, ubicacion) VALUES
-- Anestésicos intravenosos
('PROP-001', 'Propofol 1% 20ml', 'Anestésico IV', 'ampolleta', 500, 100, 50, 'Almacén Principal'),
('MIDA-001', 'Midazolam 5mg/5ml', 'Anestésico IV', 'ampolleta', 300, 50, 25, 'Almacén Principal'),
('FENT-001', 'Fentanyl 0.1mg/2ml', 'Anestésico IV', 'ampolleta', 200, 50, 25, 'Almacén Principal'),
('ROCU-001', 'Rocuronio 50mg/5ml', 'Relajante Muscular', 'ampolleta', 150, 30, 15, 'Almacén Principal'),
('ATRO-001', 'Atropina 1mg/ml', 'Anticolinérgico', 'ampolleta', 100, 20, 10, 'Almacén Principal'),

-- Anestésicos inhalados
('SEVO-001', 'Sevoflurano 250ml', 'Anestésico Inhalado', 'frasco', 50, 10, 5, 'Almacén Principal'),
('OXIG-001', 'Oxígeno Medicinal', 'Gas Medicinal', 'litro', 2000, 500, 250, 'Almacén de Gases'),

-- Material descartable
('JER10-001', 'Jeringa 10ml', 'Material Descartable', 'pieza', 1000, 200, 100, 'Almacén Principal'),
('JER05-001', 'Jeringa 5ml', 'Material Descartable', 'pieza', 1000, 200, 100, 'Almacén Principal'),
('AGU21-001', 'Aguja Hipodérmica 21G', 'Material Descartable', 'pieza', 800, 150, 75, 'Almacén Principal'),
('CAT18-001', 'Catéter IV 18G', 'Material Descartable', 'pieza', 500, 100, 50, 'Almacén Principal'),
('CAT20-001', 'Catéter IV 20G', 'Material Descartable', 'pieza', 500, 100, 50, 'Almacén Principal'),
('TET75-001', 'Tubo Endotraqueal 7.5mm', 'Material Descartable', 'pieza', 200, 50, 25, 'Almacén Principal'),
('TET80-001', 'Tubo Endotraqueal 8.0mm', 'Material Descartable', 'pieza', 200, 50, 25, 'Almacén Principal'),
('MASL4-001', 'Mascarilla Laríngea #4', 'Material Descartable', 'pieza', 100, 20, 10, 'Almacén Principal'),

-- Soluciones
('HART-001', 'Solución Hartmann 1000ml', 'Solución', 'bolsa', 800, 200, 100, 'Almacén Principal'),
('SAL09-001', 'Solución Salina 0.9% 1000ml', 'Solución', 'bolsa', 800, 200, 100, 'Almacén Principal'),
('DEX05-001', 'Dextrosa 5% 1000ml', 'Solución', 'bolsa', 500, 100, 50, 'Almacén Principal'),

-- Medicamentos de emergencia
('EPIN-001', 'Epinefrina 1mg/ml', 'Emergencia', 'ampolleta', 100, 20, 10, 'Almacén Principal'),
('EFED-001', 'Efedrina 50mg/ml', 'Emergencia', 'ampolleta', 80, 20, 10, 'Almacén Principal'),
('ONDA-001', 'Ondansetrón 8mg/4ml', 'Antiemético', 'ampolleta', 150, 30, 15, 'Almacén Principal'),
('DEXA-001', 'Dexametasona 8mg/2ml', 'Esteroide', 'ampolleta', 120, 25, 12, 'Almacén Principal')
ON CONFLICT (codigo) DO NOTHING;

-- =================================================================
-- FIN DE DATOS INICIALES
-- =================================================================
